# Bro & Bruh comics

Not served at runtime and not imported by the app. Playbook: [`.cursor/skills/bro-bruh-comic/SKILL.md`](../../.cursor/skills/bro-bruh-comic/SKILL.md).

```text
design/comics/eip-NNNN.png   # or .jpg — the strip
design/comics/eip-NNNN.yml   # metadata, same basename
```

Episode number lives in YAML (`episode:`), not the filename, so the pair sorts by EIP. Keep the YAML key set stable — see the existing files and the skill template (`tweet.body` is the paste-ready announcement). Scan every `eip-*.yml` before creating a new strip (consumed settings, bridges, easter eggs, vibe slugs, tweet shapes).
