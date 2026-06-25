#!/usr/bin/env python3
"""Process Ice Cream Week soulbound NFT assets.

Pipeline:
  1. Remove chroma-key (#FF00FF) or corner-connected black — never fuzzy-remove whites/grays
  2. Trim to opaque bounding box
  3. Nearest-neighbor downscale to fit inside 58×58
  4. Center on 64×64 transparent canvas
  5. Nearest-neighbor upscale to 512×512 master

Usage:
  python3 scripts/process-ice-cream-nft.py generate-pepe --out src/ice-cream/assets/nft
  python3 scripts/process-ice-cream-nft.py process --src raw.png --slug pepe --bg chroma --out ...
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image

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


# Hand-drawn Pepe ice cream — 32×46 px art, centered on 64×64 transparent canvas.
PALETTE: dict[str, tuple[int, int, int, int]] = {
    '.': (0, 0, 0, 0),
    'K': (0, 0, 0, 255),
    'G': (93, 174, 66, 255),
    'W': (255, 255, 255, 255),
    'E': (0, 0, 0, 255),
    'M': (168, 96, 48, 255),
    'C': (212, 156, 72, 255),
    'c': (140, 88, 40, 255),
}

PEPE_ROWS = [
    '................................',
    '................................',
    '................................',
    '................................',
    '..........KKKKKKKKKK............',
    '........KKGGGGGGGGGGKK..........',
    '.......KGGGGGGGGGGGGGGK.........',
    '......KGGGGGGGGGGGGGGGGK........',
    '.....KGGGGGGGGGGGGGGGGGGK.......',
    '....KGGGGGGGGGGGGGGGGGGGGK......',
    '...KGGGGGGGGGGGGGGGGGGGGGGK.....',
    '...KGGGGGGGGGGGGGGGGGGGGGGK.....',
    '...KGGGWWWW....WWWWGGGGGGK......',
    '...KGGWEEEE....EEEEWGGGGGK......',
    '...KGGWEEEE....EEEEWGGGGGK......',
    '...KGGGWWWW....WWWWGGGGGGK......',
    '...KGGGGGGGGGGGGGGGGGGGGGGK.....',
    '...KGGGGGGGGMMMMMMGGGGGGGGK.....',
    '...KGGGGGGGMMMMMMMGGGGGGGGK.....',
    '...KGGGGGGGGGGGGGGGGGGGGGGK.....',
    '....KGGGGGGGGGGGGGGGGGGGGK......',
    '.....KGGGGGGGGGGGGGGGGGGK.......',
    '......KKKKKKKKKKKKKKKKKK........',
    '...........KCCCCCCCCK...........',
    '..........KCCcCcCcCcCK..........',
    '.........KCCcCcCcCcCcCK.........',
    '........KCCcCcCcCcCcCcCK........',
    '.......KCCcCcCcCcCcCcCcCK.......',
    '......KCCcCcCcCcCcCcCcCcCK......',
    '.......KCCcCcCcCcCcCcCK.........',
    '........KCCcCcCcCcCcCK..........',
    '.........KCCCCCCCCCCCK..........',
    '..........KKKKKKKKKKKK..........',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
]


def art_to_image(rows: list[str], palette: dict[str, tuple[int, int, int, int]]) -> Image.Image:
    h = len(rows)
    w = len(rows[0])
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(rows):
        if len(row) != w:
            raise ValueError(f'row {y} width {len(row)} != {w}')
        for x, ch in enumerate(row):
            px[x, y] = palette[ch]
    return img


def generate_pepe(out_dir: Path) -> None:
    generate_art(PEPE_ROWS, PALETTE, 'pepe', out_dir)


DOOMER_PALETTE: dict[str, tuple[int, int, int, int]] = {
    '.': (0, 0, 0, 0),
    'K': (0, 0, 0, 255),
    'H': (26, 26, 26, 255),
    'g': (189, 189, 189, 255),
    'G': (150, 150, 150, 255),
    'E': (0, 0, 0, 255),
    'D': (90, 90, 90, 255),
    'M': (130, 110, 110, 255),
    'C': (212, 156, 72, 255),
    'c': (140, 88, 40, 255),
}

DOOMER_ROWS = [
    '................................',
    '................................',
    '................................',
    '................................',
    '..........HHHHHHHH..............',
    '.........HHHHHHHHHHHH...........',
    '........HHHHHHHHHHHHHH..........',
    '.......KHHHHHHHHHHHHHHK.........',
    '......KHHHHHHHHHHHHHHHHK........',
    '.....KggggggggggggggggggK.......',
    '.....KgggEE....EEggggggK........',
    '.....KgggED....DEggggggK........',
    '.....KgggggMMgggggggggK.........',
    '.....KggggggggggggggggK.........',
    '.....KggggggggggggggggK.........',
    '......KggggggggggggggK..........',
    '.......KKKKKKKKKKKKKKK..........',
    '...........KCCCCCCCCK...........',
    '..........KCCcCcCcCcCK..........',
    '.........KCCcCcCcCcCcCK.........',
    '........KCCcCcCcCcCcCcCK........',
    '.......KCCcCcCcCcCcCcCcCK.......',
    '......KCCcCcCcCcCcCcCcCcCK......',
    '.......KCCcCcCcCcCcCcCK.........',
    '........KCCcCcCcCcCcCK..........',
    '.........KCCCCCCCCCCCK..........',
    '..........KKKKKKKKKKKK..........',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
]


def generate_art(
    rows: list[str],
    palette: dict[str, tuple[int, int, int, int]],
    slug: str,
    out_dir: Path,
) -> None:
    art = art_to_image(rows, palette)
    write_pair(fit_native(art), out_dir, slug)


def generate_doomer(out_dir: Path) -> None:
    generate_art(DOOMER_ROWS, DOOMER_PALETTE, 'doomer', out_dir)


# Shared waffle cone rows (32 cols) — paste after scoop body closes with K outline.
CONE_ROWS: list[str] = [
    '...........KCCCCCCCCK...........',
    '..........KCCcCcCcCcCK..........',
    '.........KCCcCcCcCcCcCK.........',
    '........KCCcCcCcCcCcCcCK........',
    '.......KCCcCcCcCcCcCcCcCK.......',
    '......KCCcCcCcCcCcCcCcCcCK......',
    '.......KCCcCcCcCcCcCcCK.........',
    '........KCCcCcCcCcCcCK..........',
    '.........KCCCCCCCCCCCK..........',
    '..........KKKKKKKKKKKK..........',
]

PAD_ROWS = ['................................'] * 4
TAIL_ROWS = ['................................'] * 19


def compose_rows(head: list[str]) -> list[str]:
    return PAD_ROWS + head + CONE_ROWS + TAIL_ROWS


# --- This is Fine ---
THIS_IS_FINE_PALETTE: dict[str, tuple[int, int, int, int]] = {
    '.': (0, 0, 0, 0),
    'K': (0, 0, 0, 255),
    'H': (35, 35, 35, 255),
    'B': (160, 100, 50, 255),
    'b': (205, 140, 70, 255),
    'W': (255, 255, 255, 255),
    'E': (0, 0, 0, 255),
    'F': (255, 110, 0, 255),
    'f': (220, 60, 0, 255),
    'C': (212, 156, 72, 255),
    'c': (140, 88, 40, 255),
}

THIS_IS_FINE_HEAD = [
    '..........HHHHHH................',
    '.........HHHHHHHHH..............',
    '........KBBBBBBBBBBBK...........',
    '......KfBBWW....WWBBBfK.........',
    '......KfBWEE....EEBWBBfK........',
    '......KfBBBBBBBBBBBBBBfK........',
    '.......KBBBBBBBBBBBBBBK.........',
    '.......KBBBBBBBBBBBBBBK.........',
    '........KKKKKKKKKKKKKKK.........',
]

THIS_IS_FINE_ROWS = compose_rows(THIS_IS_FINE_HEAD)

# --- Doge ---
DOGE_PALETTE: dict[str, tuple[int, int, int, int]] = {
    '.': (0, 0, 0, 0),
    'K': (0, 0, 0, 255),
    'Y': (255, 220, 50, 255),
    'T': (232, 193, 112, 255),
    't': (190, 150, 80, 255),
    'W': (255, 255, 255, 255),
    'E': (0, 0, 0, 255),
    'N': (0, 0, 0, 255),
    'C': (212, 156, 72, 255),
    'c': (140, 88, 40, 255),
}

DOGE_HEAD = [
    '...........YYYYY................',
    '..........KKKKKKKKKK............',
    '........KKTTTTTTTTKK............',
    '.......KTTTTTTTTTTTTK...........',
    '......KTTTTTTTTTTTTTTK..........',
    '.....KTTWW....WWTTTTTTK.........',
    '.....KTTWEE....EETTTTTTK........',
    '.....KTTTNNNTTTTTTTTTTK.........',
    '.....KTTTTTTTTTTTTTTTTK.........',
    '.....KTTTTTTTTTTTTTTTTK.........',
    '......KTTTTTTTTTTTTTTK..........',
    '........KKKKKKKKKKKKKKK.........',
]

DOGE_ROWS = compose_rows(DOGE_HEAD)

# --- Neon Cypher Cat ---
NEON_CAT_PALETTE: dict[str, tuple[int, int, int, int]] = {
    '.': (0, 0, 0, 0),
    'K': (0, 0, 0, 255),
    'W': (245, 245, 245, 255),
    'w': (220, 220, 230, 255),
    'N': (0, 240, 255, 255),
    'P': (170, 0, 255, 255),
    'p': (255, 0, 180, 255),
    'E': (0, 0, 0, 255),
    'C': (212, 156, 72, 255),
    'c': (140, 88, 40, 255),
}

NEON_CAT_HEAD = [
    '..........KWW...WWK.............',
    '.........KWWWWWWWWWWK...........',
    '........KWWWWWWWWWWWWK..........',
    '.......KWWWWWWWWWWWWWWK.........',
    '......KppWWNN....NNWWppK........',
    '......KppWWNN....NNWWppK........',
    '......KpWWWEEEEEEWWWpK..........',
    '.......KWWWWWWWWWWWWWK..........',
    '.......KWWWWWWWWWWWWWK..........',
    '........KKKKKKKKKKKKKKK.........',
]

NEON_CAT_ROWS = compose_rows(NEON_CAT_HEAD)


def generate_this_is_fine(out_dir: Path) -> None:
    generate_art(THIS_IS_FINE_ROWS, THIS_IS_FINE_PALETTE, 'this-is-fine', out_dir)


def generate_doge(out_dir: Path) -> None:
    generate_art(DOGE_ROWS, DOGE_PALETTE, 'doge', out_dir)


def generate_neon_cypher_cat(out_dir: Path) -> None:
    generate_art(NEON_CAT_ROWS, NEON_CAT_PALETTE, 'neon-cypher-cat', out_dir)


def generate_all_hand_drawn(out_dir: Path) -> None:
    for fn in (
        generate_this_is_fine,
        generate_doge,
        generate_pepe,
        generate_neon_cypher_cat,
        generate_doomer,
    ):
        fn(out_dir)


def main() -> None:
    parser = argparse.ArgumentParser(description='Ice Cream Week NFT asset pipeline')
    sub = parser.add_subparsers(dest='cmd', required=True)

    gen_pepe = sub.add_parser('generate-pepe', help='Write hand-drawn Pepe native + master PNGs')
    gen_pepe.add_argument('--out', type=Path, required=True)

    gen_doomer = sub.add_parser('generate-doomer', help='Write hand-drawn Doomer native + master PNGs')
    gen_doomer.add_argument('--out', type=Path, required=True)

    gen_fine = sub.add_parser('generate-this-is-fine', help='Write hand-drawn This is Fine native + master PNGs')
    gen_fine.add_argument('--out', type=Path, required=True)

    gen_doge = sub.add_parser('generate-doge', help='Write hand-drawn Doge native + master PNGs')
    gen_doge.add_argument('--out', type=Path, required=True)

    gen_neon = sub.add_parser('generate-neon-cypher-cat', help='Write hand-drawn Neon Cat native + master PNGs')
    gen_neon.add_argument('--out', type=Path, required=True)

    gen_all = sub.add_parser('generate-all', help='Write all hand-drawn meme NFT pairs')
    gen_all.add_argument('--out', type=Path, required=True)

    proc = sub.add_parser('process', help='Process an external source image')
    proc.add_argument('--src', type=Path, required=True)
    proc.add_argument('--slug', required=True)
    proc.add_argument('--out', type=Path, required=True)
    proc.add_argument('--bg', choices=['chroma', 'black', 'white'], default='chroma')

    args = parser.parse_args()
    if args.cmd == 'generate-pepe':
        generate_pepe(args.out)
    elif args.cmd == 'generate-doomer':
        generate_doomer(args.out)
    elif args.cmd == 'generate-this-is-fine':
        generate_this_is_fine(args.out)
    elif args.cmd == 'generate-doge':
        generate_doge(args.out)
    elif args.cmd == 'generate-neon-cypher-cat':
        generate_neon_cypher_cat(args.out)
    elif args.cmd == 'generate-all':
        generate_all_hand_drawn(args.out)
    elif args.cmd == 'process':
        process_source(args.src, args.out, args.slug, bg=args.bg)


if __name__ == '__main__':
    main()
