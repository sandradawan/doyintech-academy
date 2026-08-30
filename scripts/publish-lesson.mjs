#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/publish-lesson.mjs <lesson.json>");
  process.exit(1);
}

const abs = path.resolve(file);
const lesson = JSON.parse(fs.readFileSync(abs, "utf8"));
const required = ["id", "courseSlug", "title", "kind", "bodyMd", "goals"];
for (const k of required) {
  if (lesson[k] == null || lesson[k] === "") {
    console.error(`Missing required field: ${k}`);
    process.exit(1);
  }
}

const destDir = path.join(root, "content/lessons");
fs.mkdirSync(destDir, { recursive: true });
const dest = path.join(destDir, `${lesson.id}.json`);
if (path.resolve(dest) !== abs) {
  fs.copyFileSync(abs, dest);
}

const queuePath = path.join(root, "content/queue.json");
const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const idx = queue.pending.findIndex((l) => l.id === lesson.id);
if (idx >= 0) {
  const [item] = queue.pending.splice(idx, 1);
  queue.generated.push({
    ...item,
    status: "published",
    publishedAt: new Date().toISOString(),
  });
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
}

console.log(`Published ${lesson.id} → ${dest}`);
console.log(`Queue remaining: ${queue.pending.length}`);
