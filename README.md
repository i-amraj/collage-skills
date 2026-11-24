# Collage Skills — Vox-style paper-collage videos, free

Curated by **Raj** ([@i.raj1801](https://www.instagram.com/i.raj1801/) · [i-amraj](https://github.com/i-amraj)) — three open-source skills in one place, so you can make Vox-style paper-collage explainers without hunting them down. Free to use, free to share.

Give a skill a topic and it finds real archive photos, cuts them out and builds the video — black-and-white cutouts, red sticker borders, torn paper, stamps, old maps, stop-motion movement. No video model, no credits burned.

> **Demo:** watch `demo/` (5-second demo video — what this style makes). Full video on the skill coming on [@i.raj1801](https://www.instagram.com/i.raj1801/).

## The three skills

| Skill | What it does | Licence | Original author |
|---|---|---|---|
| `skills/collage` — **collage** | Vox-style paper-collage videos in Claude Code. Two looks: Engraving reel (vertical 9:16, voice-synced, ransom letters) and Vox-style film (16:9). | MIT | [Prakhar Mehta](https://github.com/prakhar2603/collage-skill) |
| `skills/papercut` — **papercut** | Full collage-documentary engine: rembg cutouts, halftone dots, scissor borders, Kokoro voice, paper SFX, HyperFrames animation. | MIT | [Bashar Mokdad](https://github.com/basharmokdad/papercut) |
| `skills/vox-explainer` — **vox-explainer** | 60–90 second collage explainers with a measured Vox design vocabulary and layout/motion references. | Apache-2.0 | [HeyGen](https://github.com/heygen-com/hyperframes-community-skills) |

Full credits in [`CREDITS.md`](CREDITS.md). Each skill keeps its own `LICENSE` file and its author's name — that is required by their licences, and it is the right thing to do. **My work here is the curation, this README, and the demo video.** I did not write these three skills and I do not claim I did.

## Install

You need Node 20+, ffmpeg and Google Chrome. (Papercut also needs Python 3.10+.)

```bash
# 1. Collage (Prakhar)
git clone https://github.com/prakhar2603/collage-skill ~/.claude/skills/collage
cd ~/.claude/skills/collage/tools && npm install

# 2. Papercut (Bashar)
git clone https://github.com/basharmokdad/papercut
cd papercut && ln -s "$(pwd)" ~/.claude/skills/papercut

# 3. Vox-explainer (HeyGen)
npx skills add heygen-com/hyperframes-community-skills --skill vox-explainer -a claude-code
```

Or copy the `skills/` folders from this repo into `~/.claude/skills/` — same files, same licences.

## Slash commands

```text
/collage Mumbai's dabbawalas
```

Claude reads the Wikipedia article, picks the facts, finds free photos, cuts the subjects out, builds the scenes and renders the video. Edit it afterwards on a timeline:

```bash
npx -y hyperframes@0.8.33 preview .
```

```text
Make a papercut video about the first computer bug.
```

```text
/vox-explainer — create a Vox-style history of <topic>
```

## Honest notes (read before you start)

- **The skills are free. Claude Code is not** — it needs a paid plan (Pro $20/mo is the cheapest). That is the one cost.
- **The cutout tool is macOS-only.** On Windows/Linux the skill falls back to a weaker cutout model — good on people, weak on objects (objects get framed as photos instead).
- **Maps have no country borders by default** — disputed regions can render wrongly. Check any map frame before you publish, especially for India.
- Photos come from Wikimedia Commons (public domain / CC BY / CC BY-SA) — every photo is credited automatically. Keep the credits in your video.
- One video takes about 15 minutes on a recent Mac.

## What I changed

- Collected the three skills in one repo with one README and one install list.
- Added the 5-second demo video in `demo/` (made by me, in my style).
- Nothing inside `skills/` was rewritten — only collected. Original authors, licences and links are intact.

## Licence

This repo's own content (README, demo video, curation) is free to share. Each skill inside `skills/` keeps its own licence — MIT for collage and papercut, Apache-2.0 for vox-explainer. See [`CREDITS.md`](CREDITS.md).
