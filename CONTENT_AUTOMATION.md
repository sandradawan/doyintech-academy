# Daily content & video automation

## Goal
Every day, generate **one full lesson** (syllabus depth: teaching text, code, practice, quiz, video script + storyboard) and **publish it** to the academy repo so the site can serve it.

## What gets produced per day
- `content/lessons/{id}.json` — full lesson body (see `content/SCHEMA.md`)
- Updated `content/queue.json` — lesson moved from `pending` → `generated`
- Video **script + Grok video prompt** (render URL filled when you generate/host the clip)

True pixel video files are **not** invented by this pipeline alone. The automation writes production-ready **scripts and prompts**; you (or a later video job) render and set `video.url`.

## Run status locally
```bash
node scripts/content-status.mjs
```

## Publish a lesson file
```bash
node scripts/publish-lesson.mjs content/lessons/wf-1-2.json
```

## Daily Grok automation
A scheduled Grok task runs once per day (Africa/Lagos), picks the next pending lesson, writes JSON, updates the queue, and commits to `sandradawan/doyintech-academy`.

## Queue size
49 lessons total. At 1/day ≈ 7 weeks to fill the catalog. Raise `lessonsPerDay` only if quality stays high.

## App integration
Lesson pages should load `content/lessons/{id}.json` when present; fall back to catalog summary if missing.
