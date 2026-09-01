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

const catalog = fs.readFileSync(catalogPath, "utf8");
const re = /L\("([^"]+)",\s*"([^"]+)",\s*(\d+),\s*"(\w+)",\s*"([^"]+)"/g;
const lessons = [];
let m;
while ((m = re.exec(catalog))) {
  lessons.push({ id: m[1], title: m[2], mins: Number(m[3]), kind: m[4], summary: m[5] });
}

const RICH_BODIES = {
  "wf-1-1": `## How the web works\n\nEvery page you open is a conversation between a **client** (browser) and a **server**.\n\n1. You type a URL or click a link.\n2. DNS finds the server address.\n3. The browser requests a resource (HTML).\n4. The server responds with HTML, CSS, and JS.\n5. The browser paints the page.\n\n### The three core languages\n| Layer | Job |\n|-------|-----|\n| **HTML** | Structure and meaning |\n| **CSS** | Look and layout |\n| **JavaScript** | Behavior and interaction |\n\n### Try this\nOpen any site → right-click → **Inspect**. Find the Network tab and reload.\n\n### Checkpoint\nExplain client vs server in one sentence.`,
  "wf-1-2": `## Your first HTML page\n\nHTML describes **structure**, not decoration.\n\n\`\`\`html\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>Hello Doyintech</title>\n  </head>\n  <body>\n    <h1>Welcome</h1>\n    <p>This is a paragraph with a <a href=\"https://example.com\">link</a>.</p>\n  </body>\n</html>\n\`\`\`\n\n### Practice\nRebuild this page in the playground and change the heading.`,
  "js-1-1": `## JavaScript in the browser\n\n\`\`\`js\nconst course = \"JavaScript Mastery\";\nconsole.log(\`Learning \${course}\`);\nconst scores = [72, 88, 95];\nconst average = scores.reduce((a, b) => a + b, 0) / scores.length;\nconsole.log(\"Average\", average.toFixed(1));\n\`\`\`\n\n### Practice\nOpen DevTools → Console and compute an average of three numbers.`,
  "js-1-2": `## Variables, types, and operators\n\n\`\`\`js\nconst name = \"Ada\";\nlet attempts = 3;\nconst passed = attempts > 0;\nconsole.log(typeof name, typeof attempts, typeof passed);\n\`\`\`\n\nPrefer const. Use let only when the value must change.`,
  "py-1-1": `## Why Python\n\n\`\`\`python\ndef welcome(name: str) -> str:\n    return f\"Welcome to Doyintech, {name}!\"\n\nprint(welcome(\"learner\"))\nprint([n * n for n in range(1, 6)])\n\`\`\`\n\nRun this in the dashboard Playground (Python).`,
  "py-1-2": `## Variables and types\n\n\`\`\`python\ntitle = \"Python for Beginners\"\nlessons = 12\nprogress = 0.25\nprint(type(title), type(lessons))\nprint(f\"{int(progress * 100)}% complete\")\n\`\`\`\n\nUse snake_case for names.`,
};

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

console.log(`Generated ${lessons.length} lessons`);
