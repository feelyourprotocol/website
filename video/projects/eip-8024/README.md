# EIP-8024 — Stack opcodes short

First Feel Your Protocol short-form video. Overlay copy in `content.json`, timeline in `playbook.json`, voice in `narration.json`.

```bash
# from website/
npm run video:generate:preview -- eip-8024   # final *-final.mp4 (540×960, with voice)
npm run video:generate -- eip-8024           # final *-final.mp4 (1080×1920, with voice)
npm run video:record -- eip-8024 --preview --no-voice   # silent .webm only
npm run video:record -- eip-8024 --dry-run
```

Upload: `output/eip-8024-<timestamp>-final.mp4`  
Silent intermediate: `output/eip-8024-<timestamp>.webm` (no audio)
