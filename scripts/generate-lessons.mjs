/**
 * Generates public/content/lessons/*.json from the course catalog at build/dev time.
 * Run: node scripts/generate-lessons.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "src/lib/courses/catalog.ts");
const outDir = path.join(root, "public/content/lessons");
const outDir2 = path.join(root, "content/lessons");
const richPath = path.join(__dirname, "rich-bodies.json");

const catalog = fs.readFileSync(catalogPath, "utf8");
const re = /L\("([^"]+)",\s*"([^"]+)",\s*(\d+),\s*"(\w+)",\s*"([^"]+)"/g;
const lessons = [];
let m;
while ((m = re.exec(catalog))) {
  lessons.push({ id: m[1], title: m[2], mins: Number(m[3]), kind: m[4], summary: m[5] });
}

const RICH_BODIES = fs.existsSync(richPath)
  ? JSON.parse(fs.readFileSync(richPath, "utf8"))
  : {};

const prefixMap = {
  wf: "web-foundations",
  js: "javascript-mastery",
  re: "react-essentials",
  ts: "typescript-for-developers",
  be: "backend-apis-node",
  git: "git-professional-workflow",
  py: "python-for-beginners",
  hc: "html-css-advanced",
  nx: "nextjs-fullstack",
  sql: "sql-databases",
  dsa: "data-structures-algorithms",
  cy: "cybersecurity-basics",
  rn: "mobile-react-native",
  dk: "devops-docker",
  ai: "ai-prompt-engineering",
};

const ytPath = path.join(root, "src/app/courses/[slug]/page.tsx");
const ytSrc = fs.existsSync(ytPath) ? fs.readFileSync(ytPath, "utf8") : "";
const yt = {};
for (const mm of ytSrc.matchAll(/"([^"]+)":\s*"([A-Za-z0-9_-]{6,})"/g)) {
  yt[mm[1]] = mm[2];
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(outDir2, { recursive: true });

for (const lesson of lessons) {
  const prefix = lesson.id.split("-")[0];
  const courseSlug = prefixMap[prefix] || "web-foundations";
  const body =
    RICH_BODIES[lesson.id] ||
    (`## ${lesson.title}\n\n${lesson.summary}\n\n### What to do\n` +
      (lesson.kind === "video"
        ? "1. Watch the video\n2. Try one example\n3. Mark complete when you can explain the idea\n"
        : lesson.kind === "interactive"
          ? "1. Open the Playground\n2. Build a minimal example\n3. Mark complete when it runs\n"
          : lesson.kind === "quiz"
            ? "Review prior modules, then submit the assessment (60%+ for certificate path).\n"
            : "Read carefully and write a one-sentence summary in your notes.\n"));

  const data = {
    id: lesson.id,
    courseSlug,
    title: lesson.title,
    kind: lesson.kind,
    durationMin: lesson.mins,
    goals: [
      `Understand: ${lesson.summary}`,
      `Complete a ${lesson.mins}-minute focused session`,
      "Mark complete when you can teach the idea",
    ],
    body,
    quiz: [
      {
        q: `What is the focus of “${lesson.title}”?`,
        choices: [lesson.summary, "Unrelated topic only", "Certificate payment only"],
        answer: 0,
      },
    ],
  };
  if (yt[lesson.id]) {
    data.youtubeId = yt[lesson.id];
    data.thumbnail = `https://i.ytimg.com/vi/${yt[lesson.id]}/hqdefault.jpg`;
  }
  const json = JSON.stringify(data, null, 2) + "\n";
  fs.writeFileSync(path.join(outDir, `${lesson.id}.json`), json);
  fs.writeFileSync(path.join(outDir2, `${lesson.id}.json`), json);
}

console.log(`Generated ${lessons.length} lessons (${Object.keys(RICH_BODIES).length} rich bodies)`);
