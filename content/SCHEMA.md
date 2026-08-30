# Lesson content schema

Each published lesson is a JSON file: `content/lessons/{lessonId}.json`

See CONTENT_AUTOMATION.md for the daily pipeline.

Required fields: id, courseSlug, title, kind, durationMin, goals, bodyMd.
Optional: codeBlocks, practice, quiz, video (script, storyboard, grokVideoPrompt, url, status).

Video status: script_ready | rendered | skipped.
