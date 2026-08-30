#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const queuePath = path.join(root, "content/queue.json");
const lessonsDir = path.join(root, "content/lessons");

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const files = fs.existsSync(lessonsDir)
  ? fs.readdirSync(lessonsDir).filter((f) => f.endsWith(".json"))
  : [];

const pending = queue.pending?.length ?? 0;
const generated = queue.generated?.length ?? 0;
const next = queue.pending?.[0];

console.log("Doyintech Academy — content status");
console.log("=================================");
console.log(`Pending:   ${pending}`);
console.log(`Generated: ${generated}`);
console.log(`On disk:   ${files.length} lesson JSON files`);
if (next) {
  console.log("\nNext up:");
  console.log(`  #${next.order} [${next.courseSlug}] ${next.id}`);
  console.log(`  ${next.title} (${next.kind}, ${next.durationMin}m)`);
} else {
  console.log("\nQueue empty — all lessons generated.");
}
