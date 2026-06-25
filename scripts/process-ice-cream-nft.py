#!/usr/bin/env python3
"""Process Ice Cream Week soulbound NFT assets.

Two responsibilities:

  A. External-image pipeline (`process`):
     1. Remove chroma-key (#FF00FF) or corner-connected black/white
     2. Trim to opaque bounding box
     3. Nearest-neighbor downscale to fit inside 58×58
     4. Center on 64×64 transparent canvas
     5. Nearest-neighbor upscale to 512×512 master

  B. Hand-drawn meme cones (`generate-all`, `preview`, `contact-sheet`):
     A small declarative pixel-art engine (see the Canvas class) draws each
     meme from semantic primitives — parametric scoop + cone, mirrored eye
     pairs, parabolic mouths, Bresenham laser beams, rainbow bands clipped to
     the scoop, auto-computed outline. This replaces the old hand-counted
     fixed-width ASCII strings, so faces stay symmetric, centered and crisp.

Usage:
  python3 scripts/process-ice-cream-nft.py generate-all --out src/ice-cream/assets/nft
  python3 scripts/process-ice-cream-nft.py preview --slug pepe
  python3 scripts/process-ice-cream-nft.py contact-sheet --out /tmp/ice-cream-sheet.png
  python3 scripts/process-ice-cream-nft.py process --src raw.png --slug pepe --bg chroma --out ...
"""

from __future__ import annotations

import argparse
import math
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable

from PIL import Image, ImageDraw

NATIVE = 64
MASTER = 512
MAX_CONTENT = 58
CHROMA = (255, 0, 255)
CHROMA_FUZZ = 20


def _rgb_dist(a: tuple[int, ...], b: tuple[int, ...]) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def remove_chroma(img: Image.Image, fuzz: int = CHROMA_FUZZ) -> Image.Image:
    rgba = img.convert('RGBA')
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if _rgb_dist((r, g, b), CHROMA) <= fuzz:
                px[x, y] = (0, 0, 0, 0)
    return rgba


def _flood_remove_corners(img: Image.Image, target: tuple[int, int, int], fuzz: int) -> Image.Image:
    rgba = img.convert('RGBA')
    w, h = rgba.size
    px = rgba.load()
    stack = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    seen: set[tuple[int, int]] = set()

    def is_bg(r: int, g: int, b: int) -> bool:
        return _rgb_dist((r, g, b), target) <= fuzz

    while stack:
        x, y = stack.pop()
        if (x, y) in seen or x < 0 or y < 0 or x >= w or y >= h:
            continue
        seen.add((x, y))
        r, g, b, a = px[x, y]
        if a == 0 or not is_bg(r, g, b):
            continue
        px[x, y] = (0, 0, 0, 0)
        stack.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    return rgba


def remove_corner_black(img: Image.Image, fuzz: int = 10) -> Image.Image:
    return _flood_remove_corners(img, (0, 0, 0), fuzz)


def remove_corner_white(img: Image.Image, fuzz: int = 12) -> Image.Image:
    return _flood_remove_corners(img, (255, 255, 255), fuzz)


def content_bbox(img: Image.Image) -> tuple[int, int, int, int]:
    rgba = img.convert('RGBA')
    px = rgba.load()
    w, h = rgba.size
    min_x, min_y, max_x, max_y = w, h, -1, -1
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 0:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if max_x < 0:
        return 0, 0, w, h
    return min_x, min_y, max_x + 1, max_y + 1


def fit_native(img: Image.Image) -> Image.Image:
    x0, y0, x1, y1 = content_bbox(img)
    cropped = img.crop((x0, y0, x1, y1))
    cw, ch = cropped.size
    scale = min(MAX_CONTENT / cw, MAX_CONTENT / ch)
    nw = max(1, round(cw * scale))
    nh = max(1, round(ch * scale))
    resized = cropped.resize((nw, nh), Image.Resampling.NEAREST)
    canvas = Image.new('RGBA', (NATIVE, NATIVE), (0, 0, 0, 0))
    canvas.paste(resized, ((NATIVE - nw) // 2, (NATIVE - nh) // 2))
    return canvas


def to_master(native: Image.Image) -> Image.Image:
    return native.resize((MASTER, MASTER), Image.Resampling.NEAREST)


def write_pair(native: Image.Image, out_dir: Path, slug: str) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    native_path = out_dir / f'{slug}-native.png'
    master_path = out_dir / f'{slug}-master.png'
    native.save(native_path, optimize=True)
    to_master(native).save(master_path, optimize=True)
    print(f'  wrote {native_path} ({NATIVE}×{NATIVE}, transparent)')
    print(f'  wrote {master_path} ({MASTER}×{MASTER})')


def process_source(src: Path, out_dir: Path, slug: str, *, bg: str) -> None:
    img = Image.open(src)
    if bg == 'chroma':
        img = remove_chroma(img)
    elif bg == 'black':
        img = remove_corner_black(img)
    elif bg == 'white':
        img = remove_corner_white(img)
    else:
        raise ValueError(f'unknown bg mode: {bg!r}')
    write_pair(fit_native(img), out_dir, slug)


# ============================================================================
# Declarative pixel-art engine
# ============================================================================
# Faces are composed from primitives on a fixed-size Canvas, so width errors
# are impossible and left/right symmetry is guaranteed via mirrored helpers.
# Working resolution is deliberately generous (downscaled to 58px afterwards)
# so eyes, mouths and structure have room to read as the meme they represent.

TRANSPARENT = '.'
OUTLINE = 'K'      # dark silhouette line
GLOSS = 'L'        # white scoop highlight
SCOOP = 'S'        # scoop body — recolored per meme
WHITE = 'W'
EYEBLK = 'E'       # facial black (pupils, mouths) — distinct from outline

# True 1:1 grid — the canvas *is* the native NFT (64×64), so every drawn pixel
# maps to exactly one output pixel (master = this grid upscaled ×8 to 512).
CW, CH = NATIVE, NATIVE
SCOOP_CX = 31
SCOOP_CY = 24
SCOOP_RX = 20
SCOOP_RY = 18
CONE_TOP_HALF = 12
CONE_TIP_Y = CH - 3

BASE_PALETTE: dict[str, tuple[int, int, int, int]] = {
    TRANSPARENT: (0, 0, 0, 0),
    OUTLINE: (26, 18, 14, 255),
    GLOSS: (255, 255, 255, 235),
    WHITE: (252, 252, 255, 255),
    EYEBLK: (18, 16, 22, 255),
    'C': (214, 158, 74, 255),   # waffle light
    'c': (150, 96, 44, 255),    # waffle dark
}

NEIGHBORS8 = ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1))


class Canvas:
    """A small grid with drawing primitives. (0,0) is top-left."""

    def __init__(self, w: int = CW, h: int = CH) -> None:
        self.w, self.h = w, h
        self.g: list[list[str]] = [[TRANSPARENT] * w for _ in range(h)]

    def inb(self, x: int, y: int) -> bool:
        return 0 <= x < self.w and 0 <= y < self.h

    def get(self, x: int, y: int) -> str:
        return self.g[y][x] if self.inb(x, y) else TRANSPARENT

    def put(self, x: int, y: int, ch: str, *, only: frozenset[str] | None = None) -> None:
        if not self.inb(x, y):
            return
        if only is not None and self.g[y][x] not in only:
            return
        self.g[y][x] = ch

    # --- area fills -------------------------------------------------------
    def fill_ellipse(self, cx: float, cy: float, rx: float, ry: float, ch: str,
                     *, only: frozenset[str] | None = None) -> None:
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                nx = (x - cx) / rx if rx else 0.0
                ny = (y - cy) / ry if ry else 0.0
                if nx * nx + ny * ny <= 1.0:
                    self.put(x, y, ch, only=only)

    def disc(self, cx: float, cy: float, r: float, ch: str,
             *, only: frozenset[str] | None = None) -> None:
        self.fill_ellipse(cx, cy, r, r, ch, only=only)

    def rect(self, x0: int, y0: int, x1: int, y1: int, ch: str,
             *, only: frozenset[str] | None = None) -> None:
        for y in range(min(y0, y1), max(y0, y1) + 1):
            for x in range(min(x0, x1), max(x0, x1) + 1):
                self.put(x, y, ch, only=only)

    def hline(self, x0: int, x1: int, y: int, ch: str, **kw) -> None:
        self.rect(x0, y, x1, y, ch, **kw)

    def vline(self, x: int, y0: int, y1: int, ch: str, **kw) -> None:
        self.rect(x, y0, x, y1, ch, **kw)

    def triangle(self, p0: tuple[int, int], p1: tuple[int, int], p2: tuple[int, int],
                 ch: str, *, only: frozenset[str] | None = None) -> None:
        xs = [p0[0], p1[0], p2[0]]
        ys = [p0[1], p1[1], p2[1]]

        def edge(px, py, ax, ay, bx, by):
            return (px - bx) * (ay - by) - (ax - bx) * (py - by)

        for y in range(min(ys), max(ys) + 1):
            for x in range(min(xs), max(xs) + 1):
                d1 = edge(x, y, *p0, *p1)
                d2 = edge(x, y, *p1, *p2)
                d3 = edge(x, y, *p2, *p0)
                has_neg = d1 < 0 or d2 < 0 or d3 < 0
                has_pos = d1 > 0 or d2 > 0 or d3 > 0
                if not (has_neg and has_pos):
                    self.put(x, y, ch, only=only)

    def line(self, x0: int, y0: int, x1: int, y1: int, ch: str, *, thick: int = 1) -> None:
        dx = abs(x1 - x0)
        dy = -abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx + dy
        x, y = x0, y0
        while True:
            for t in range(thick):
                self.put(x, y + t, ch)
                self.put(x + t, y, ch)
            if x == x1 and y == y1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                x += sx
            if e2 <= dx:
                err += dx
                y += sy

    def arc(self, cx: float, cy: float, rx: float, ry: float, ch: str,
            *, upper: bool = False, lower: bool = False) -> None:
        steps = int(max(rx, ry) * 8)
        for i in range(steps + 1):
            a = 2 * math.pi * i / steps
            x = round(cx + rx * math.cos(a))
            y = round(cy + ry * math.sin(a))
            if upper and y > cy:
                continue
            if lower and y < cy:
                continue
            self.put(x, y, ch)

    def curve(self, cx: int, y: int, half: int, depth: int, ch: str,
              *, up: bool = True, thick: int = 1) -> None:
        """Parabolic mouth — symmetric by construction. up=True lifts corners."""
        for i in range(-half, half + 1):
            f = (i / half) ** 2 if half else 0.0
            yy = y - round(depth * f) if up else y + round(depth * f)
            for t in range(thick):
                self.put(cx + i, yy + t, ch)

    def band(self, y0: int, y1: int, colors: list[str], *, only: frozenset[str]) -> None:
        """Horizontal stripes from y0..y1, one color per row, clipped to `only`."""
        n = len(colors)
        span = max(1, y1 - y0)
        for y in range(y0, y1 + 1):
            idx = min(n - 1, int((y - y0) / span * n))
            self.hline(0, self.w - 1, y, colors[idx], only=only)

    def add_outline(self, ch: str = OUTLINE) -> None:
        """1px dark outline around every solid cell, drawn into transparent space."""
        targets: list[tuple[int, int]] = []
        for y in range(self.h):
            for x in range(self.w):
                if self.g[y][x] != TRANSPARENT:
                    continue
                if any(self.get(x + dx, y + dy) not in (TRANSPARENT, ch) for dx, dy in NEIGHBORS8):
                    targets.append((x, y))
        for x, y in targets:
            self.g[y][x] = ch

    def rows(self) -> list[str]:
        return [''.join(r) for r in self.g]


def pair(cx: int, off: int, fn: Callable[[int], None]) -> None:
    """Call fn at cx-off and cx+off — mirrored feature placement."""
    fn(cx - off)
    fn(cx + off)


# ----------------------------------------------------------------------------
# Shared scoop + cone
# ----------------------------------------------------------------------------

def draw_cone(c: Canvas) -> None:
    top_y = SCOOP_CY + SCOOP_RY - 6
    span = CONE_TIP_Y - top_y
    for y in range(top_y, CONE_TIP_Y + 1):
        t = (y - top_y) / span
        half = max(0, round(CONE_TOP_HALF * (1 - t)))
        for x in range(SCOOP_CX - half, SCOOP_CX + half + 1):
            c.put(x, y, 'C' if ((x // 3) + (y // 3)) % 2 == 0 else 'c')


def draw_scoop(c: Canvas) -> None:
    c.fill_ellipse(SCOOP_CX, SCOOP_CY, SCOOP_RX, SCOOP_RY, SCOOP)


def add_gloss(c: Canvas) -> None:
    # soft highlight on the upper-left of the dome
    c.arc(SCOOP_CX - 6, SCOOP_CY - 4, SCOOP_RX - 6, SCOOP_RY - 6, GLOSS, upper=True)
    for dx, dy in ((-12, -8), (-11, -8), (-12, -7), (-9, -12), (-8, -12)):
        c.put(SCOOP_CX + dx, SCOOP_CY + dy, GLOSS, only=frozenset({SCOOP}))


# ----------------------------------------------------------------------------
# Meme spec + builder
# ----------------------------------------------------------------------------

@dataclass
class Meme:
    slug: str
    scoop: tuple[int, int, int, int]
    palette: dict[str, tuple[int, int, int, int]]
    face: Callable[[Canvas], None]
    silhouette: Callable[[Canvas], None] | None = None  # ears/beak before outline
    gloss: bool = True


MEMES: dict[str, Meme] = {}


def meme(slug: str, scoop: tuple[int, int, int, int], palette: dict | None = None,
         *, silhouette=None, gloss: bool = True):
    def deco(fn: Callable[[Canvas], None]):
        MEMES[slug] = Meme(slug, scoop, palette or {}, fn, silhouette, gloss)
        return fn
    return deco


def full_palette(m: Meme) -> dict[str, tuple[int, int, int, int]]:
    return {**BASE_PALETTE, SCOOP: m.scoop, **m.palette}


def build_rows(m: Meme) -> list[str]:
    c = Canvas()
    draw_cone(c)
    draw_scoop(c)
    if m.silhouette:
        m.silhouette(c)
    c.add_outline()
    if m.gloss:
        add_gloss(c)
    m.face(c)
    return c.rows()


def render_canvas_image(m: Meme) -> Image.Image:
    rows = build_rows(m)
    pal = full_palette(m)
    img = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch not in pal:
                raise ValueError(f'{m.slug}: unknown char {ch!r} at ({x},{y})')
            px[x, y] = pal[ch]
    return img


# ----------------------------------------------------------------------------
# Geometry shortcuts for faces
# ----------------------------------------------------------------------------
CX = SCOOP_CX
CY = SCOOP_CY


def cat_ears(inner: str):
    """Two pointed ears rising from the dome top. `inner` is a palette char."""
    def draw(c: Canvas) -> None:
        for sign in (-1, 1):
            ax = CX + sign * 13
            base_in = CX + sign * 6
            base_out = CX + sign * 20
            apex = (ax, CY - SCOOP_RY - 4)
            c.triangle(apex, (base_in, CY - SCOOP_RY + 6), (base_out, CY - SCOOP_RY + 4), SCOOP)
            c.triangle((ax, CY - SCOOP_RY - 1), (base_in + sign * 2, CY - SCOOP_RY + 4),
                       (base_out - sign * 3, CY - SCOOP_RY + 3), inner)
    return draw


def clown_wig(c: Canvas) -> None:
    """A frizzy rainbow afro hugging the upper rim — drawn before the outline."""
    colors = ['r', 'o', 'y', 'g', 'b']
    for layer, extra in enumerate((1, 4)):
        rx = SCOOP_RX + extra
        ry = SCOOP_RY + extra
        n = 26
        for i in range(n + 1):
            a = math.pi * (1.04 + 0.92 * i / n)  # upper arc, left -> right
            x = round(CX + rx * math.cos(a))
            y = round(CY + ry * math.sin(a))
            c.disc(x, y, 2, colors[(i + layer) % len(colors)])


def monke_extras(c: Canvas) -> None:
    """Yellow banana ears + a red antenna ball — drawn before the outline."""
    for s in (-1, 1):
        ex = CX + s * (SCOOP_RX - 1)
        c.fill_ellipse(ex, CY + 1, 4, 7, 'Y')   # banana ear
        c.put(ex, CY - 6, 'n')                   # dark banana tips
        c.put(ex, CY + 8, 'n')
    c.vline(CX, CY - SCOOP_RY - 2, CY - SCOOP_RY + 1, 'n')  # stalk
    c.disc(CX, CY - SCOOP_RY - 4, 3, 'R')                    # red ball


def success_fist(c: Canvas) -> None:
    """A raised clenched fist rising above the scoop (drawn before outline)."""
    fy = CY - SCOOP_RY - 1
    c.fill_ellipse(CX, fy + 2, 6, 5, SCOOP)      # hand mass
    c.fill_ellipse(CX, fy - 1, 6, 3, SCOOP)      # knuckle row
    for kx in (-4, -1, 2, 5):
        c.vline(CX + kx, fy - 3, fy, 'n')        # knuckle creases
    c.hline(CX - 6, CX - 2, fy + 3, SCOOP)       # thumb


# =====================  FACES  =====================

@meme('pepe', (120, 185, 92, 255), {'M': (70, 48, 36, 255)})
def face_pepe(c: Canvas) -> None:
    # Big bulging frog eyes high on the head, one clean wide smile, nostrils.
    ey = CY - 9

    def eye(ex: int) -> None:
        c.disc(ex, ey, 7, WHITE)
        c.arc(ex, ey, 7, 7, OUTLINE)
        c.disc(ex + (2 if ex > CX else -2), ey + 1, 3, EYEBLK)

    pair(CX, 10, eye)
    pair(CX, 3, lambda x: c.put(x, CY + 1, EYEBLK))      # nostrils
    # single clean wide smile
    c.curve(CX, CY + 9, 14, 3, 'M', up=True, thick=2)


@meme('doge', (240, 196, 70, 255), {
    'T': (250, 232, 180, 255), 'n': (40, 28, 20, 255)}, silhouette=cat_ears('T'))
def face_doge(c: Canvas) -> None:
    # Shiba: pale muzzle, round eyes, dark nose, content mouth.
    c.fill_ellipse(CX, CY + 7, 12, 9, 'T')
    pair(CX, 9, lambda x: c.disc(x, CY - 4, 3, EYEBLK))
    pair(CX, 9, lambda x: c.put(x - 1, CY - 5, GLOSS))
    c.disc(CX, CY + 3, 2, 'n')          # nose
    c.vline(CX, CY + 5, CY + 7, EYEBLK)
    c.curve(CX - 4, CY + 7, 4, 2, EYEBLK, up=True)   # content shiba smile
    c.curve(CX + 4, CY + 7, 4, 2, EYEBLK, up=True)


@meme('neon-cypher-cat', (248, 248, 252, 255), {
    'N': (40, 240, 255, 255), 'p': (255, 60, 180, 255), 'P': (170, 60, 255, 255)},
    silhouette=cat_ears('p'))
def face_neon(c: Canvas) -> None:
    # Sharp almond slit eyes with an upturned outer corner, pink cheeks,
    # small nose + cat mouth, neon whiskers.
    def eye(ex: int) -> None:
        s = 1 if ex > CX else -1
        c.fill_ellipse(ex, CY - 3, 4, 2, 'N')
        c.put(ex + 4 * s, CY - 4, 'N')
        c.put(ex + 3 * s, CY - 4, 'N')          # lifted outer corner -> slit
        c.line(ex - s, CY - 4, ex + s, CY - 2, EYEBLK)
    pair(CX, 9, eye)
    pair(CX, 15, lambda x: c.disc(x, CY + 2, 2, 'p'))   # cheeks
    c.put(CX, CY + 3, 'P')                               # nose
    c.curve(CX - 3, CY + 5, 3, 2, 'P', up=False)
    c.curve(CX + 3, CY + 5, 3, 2, 'P', up=False)
    for sy in (0, 1):
        c.line(CX + 7, CY + 4 + sy, CX + 18, CY + 2 + sy, 'N')
        c.line(CX - 7, CY + 4 + sy, CX - 18, CY + 2 + sy, 'N')


@meme('cool-cat', (255, 165, 70, 255), {
    'D': (28, 28, 34, 255), 'm': (150, 70, 40, 255)}, silhouette=cat_ears('m'))
def face_cool_cat(c: Canvas) -> None:
    # Clean look: sleek sunglasses (two lenses + bridge + temple arms) and a
    # single relaxed grin. Nothing else — keeps it uncluttered.
    for s in (-1, 1):
        ex = CX + s * 8
        c.fill_ellipse(ex, CY - 3, 6, 4, 'D')            # lens
        c.put(ex - 2, CY - 4, GLOSS)                     # glint
        c.hline(CX + s * 13, CX + s * 17, CY - 4, 'D')   # temple arm
    c.hline(CX - 2, CX + 2, CY - 4, 'D')                 # bridge
    c.curve(CX, CY + 7, 10, 4, 'm', up=True, thick=2)    # relaxed grin


@meme('clown', (250, 250, 252, 255), {
    'r': (235, 50, 50, 255), 'o': (255, 150, 40, 255), 'y': (255, 220, 60, 255),
    'g': (70, 200, 90, 255), 'b': (70, 130, 255, 255), 'R': (235, 40, 60, 255),
    'B': (70, 130, 255, 255)}, silhouette=clown_wig)
def face_clown(c: Canvas) -> None:
    # Blue diamond eyes, round red nose, big red grin (wig drawn in silhouette).
    def diamond(ex: int) -> None:
        for dy in range(-3, 4):
            w = 3 - abs(dy)
            c.hline(ex - w, ex + w, CY - 4 + dy, 'B')
        c.put(ex, CY - 4, EYEBLK)
    pair(CX, 8, diamond)
    c.disc(CX, CY + 3, 3, 'R')                           # red nose
    c.put(CX - 1, CY + 2, GLOSS)
    c.curve(CX, CY + 12, 12, 5, 'R', up=True, thick=2)   # grin
    pair(CX, 12, lambda x: c.put(x, CY + 9, 'R'))        # mouth corners


@meme('galaxy-brain', (132, 70, 210, 255), {
    'B': (190, 140, 255, 255), 'p': (78, 38, 150, 255), 's': (255, 255, 255, 255),
    'i': (220, 200, 255, 255)}, gloss=False)
def face_galaxy(c: Canvas) -> None:
    # No face — a glowing convoluted brain: even wavy gyri ridges across the
    # whole dome, plus a couple of subtle star sparkles. No fissure / gloss
    # streak, so the surface stays uniform.
    only = frozenset({SCOOP, 'B', 'p'})
    for row, y in enumerate(range(CY - 14, CY + 14, 3)):
        for x in range(CX - SCOOP_RX, CX + SCOOP_RX + 1):
            wave = math.sin((x + row * 3) * 0.6) * 1.6
            yy = y + round(wave)
            c.put(x, yy, 'p', only=only)          # groove
            c.put(x, yy - 1, 'B', only=only)      # ridge highlight
    for sx, sy in ((CX - 10, CY - 9), (CX + 11, CY + 4)):
        c.put(sx, sy, 's')
        c.put(sx + 1, sy, 'i')
        c.put(sx - 1, sy, 'i')
        c.put(sx, sy + 1, 'i')
        c.put(sx, sy - 1, 'i')


@meme('return-to-monke', (140, 92, 50, 255), {
    'T': (210, 168, 120, 255), 'B': (96, 60, 32, 255), 'n': (40, 26, 18, 255),
    'Y': (255, 210, 60, 255), 'R': (220, 40, 40, 255)}, silhouette=monke_extras)
def face_monke(c: Canvas) -> None:
    # Ape: pale muzzle, heavy brow ridge, eyes, nostrils, content mouth.
    # Banana ears + red ball come from the silhouette.
    c.fill_ellipse(CX, CY + 8, 13, 9, 'T')          # muzzle
    c.fill_ellipse(CX, CY - 6, 15, 5, 'B')          # brow ridge
    pair(CX, 8, lambda x: c.disc(x, CY - 3, 3, WHITE))
    pair(CX, 8, lambda x: c.disc(x, CY - 3, 2, EYEBLK))
    pair(CX, 3, lambda x: c.put(x, CY + 5, 'n'))    # nostrils
    c.curve(CX, CY + 11, 7, 2, 'n', up=True, thick=1)


@meme('laser-eyes', (255, 150, 60, 255), {
    'R': (255, 30, 30, 255), 'r': (255, 110, 70, 255), 'h': (255, 250, 220, 255),
    'y': (255, 220, 80, 255)})
def face_laser(c: Canvas) -> None:
    # Determined mouth + white-hot eyes firing straight red beams out past the
    # scoop silhouette, with sparks at the exit points.
    ey = CY - 4

    def eye(ex: int) -> None:
        c.disc(ex, ey, 4, 'y')
        c.disc(ex, ey, 2, 'h')
    pair(CX, 9, eye)
    # straight beams shoot horizontally outward, past the scoop silhouette
    for ex in (CX - 9, CX + 9):
        out = 0 if ex < CX else CW - 1
        c.line(ex, ey, out, ey, 'R', thick=3)
        c.hline(min(ex, out), max(ex, out), ey - 1, 'r')  # bright core edge
    # sparks where each beam clears the dome
    for sx in (CX - SCOOP_RX - 2, CX + SCOOP_RX + 2):
        for dx, dy in ((0, -2), (0, 2), (-1, 0), (1, 0)):
            c.put(sx + dx, ey + dy, 'y')
    c.curve(CX, CY + 11, 8, 2, EYEBLK, up=False, thick=1)  # gritted mouth


@meme('nyan-cat', (255, 150, 205, 255), {
    'G': (175, 178, 185, 255), 'g': (120, 124, 132, 255), 'q': (255, 130, 170, 255),
    'r': (255, 60, 60, 255), 'o': (255, 150, 40, 255), 'y': (255, 225, 60, 255),
    'e': (70, 210, 90, 255), 'b': (70, 140, 255, 255), 'v': (150, 70, 220, 255)})
def face_nyan(c: Canvas) -> None:
    # Thick rainbow filling the lower scoop + a single-tone grey cat head with
    # a simple smiling face (no extra cheek colour — keeps it clean).
    rainbow = ['r', 'o', 'y', 'e', 'b', 'v']
    c.band(CY + 4, CY + SCOOP_RY - 1, rainbow, only=frozenset({SCOOP}))
    c.fill_ellipse(CX, CY - 6, 14, 11, 'G')         # cat head
    pair(CX, 9, lambda x: c.disc(x, CY - 9, 3, SCOOP))  # ears
    pair(CX, 6, lambda x: c.disc(x, CY - 7, 2, EYEBLK))  # eyes
    c.put(CX, CY - 4, EYEBLK)                            # nose
    c.curve(CX - 2, CY - 2, 2, 1, EYEBLK, up=True)       # smiling mouth
    c.curve(CX + 2, CY - 2, 2, 1, EYEBLK, up=True)


@meme('success-kid', (245, 205, 165, 255), {
    'H': (90, 64, 40, 255), 'm': (150, 90, 70, 255), 'n': (60, 40, 30, 255)},
    silhouette=success_fist)
def face_success(c: Canvas) -> None:
    # Determined baby face — the iconic clenched fist now rises ABOVE the
    # scoop (see success_fist silhouette).
    pair(CX, 7, lambda x: c.disc(x, CY - 3, 2, EYEBLK))    # focused eyes
    pair(CX, 7, lambda x: c.hline(x - 2, x + 1, CY - 7, 'H'))  # brows
    c.put(CX, CY + 1, 'm')                                 # nose
    c.curve(CX, CY + 6, 5, 1, 'm', up=False, thick=2)      # pressed determined mouth


@meme('party-parrot', (60, 200, 90, 255), {
    'k': (40, 38, 44, 255), 'O': (255, 170, 40, 255), 'o': (220, 110, 20, 255),
    'r': (255, 60, 70, 255), 'y': (255, 220, 60, 255), 'e': (70, 210, 90, 255),
    'b': (70, 140, 255, 255), 'P': (255, 90, 160, 255)})
def face_parrot(c: Canvas) -> None:
    # Front-facing parrot: rainbow crest, two round eyes, and a big central
    # hooked beak — the silhouette reads clearly as a parrot head.
    for col, dx in (('r', -8), ('o', -4), ('y', 0), ('e', 4), ('b', 8)):
        x = CX + dx
        c.triangle((x, CY - SCOOP_RY - 4), (x - 3, CY - SCOOP_RY + 3),
                   (x + 3, CY - SCOOP_RY + 3), col)

    def eye(ex: int) -> None:
        c.disc(ex, CY - 6, 4, WHITE)
        c.arc(ex, CY - 6, 4, 4, OUTLINE)
        c.disc(ex, CY - 6, 2, EYEBLK)
        c.put(ex - 1, CY - 7, GLOSS)
    pair(CX, 8, eye)
    # big upper beak (orange) hooking down in the centre
    c.fill_ellipse(CX, CY + 1, 8, 4, 'O')                     # cere / beak base
    c.triangle((CX - 7, CY + 2), (CX + 7, CY + 2), (CX, CY + 14), 'O')
    c.triangle((CX - 3, CY + 9), (CX + 3, CY + 9), (CX, CY + 15), 'o')  # hooked tip
    c.hline(CX - 6, CX + 6, CY + 4, 'k')                     # beak split (mouth)
    pair(CX, 3, lambda x: c.put(x, CY, 'k'))                 # nostrils


@meme('deal-with-it', (255, 248, 225, 255), {
    'D': (20, 20, 26, 255), 'm': (150, 90, 60, 255)})
def face_deal(c: Canvas) -> None:
    # Iconic 8-bit pixel sunglasses dropping in, with a smug smirk.
    c.rect(CX - 17, CY - 7, CX + 17, CY - 4, 'D')       # top bar
    pair(CX, 9, lambda x: c.rect(x - 6, CY - 6, x + 5, CY + 1, 'D'))  # lenses
    c.rect(CX - 2, CY - 5, CX + 2, CY - 3, 'D')         # bridge
    pair(CX, 9, lambda x: c.put(x - 4, CY - 5, GLOSS))  # glint
    # smug smirk (raised on one side)
    c.line(CX - 7, CY + 9, CX + 2, CY + 8, 'm', thick=2)
    c.line(CX + 2, CY + 8, CX + 9, CY + 5, 'm', thick=2)


# ============================================================================
# Generation + review tooling
# ============================================================================

def generate_meme(slug: str, out_dir: Path) -> None:
    # The canvas is already the native 64×64 grid — no crop/rescale, so the
    # pixel art stays perfectly 1:1 (write_pair upscales it ×8 for the master).
    m = MEMES[slug]
    write_pair(render_canvas_image(m), out_dir, slug)


def generate_all(out_dir: Path) -> None:
    for slug in MEMES:
        generate_meme(slug, out_dir)


def preview_ascii(slug: str) -> None:
    """Print the raw grid to the terminal so the silhouette can be eyeballed."""
    rows = build_rows(MEMES[slug])
    glyph = {TRANSPARENT: ' ', OUTLINE: '#', SCOOP: '.', GLOSS: '*', 'C': ':', 'c': ';'}
    print(f'=== {slug} ===')
    for row in rows:
        print(''.join(glyph.get(ch, ch) for ch in row))


def contact_sheet(out_path: Path, *, cell: int = 160, cols: int = 4) -> None:
    """Tile every meme master into one labelled review image."""
    slugs = list(MEMES)
    rows = (len(slugs) + cols - 1) // cols
    pad, label_h = 10, 16
    cw = cell + pad * 2
    chh = cell + pad * 2 + label_h
    sheet = Image.new('RGBA', (cw * cols, chh * rows), (245, 245, 248, 255))
    draw = ImageDraw.Draw(sheet)
    for i, slug in enumerate(slugs):
        r, col = divmod(i, cols)
        master = to_master(render_canvas_image(MEMES[slug])).resize(
            (cell, cell), Image.Resampling.NEAREST)
        ox, oy = col * cw + pad, r * chh + pad
        sheet.alpha_composite(master, (ox, oy))
        draw.text((ox, oy + cell + 2), slug, fill=(30, 30, 30, 255))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path)
    print(f'  wrote {out_path} ({sheet.width}×{sheet.height})')


def main() -> None:
    parser = argparse.ArgumentParser(description='Ice Cream Week NFT asset pipeline')
    sub = parser.add_subparsers(dest='cmd', required=True)

    gen_all = sub.add_parser('generate-all', help='Write all meme NFT pairs')
    gen_all.add_argument('--out', type=Path, required=True)

    gen_one = sub.add_parser('generate', help='Write one meme NFT pair')
    gen_one.add_argument('--slug', required=True, choices=sorted(MEMES))
    gen_one.add_argument('--out', type=Path, required=True)

    prev = sub.add_parser('preview', help='Print a meme grid as ASCII')
    prev.add_argument('--slug', required=True, choices=sorted(MEMES))

    sheet = sub.add_parser('contact-sheet', help='Tile all memes into one review PNG')
    sheet.add_argument('--out', type=Path, required=True)

    proc = sub.add_parser('process', help='Process an external source image')
    proc.add_argument('--src', type=Path, required=True)
    proc.add_argument('--slug', required=True)
    proc.add_argument('--out', type=Path, required=True)
    proc.add_argument('--bg', choices=['chroma', 'black', 'white'], default='chroma')

    args = parser.parse_args()
    if args.cmd == 'generate-all':
        generate_all(args.out)
    elif args.cmd == 'generate':
        generate_meme(args.slug, args.out)
    elif args.cmd == 'preview':
        preview_ascii(args.slug)
    elif args.cmd == 'contact-sheet':
        contact_sheet(args.out)
    elif args.cmd == 'process':
        process_source(args.src, args.out, args.slug, bg=args.bg)


if __name__ == '__main__':
    main()
