# YouTube Shorts upload (local)

Upload a muxed `*-final.mp4` plus title-card thumbnail from `youtube.yml` to the
@FeelEthereum channel. **Laptop only** — the mp4 is gitignored, and YouTube
needs OAuth as the channel owner. Not GitHub Actions.

X posting stays human. This path is the Studio paste we already specified in
`youtube.yml`.

## One-time Google Cloud setup

Use the Google account that owns the **Feel Your Protocol** YouTube channel
(a Brand Account is fine — pick it in the consent screen).

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create or
   select a project (name it anything private, e.g. `fyp-youtube`).
2. **APIs & Services → Library** → enable **YouTube Data API v3**.
3. **APIs & Services → OAuth consent screen**
   - User type: **External**.
   - App name: `Feel Your Protocol` (or similar).
   - Add the channel’s Google account as a **test user** while the app is in
     Testing (only test users can sign in).
   - Scopes you will request at runtime: `youtube.upload` and `youtube`.
     You do not need to pre-configure them on the screen.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Desktop app** (not Web).
   - Name: `fyp-video-cli`.
5. Copy the client id and client secret into `video/.env` (never commit `.env`):

```
YOUTUBE_CLIENT_ID=….apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=…
```

Leave `YOUTUBE_REFRESH_TOKEN` empty until the next step.

## One-time machine auth

From `website/`:

```bash
npm run video:youtube:auth
```

A browser window opens. Sign in as the channel owner, choose the Feel Your
Protocol channel if asked, and allow access. The CLI writes
`YOUTUBE_REFRESH_TOKEN` to `video/.env` and does **not** print it.

If Google returns no refresh token: [revoke](https://myaccount.google.com/permissions)
the app and run auth again.

## Upload a Short

Default privacy is **unlisted** (safe for a first look). Round-trip close uses
`--privacy public` after merge, when the exploration URL in the description is live.

```bash
# See title, paths, playlist — no network
npm run video:youtube:upload -- eip-8038 --dry-run

# First real upload (unlisted)
npm run video:youtube:upload -- eip-8038

# After review, flip the same video to public (does not re-upload)
npm run video:youtube:upload -- eip-8038 --privacy public
```

Needs `video/projects/<id>/youtube.yml`, `output/*-final.mp4`, and
`output/*-final-thumb.jpg` (`npm run video:thumb -- <id>` if the JPEG is missing).

The `playlist:` title in yaml is the **fork** shelf. Upload and playlist-sync also
add a **topic** shelf (`Feel Your Protocol · Robustness`, `UX`, …) derived from
`video/src/explorationRegistry.ts` (same labels as the site topics). Either
playlist is created on the channel if it does not exist yet (public). Pass
`--skip-playlist` to upload without playlist membership.

Add already-published Shorts to those playlists (creates a missing playlist,
looks up missing `published.video_id` via channel search, writes `published:`
into yaml):

```bash
npm run video:youtube:playlist-sync
npm run video:youtube:playlist-sync -- eip-7708 eip-8037
```

On success the CLI prints `https://www.youtube.com/shorts/<id>` and writes a
`published:` block into `youtube.yml` so a second run is a no-op. `--force`
uploads a **new** video (avoid unless you mean to duplicate).

Quota: `videos.insert` costs 1,600 units; the default daily cap is 10,000
(~six uploads). Custom Shorts thumbnails may need a verified channel / YPP —
a thumbnail API failure still leaves the video up (warning on stderr).

## Agent rules

Same as ElevenLabs: never `Read` / `cat` `video/.env`, never print token values,
never pass them as CLI flags. Report only present / missing. Auth and first
client-id paste are **human** steps.

Round-trip: do not upload during the video phase. [round-trip-close](../.cursor/skills/round-trip-close/SKILL.md)
uploads after merge (YouTube GO, before the X kit).
