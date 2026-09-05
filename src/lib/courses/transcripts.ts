/**
 * Voice-style transcripts (live caption style) for DoyinTech playlist lessons.
 * Final quizzes are derived from these notes.
 */

export type TranscriptLine = {
  t?: string;
  text: string;
};

export type LessonTranscript = {
  lessonId: string;
  title: string;
  youtubeId?: string;
  lines: TranscriptLine[];
  fullText: string;
};

const T = (lessonId: string, title: string, youtubeId: string, lines: TranscriptLine[]): LessonTranscript => ({
  lessonId,
  title,
  youtubeId,
  lines,
  fullText: lines.map((l) => l.text).join(" "),
});

export const LESSON_TRANSCRIPTS: Record<string, LessonTranscript> = {
  "wf-1-1": T("wf-1-1", "Day 1 — HTML Basics", "CTiMiM99wSE", [
    { t: "0:00", text: "Welcome to Day 1 of Introduction to Web Development with DoyinTech." },
    { t: "0:12", text: "Today we focus on HTML basics — HTML is the language that describes the structure and meaning of a web page." },
    { t: "0:28", text: "Every HTML document starts with a doctype declaration. Write <!DOCTYPE html> so the browser knows this is modern HTML." },
    { t: "0:45", text: "Next comes the html root element. Inside it you have two main sections: head and body." },
    { t: "1:00", text: "The head holds metadata — the page title, character set, and links to stylesheets. Users mainly see the body." },
    { t: "1:18", text: "Always set the character encoding with <meta charset=\"UTF-8\"> so text and symbols display correctly." },
    { t: "1:32", text: "The title element appears on the browser tab. Choose a clear title that describes the page." },
    { t: "1:48", text: "Inside the body you place headings, paragraphs, images, and links — the content people read." },
    { t: "2:00", text: "Remember: HTML is about structure and meaning, not colors or layout. That is the job of CSS later." },
  ]),
  "wf-1-2": T("wf-1-2", "Day 2 — Page Structure", "u7QxB-woWX0", [
    { t: "0:00", text: "Day 2 — Page structure. We organize the body so the page is clear for users and search engines." },
    { t: "0:15", text: "Use semantic landmarks: header for the top area, nav for menus, main for the primary content, and footer for the bottom." },
    { t: "0:35", text: "Semantic tags help accessibility tools and improve SEO because the browser understands each region." },
    { t: "0:50", text: "Avoid a soup of only div tags when a meaningful element exists. Prefer main over a random div for the core article." },
    { t: "1:05", text: "A typical page flow is: header with logo and nav, then main with sections, then footer with links and copyright." },
    { t: "1:20", text: "Keep one main landmark per page. Nested sections can group related blocks inside main." },
  ]),
  "wf-1-3": T("wf-1-3", "Day 3 — Headings & Paragraphs", "uJ7dUicwQOU", [
    { t: "0:00", text: "Day 3 — Headings and paragraphs. These are the building blocks of readable text on the web." },
    { t: "0:12", text: "Heading levels run from h1 to h6. Use one h1 for the main topic of the page." },
    { t: "0:28", text: "Do not skip levels just for size — for example do not jump from h1 straight to h4. Use CSS if you only need visual size." },
    { t: "0:45", text: "Paragraphs use the p tag. Separate ideas into short paragraphs so mobile readers can scan easily." },
    { t: "1:00", text: "Strong and em emphasize meaning: strong for importance, em for stress in a sentence." },
    { t: "1:15", text: "Good heading order creates an outline of the page — that outline is what screen readers and search engines rely on." },
  ]),
  "wf-2-1": T("wf-2-1", "Day 4 — Links & Images", "Um0cfZB9Lmc", [
    { t: "0:00", text: "Day 4 — Links and images. This is how pages connect and how media appears." },
    { t: "0:12", text: "The anchor tag a creates a hyperlink. The href attribute holds the destination URL." },
    { t: "0:28", text: "Use descriptive link text. Avoid vague labels like click here — say what the user will open." },
    { t: "0:42", text: "Images use the img tag. Always provide alt text that describes the image for accessibility and when the image fails to load." },
    { t: "0:58", text: "Set width and height when you know them to reduce layout shift while the image loads." },
    { t: "1:10", text: "Prefer meaningful alt text. Decorative images can use an empty alt attribute so screen readers skip them." },
  ]),
  "wf-2-2": T("wf-2-2", "Day 5 — Lists", "V2YAF2DrFyY", [
    { t: "0:00", text: "Day 5 — Lists. Lists help you group related items in a structured way." },
    { t: "0:12", text: "Unordered lists use ul with li children — great for menus and bullet points where order does not matter." },
    { t: "0:28", text: "Ordered lists use ol when sequence matters — steps in a recipe or ranked results." },
    { t: "0:42", text: "Each list item is an li. Do not put random block content as a direct child of ul without wrapping in li." },
    { t: "0:55", text: "You can nest lists for sub-steps. Keep nesting shallow so the page stays easy to scan." },
    { t: "1:05", text: "Together with headings, paragraphs, links, and images, lists complete the core HTML toolkit for content pages." },
  ]),
};

export function getTranscript(lessonId: string): LessonTranscript | null {
  return LESSON_TRANSCRIPTS[lessonId] ?? null;
}

export function transcriptAsCaptionText(lessonId: string): string {
  const t = getTranscript(lessonId);
  if (!t) return "";
  return t.lines.map((l) => (l.t ? `[${l.t}] ${l.text}` : l.text)).join("\n\n");
}
