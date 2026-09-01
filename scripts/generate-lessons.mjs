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
  "wf-1-1": `## How the web works\n\nEvery page is a conversation between a **client** (browser) and a **server**.\n\n1. You type a URL or click a link.\n2. DNS finds the server address.\n3. The browser requests HTML.\n4. The server responds with HTML, CSS, and JS.\n5. The browser paints the page.\n\n| Layer | Job |\n|-------|-----|\n| **HTML** | Structure and meaning |\n| **CSS** | Look and layout |\n| **JavaScript** | Behavior |\n\n### Try this\nInspect any site → **Network** tab → reload → find the first document request.\n\n### Checkpoint\nExplain client vs server in one sentence.`,
  "wf-1-2": `## Your first HTML page\n\nHTML describes **structure**, not decoration.\n\n\`\`\`html\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>Hello Doyintech</title>\n  </head>\n  <body>\n    <h1>Welcome</h1>\n    <p>A paragraph with a <a href=\"https://example.com\">link</a>.</p>\n    <img src=\"https://placehold.co/320x180\" alt=\"Placeholder\" />\n  </body>\n</html>\n\`\`\`\n\n- One \`<h1>\` per page\n- Images need meaningful \`alt\`\n- Always set \`lang\` on \`<html>\`\n\n### Practice\nRebuild this in the Playground and change the heading.`,
  "wf-1-3": `## Inspect and understand\n\nDevTools lets you **read the live DOM** the browser built from your HTML.\n\n### Steps\n1. Right-click → **Inspect**\n2. **Elements** tab — hover nodes and watch the page highlight\n3. **Console** — type \`document.title\`\n4. **Network** — reload and see requests\n\n### Try this\nChange a heading text in Elements and watch the page update (temporary — refresh restores it).\n\n### Checkpoint\nWhat is the difference between the HTML file and the live DOM?`,
  "wf-2-1": `## Semantic HTML\n\nUse tags that describe **meaning**, not only looks.\n\n\`\`\`html\n<header>\n  <nav aria-label=\"Main\">...</nav>\n</header>\n<main>\n  <article>\n    <h1>Lesson title</h1>\n    <section>...</section>\n  </article>\n</main>\n<footer>...</footer>\n\`\`\`\n\n| Prefer | Avoid for structure |\n|--------|---------------------|\n| \`header\`, \`main\`, \`nav\`, \`section\`, \`article\` | Nested \`div\` soup with no meaning |\n\n### Why it matters\nScreen readers, SEO, and maintainability all improve with semantics.\n\n### Practice\nRewrite a div-only page using semantic tags.`,
  "wf-2-2": `## Forms that collect data\n\nEvery control needs a **label**. Validation starts in HTML.\n\n\`\`\`html\n<form>\n  <label for=\"email\">Email</label>\n  <input id=\"email\" name=\"email\" type=\"email\" required />\n  <label for=\"level\">Level</label>\n  <select id=\"level\" name=\"level\">\n    <option>Beginner</option>\n    <option>Intermediate</option>\n  </select>\n  <button type=\"submit\">Join waitlist</button>\n</form>\n\`\`\`\n\n### Rules\n- \`for\` on label matches \`id\` on input\n- Use the right \`type\` (\`email\`, \`password\`, \`number\`)\n- \`required\` and \`minlength\` help before JS runs\n\n### Practice\nBuild a signup form with email + password and required fields.`,
  "wf-3-1": `## CSS cascade and selectors\n\nCSS decides the winner with **specificity** and source order.\n\n\`\`\`css\np { color: #334155; }\n.card p { color: #0f172a; }\n#hero { color: #020617; }\nbutton.primary { font-weight: 600; }\n\`\`\`\n\n### Cascade tips\n1. Prefer classes over IDs for styling\n2. Avoid \`!important\` except rare overrides\n3. Keep selectors short and readable\n\n### Practice\nStyle a card title stronger than body text without using an id.`,
  "wf-3-2": `## Box model and spacing\n\nEvery element is a box: **content → padding → border → margin**.\n\n\`\`\`css\n.card {\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 24rem;\n  padding: 1rem 1.25rem;\n  border: 1px solid #e2e8f0;\n  margin-block: 1rem;\n}\n\`\`\`\n\n### Remember\n- \`box-sizing: border-box\` makes width include padding/border\n- Margin collapses vertically between siblings\n- Use gap in flex/grid instead of random margins when possible\n\n### Practice\nBuild a card with equal padding and a 1px border that stays inside its width.`,
  "wf-3-3": `## Flexbox layout lab\n\nFlex arranges items in a row or column.\n\n\`\`\`css\n.nav {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n.row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.card { flex: 1 1 12rem; }\n\`\`\`\n\n### Build\n1. A top nav: logo left, links right\n2. A row of three equal cards that wrap on small screens\n\n### Checkpoint\nWhen would you choose \`justify-content\` vs \`gap\`?`,
  "wf-4-1": `## Responsive design\n\n**Mobile-first**: base styles for small screens, then enhance.\n\n\`\`\`css\n.hero { font-size: 1.5rem; padding: 1rem; }\n\n@media (min-width: 768px) {\n  .hero { font-size: 2.25rem; padding: 2rem; }\n}\n\`\`\`\n\n### Techniques\n- Fluid widths (\`%\`, \`max-width\`, \`clamp()\`)\n- Flexible grids / flex wrap\n- Touch-friendly tap targets (≥ 44px)\n\n### Practice\nMake a two-column layout stack to one column under 640px.`,
  "wf-4-2": `## Ship a landing page\n\nAssemble what you learned into one page.\n\n### Structure\n1. **Header** + nav\n2. **Hero** with headline + CTA button\n3. **Features** (3 cards, flex or grid)\n4. **Footer** with links\n\n### Quality bar\n- Semantic landmarks\n- Readable contrast\n- Works at 320px width\n\n### Practice\nBuild it in the Playground and share a screenshot with a mentor or friend.`,
  "wf-4-3": `## Web foundations quiz\n\nThis assessment checks HTML structure, CSS layout, and responsive thinking.\n\n### Before you start\n- Review semantic tags and the box model\n- Know flex basics and mobile-first media queries\n\n### Scoring\n**60% or higher** unlocks the certificate path for this course. You can retry if needed.`,
  "js-1-1": `## JavaScript in the browser\n\nJS runs in the browser console and in \`<script>\` tags.\n\n\`\`\`js\nconst course = \"JavaScript Mastery\";\nconsole.log(\`Learning \${course}\`);\nconst scores = [72, 88, 95];\nconst average = scores.reduce((a, b) => a + b, 0) / scores.length;\nconsole.log(\"Average\", average.toFixed(1));\n\`\`\`\n\n### Practice\nIn the console, compute the average of three numbers.`,
  "js-1-2": `## Variables and types\n\n\`\`\`js\nconst name = \"Ada\";\nlet attempts = 3;\nconst passed = attempts > 0;\nconsole.log(typeof name, typeof attempts, typeof passed);\n\`\`\`\n\n- Prefer **\`const\`**; use \`let\` only when reassigning\n- Prefer \`===\` over \`==\`\n\n### Practice\nWrite a check: if score ≥ 60 log \`\"pass\"\`, else \`\"retry\"\`.`,
  "js-1-3": `## Functions practice\n\n\`\`\`js\nfunction grade(score) {\n  if (score >= 60) return \"pass\";\n  return \"retry\";\n}\nconst double = (n) => n * 2;\nconsole.log(grade(72), double(21));\n\`\`\`\n\n### Practice\nWrite \`fullName(first, last)\` that returns a single string.`,
  "js-2-1": `## Arrays and objects\n\n\`\`\`js\nconst lessons = [\"HTML\", \"CSS\", \"JS\"];\nconst upper = lessons.map((l) => l.toUpperCase());\nconst student = { name: \"Ada\", score: 88 };\nconsole.log(student.name, upper);\n\`\`\`\n\n### Practice\nFrom an array of scores, keep only values ≥ 60, then compute the average.`,
  "js-2-2": `## Conditionals and loops\n\n\`\`\`js\nconst scores = [40, 70, 90];\nfor (const s of scores) {\n  console.log(s, s >= 60 ? \"pass\" : \"retry\");\n}\n\`\`\`\n\n### Practice\nCount how many scores pass (≥ 60) without using \`filter\`.`,
  "js-3-1": `## Promises and async/await\n\n\`\`\`js\nasync function loadTitle(url) {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(\"Request failed\");\n  const data = await res.json();\n  return data.title;\n}\n\`\`\`\n\n### Practice\nExplain what happens while the browser waits on \`fetch\`.`,
  "js-3-2": `## DOM events lab\n\n\`\`\`js\nconst btn = document.querySelector(\"#save\");\nbtn?.addEventListener(\"click\", () => {\n  console.log(\"Saved at\", new Date().toLocaleTimeString());\n});\n\`\`\`\n\n### Practice\nShow an input's length live on every \`input\` event.`,
  "js-3-3": `## JavaScript mastery quiz\n\nCovers values, functions, arrays/objects, control flow, and async basics.\n\nReview modules 1–3. **60%+** unlocks the certificate path.`,
  "py-1-1": `## Python full course overview\n\n\`\`\`python\ndef welcome(name: str) -> str:\n    return f\"Welcome to Doyintech, {name}!\"\n\nprint(welcome(\"learner\"))\nprint([n * n for n in range(1, 6)])\n\`\`\`\n\nRun in the dashboard **Playground** (Python).`,
  "py-1-2": `## Variables and types\n\n\`\`\`python\ntitle = \"Python for Beginners\"\nlessons = 12\nprogress = 0.25\nprint(type(title), type(lessons))\nprint(f\"{int(progress * 100)}% complete\")\n\`\`\`\n\nUse \`snake_case\` for names.`,
  "py-1-3": `## Functions lab\n\n\`\`\`python\ndef grade(score: int) -> str:\n    return \"pass\" if score >= 60 else \"retry\"\n\nprint(grade(72))\n\`\`\`\n\n### Practice\nWrite \`full_name(first, last)\` and call it.`,
  "py-2-1": `## Lists and loops\n\n\`\`\`python\nscores = [40, 70, 90]\npassed = [s for s in scores if s >= 60]\nfor s in scores:\n    print(s, \"pass\" if s >= 60 else \"retry\")\nprint(\"passed\", passed)\n\`\`\`\n\n### Practice\nBuild a list of squares for numbers 1–10.`,
  "py-2-2": `## Dicts and conditionals\n\n\`\`\`python\nstudent = {\"name\": \"Ada\", \"score\": 88}\nlevel = \"certified_path\" if student[\"score\"] >= 60 else \"review\"\nprint(student.get(\"name\"), level)\n\`\`\`\n\n### Practice\nStore three course titles with hours; print titles with hours ≥ 5.`,
  "py-3-1": `## Working with files\n\n\`\`\`python\nwith open(\"notes.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"Day 1: variables\\n\")\nwith open(\"notes.txt\", encoding=\"utf-8\") as f:\n    print(f.read())\n\`\`\`\n\nAlways use a \`with\` block so files close cleanly.`,
  "py-3-2": `## Mini CLI tool\n\n\`\`\`python\nimport sys\n\ndef report(name: str, score: int) -> str:\n    status = \"pass\" if score >= 60 else \"retry\"\n    return f\"{name}: {score} ({status})\"\n\nargs = sys.argv[1:]\nif len(args) >= 2:\n    print(report(args[0], int(args[1])))\nelse:\n    print(report(\"learner\", 70))\n\`\`\`\n\n### Practice\nAccept multiple scores and print the average.`,
  "py-3-3": `## Python quiz\n\nCovers types, functions, lists/dicts, loops, and simple files.\n\nReview modules 1–3. **60%+** unlocks the certificate path.`,
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
