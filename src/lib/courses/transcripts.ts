/**
 * Episode notes for each video lesson.
 * Perfect notes tally with the playing episode:
 * - voiceover lines (timed)
 * - learning objectives
 * - code shown in the video
 * - key takeaways (for quiz generation)
 */

export type TranscriptLine = {
  t?: string;
  text: string;
};

export type EpisodeCode = {
  title: string;
  lang: string;
  code: string;
};

export type LessonTranscript = {
  lessonId: string;
  title: string;
  youtubeId?: string;
  focus: string;
  objectives: string[];
  lines: TranscriptLine[];
  code?: EpisodeCode[];
  takeaways: string[];
  fullText: string;
};

function build(
  lessonId: string,
  title: string,
  youtubeId: string,
  focus: string,
  objectives: string[],
  lines: TranscriptLine[],
  takeaways: string[],
  code?: EpisodeCode[],
): LessonTranscript {
  return {
    lessonId,
    title,
    youtubeId,
    focus,
    objectives,
    lines,
    code,
    takeaways,
    fullText: [...lines.map((l) => l.text), ...takeaways].join(" "),
  };
}

export const LESSON_TRANSCRIPTS: Record<string, LessonTranscript> = {
  "wf-1-1": build(
    "wf-1-1",
    "Day 1 — HTML Basics",
    "CTiMiM99wSE",
    "What HTML is, and the minimum skeleton of every page.",
    [
      "Explain what HTML is for (structure and meaning)",
      "Write a valid HTML5 document skeleton",
      "Know the roles of head vs body",
    ],
    [
      { t: "0:00", text: "Welcome to Day 1 of Introduction to Web Development with DoyinTech." },
      { t: "0:12", text: "Today we focus on HTML basics — HTML is the language that describes the structure and meaning of a web page." },
      { t: "0:28", text: "Every HTML document starts with a doctype declaration. Write <!DOCTYPE html> so the browser knows this is modern HTML." },
      { t: "0:45", text: "Next comes the html root element. Inside it you have two main sections: head and body." },
      { t: "1:00", text: "The head holds metadata — the page title, character set, and links to stylesheets. Users mainly see the body." },
      { t: "1:18", text: "Always set the character encoding with meta charset UTF-8 so text and symbols display correctly." },
      { t: "1:32", text: "The title element appears on the browser tab. Choose a clear title that describes the page." },
      { t: "1:48", text: "Inside the body you place headings, paragraphs, images, and links — the content people read." },
      { t: "2:00", text: "Remember: HTML is about structure and meaning, not colors or layout. That is the job of CSS later." },
    ],
    [
      "HTML describes structure and meaning — not styling.",
      "Start every page with <!DOCTYPE html>.",
      "Root element is <html>; inside it: <head> and <body>.",
      "Head = metadata; body = visible content.",
      "Always include charset UTF-8 and a clear <title>.",
    ],
    [
      {
        title: "Minimum HTML page",
        lang: "html",
        code: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>My first page</title>\n  </head>\n  <body>\n    <h1>Hello, web</h1>\n    <p>This is the body — what visitors read.</p>\n  </body>\n</html>`,
      },
    ],
  ),

  "wf-1-2": build(
    "wf-1-2",
    "Day 2 — Page Structure",
    "u7QxB-woWX0",
    "Semantic landmarks: header, nav, main, footer.",
    [
      "Structure a page with semantic regions",
      "Choose main over a random div for primary content",
      "Explain why semantics help accessibility and SEO",
    ],
    [
      { t: "0:00", text: "Day 2 — Page structure. We organize the body so the page is clear for users and search engines." },
      { t: "0:15", text: "Use semantic landmarks: header for the top area, nav for menus, main for the primary content, and footer for the bottom." },
      { t: "0:35", text: "Semantic tags help accessibility tools and improve SEO because the browser understands each region." },
      { t: "0:50", text: "Avoid a soup of only div tags when a meaningful element exists. Prefer main over a random div for the core article." },
      { t: "1:05", text: "A typical page flow is: header with logo and nav, then main with sections, then footer with links and copyright." },
      { t: "1:20", text: "Keep one main landmark per page. Nested sections can group related blocks inside main." },
    ],
    [
      "Use header, nav, main, and footer as landmarks.",
      "One <main> per page for primary content.",
      "Semantics help screen readers and SEO.",
      "Prefer meaningful tags over anonymous divs when possible.",
    ],
    [
      {
        title: "Semantic page outline",
        lang: "html",
        code: `<body>\n  <header>\n    <p>DoyinTech Academy</p>\n    <nav>\n      <a href="/">Home</a>\n      <a href="/courses">Courses</a>\n    </nav>\n  </header>\n  <main>\n    <h1>Introduction to Web Development</h1>\n    <section>\n      <h2>What you will learn</h2>\n      <p>HTML structure, step by step.</p>\n    </section>\n  </main>\n  <footer>\n    <p>© DoyinTech</p>\n  </footer>\n</body>`,
      },
    ],
  ),

  "wf-1-3": build(
    "wf-1-3",
    "Day 3 — Headings & Paragraphs",
    "uJ7dUicwQOU",
    "Readable text: one h1, logical heading order, short paragraphs.",
    [
      "Use a single h1 for the main topic",
      "Keep heading levels in order (do not skip for style)",
      "Write scannable paragraphs for mobile readers",
    ],
    [
      { t: "0:00", text: "Day 3 — Headings and paragraphs. These are the building blocks of readable text on the web." },
      { t: "0:12", text: "Heading levels run from h1 to h6. Use one h1 for the main topic of the page." },
      { t: "0:28", text: "Do not skip levels just for size — for example do not jump from h1 straight to h4. Use CSS if you only need visual size." },
      { t: "0:45", text: "Paragraphs use the p tag. Separate ideas into short paragraphs so mobile readers can scan easily." },
      { t: "1:00", text: "Strong and em emphasize meaning: strong for importance, em for stress in a sentence." },
      { t: "1:15", text: "Good heading order creates an outline of the page — that outline is what screen readers and search engines rely on." },
    ],
    [
      "One h1 for the page topic.",
      "Do not skip heading levels only to change size — use CSS.",
      "Short paragraphs scan better on phones.",
      "strong = importance; em = spoken stress.",
      "Headings form the outline of the page.",
    ],
    [
      {
        title: "Headings and paragraphs",
        lang: "html",
        code: `<main>\n  <h1>HTML text basics</h1>\n  <p>Start with one clear main heading.</p>\n  <h2>Paragraphs</h2>\n  <p>Keep paragraphs short so readers can scan on mobile.</p>\n  <p>Use <strong>strong</strong> for importance and <em>em</em> for stress.</p>\n</main>`,
      },
    ],
  ),

  "wf-2-1": build(
    "wf-2-1",
    "Day 4 — Links & Images",
    "Um0cfZB9Lmc",
    "Connect pages with anchors; show media with accessible images.",
    [
      "Create links with the anchor tag and href",
      "Write descriptive link text (not click here)",
      "Add images with meaningful alt text",
    ],
    [
      { t: "0:00", text: "Day 4 — Links and images. This is how pages connect and how media appears." },
      { t: "0:12", text: "The anchor tag a creates a hyperlink. The href attribute holds the destination URL." },
      { t: "0:28", text: "Use descriptive link text. Avoid vague labels like click here — say what the user will open." },
      { t: "0:42", text: "Images use the img tag. Always provide alt text that describes the image for accessibility and when the image fails to load." },
      { t: "0:58", text: "Set width and height when you know them to reduce layout shift while the image loads." },
      { t: "1:10", text: "Prefer meaningful alt text. Decorative images can use an empty alt attribute so screen readers skip them." },
    ],
    [
      "Links use <a href=\"...\"> with clear link text.",
      "Never rely on click here as the only label.",
      "Images need descriptive alt text.",
      "Empty alt is for decorative images only.",
      "Width/height help avoid layout jump while loading.",
    ],
    [
      {
        title: "Links and images",
        lang: "html",
        code: `<p>\n  <a href="/courses/web-foundations">Open Introduction to Web Development</a>\n</p>\n<img\n  src="/images/html-basics.png"\n  alt="Diagram of an HTML document with head and body"\n  width="640"\n  height="360"\n/>`,
      },
    ],
  ),

  "wf-2-2": build(
    "wf-2-2",
    "Day 5 — Lists",
    "V2YAF2DrFyY",
    "Group related items with ul, ol, and li.",
    [
      "Choose ul when order does not matter",
      "Choose ol when sequence matters",
      "Nest lists carefully and keep them shallow",
    ],
    [
      { t: "0:00", text: "Day 5 — Lists. Lists help you group related items in a structured way." },
      { t: "0:12", text: "Unordered lists use ul with li children — great for menus and bullet points where order does not matter." },
      { t: "0:28", text: "Ordered lists use ol when sequence matters — steps in a recipe or ranked results." },
      { t: "0:42", text: "Each list item is an li. Do not put random block content as a direct child of ul without wrapping in li." },
      { t: "0:55", text: "You can nest lists for sub-steps. Keep nesting shallow so the page stays easy to scan." },
      { t: "1:05", text: "Together with headings, paragraphs, links, and images, lists complete the core HTML toolkit for content pages." },
    ],
    [
      "ul = unordered (bullets); ol = ordered (steps/rank).",
      "Every item goes in an li.",
      "Keep nested lists shallow for readability.",
      "Lists + headings + links + images = core content HTML.",
    ],
    [
      {
        title: "Unordered and ordered lists",
        lang: "html",
        code: `<h2>What you need</h2>\n<ul>\n  <li>A code editor</li>\n  <li>A modern browser</li>\n  <li>Curiosity</li>\n</ul>\n<h2>Build order</h2>\n<ol>\n  <li>Write the HTML skeleton</li>\n  <li>Add structure with landmarks</li>\n  <li>Add text, links, images, and lists</li>\n</ol>`,
      },
    ],
  ),
};

export function getTranscript(lessonId: string): LessonTranscript | null {
  return LESSON_TRANSCRIPTS[lessonId] ?? null;
}

export function transcriptAsCaptionText(lessonId: string): string {
  const t = getTranscript(lessonId);
  if (!t) return "";
  return t.lines.map((l) => (l.t ? `[${l.t}] ${l.text}` : l.text)).join("\n\n");
}

export function parseTimestampToSeconds(t?: string): number {
  if (!t) return 0;
  const parts = t.trim().split(":").map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
}
