import type { QuizQuestion } from "@/components/courses/quiz-panel";
import { LESSON_TRANSCRIPTS, type LessonTranscript } from "@/lib/courses/transcripts";

/**
 * Generate multiple-choice questions from transcript / live-caption notes.
 * Used for the final course quiz so assessment tracks what was taught in the videos.
 */

const DISTRACTOR_POOL = [
  "It is only used for server-side SQL queries",
  "It replaces the need for any HTML structure",
  "Browsers ignore this completely",
  "It is a Git command only",
  "It only works offline without a browser",
  "It is the same as a CSS animation",
  "It deletes the page on every refresh",
  "It is required only for mobile apps",
];

/** Course slug → lesson ids that supply notes for that course quiz */
const COURSE_TRANSCRIPT_LESSONS: Record<string, string[]> = {
  "web-foundations": ["wf-1-1", "wf-1-2", "wf-1-3", "wf-2-1", "wf-2-2"],
};

type Fact = {
  lessonId: string;
  claim: string;
  answer: string;
  source: string;
};

/** Hand-authored facts extracted from DoyinTech caption notes (high quality). */
const CURATED_FACTS: Fact[] = [
  {
    lessonId: "wf-1-1",
    claim: "According to the Day 1 notes, what does HTML primarily describe?",
    answer: "The structure and meaning of a web page",
    source: "HTML is the language that describes the structure and meaning of a web page.",
  },
  {
    lessonId: "wf-1-1",
    claim: "What should every modern HTML document start with?",
    answer: "<!DOCTYPE html>",
    source: "Every HTML document starts with a doctype declaration.",
  },
  {
    lessonId: "wf-1-1",
    claim: "Which two main sections sit inside the html root element?",
    answer: "head and body",
    source: "Inside it you have two main sections: head and body.",
  },
  {
    lessonId: "wf-1-1",
    claim: "What does the head section mainly hold?",
    answer: "Metadata such as title, charset, and stylesheet links",
    source: "The head holds metadata — the page title, character set, and links to stylesheets.",
  },
  {
    lessonId: "wf-1-2",
    claim: "Which semantic landmark is recommended for the primary content?",
    answer: "<main>",
    source: "Use semantic landmarks: header, nav, main, and footer.",
  },
  {
    lessonId: "wf-1-2",
    claim: "Why use semantic tags like header, nav, and footer?",
    answer: "They improve accessibility, structure, and SEO",
    source: "Semantic tags help accessibility tools and improve SEO.",
  },
  {
    lessonId: "wf-1-3",
    claim: "How many h1 elements should a page typically use for its main topic?",
    answer: "One",
    source: "Use one h1 for the main topic of the page.",
  },
  {
    lessonId: "wf-1-3",
    claim: "Should you skip heading levels only to change visual size?",
    answer: "No — keep logical order and use CSS for size",
    source: "Do not skip levels just for size — use CSS if you only need visual size.",
  },
  {
    lessonId: "wf-2-1",
    claim: "Which attribute on an anchor tag holds the destination URL?",
    answer: "href",
    source: "The href attribute holds the destination URL.",
  },
  {
    lessonId: "wf-2-1",
    claim: "What should every meaningful image include?",
    answer: "Descriptive alt text",
    source: "Always provide alt text that describes the image for accessibility.",
  },
  {
    lessonId: "wf-2-2",
    claim: "Which list element is best when order does not matter?",
    answer: "ul (unordered list)",
    source: "Unordered lists use ul with li children where order does not matter.",
  },
  {
    lessonId: "wf-2-2",
    claim: "Which list element is best when sequence matters?",
    answer: "ol (ordered list)",
    source: "Ordered lists use ol when sequence matters.",
  },
];

function shuffle<T>(arr: T[], seed: string): T[] {
  const out = [...arr];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildChoices(correct: string, seed: string): { choices: string[]; correctIndex: number } {
  const wrong = shuffle(
    DISTRACTOR_POOL.filter((d) => d.toLowerCase() !== correct.toLowerCase()),
    seed,
  ).slice(0, 3);
  const mixed = shuffle([correct, ...wrong], seed + "-mix");
  return {
    choices: mixed,
    correctIndex: mixed.findIndex((c) => c === correct),
  };
}

function extractAutoFacts(transcript: LessonTranscript): Fact[] {
  const facts: Fact[] = [];
  for (const line of transcript.lines) {
    const text = line.text.trim();
    if (text.length < 40 || text.length > 180) continue;
    if (/welcome|today we|remember:|tip:/i.test(text)) continue;
    const m = text.match(/^(.{8,80}?)\s+(?:is|are|means|uses?)\s+(.{12,90})\.?$/i);
    if (m) {
      facts.push({
        lessonId: transcript.lessonId,
        claim: `According to the notes: ${m[1].trim()}…?`,
        answer: m[2].trim().replace(/\.$/, ""),
        source: text,
      });
    }
  }
  return facts.slice(0, 4);
}

export function getTranscriptsForCourse(courseSlug: string): LessonTranscript[] {
  const ids = COURSE_TRANSCRIPT_LESSONS[courseSlug];
  if (!ids) return [];
  return ids
    .map((id) => LESSON_TRANSCRIPTS[id])
    .filter(Boolean) as LessonTranscript[];
}

export function generateQuizFromNotes(courseSlug: string): QuizQuestion[] | null {
  const transcripts = getTranscriptsForCourse(courseSlug);
  if (!transcripts.length) return null;

  const lessonIds = new Set(transcripts.map((t) => t.lessonId));
  const curated = CURATED_FACTS.filter((f) => lessonIds.has(f.lessonId));

  const auto: Fact[] = [];
  for (const tr of transcripts) {
    auto.push(...extractAutoFacts(tr));
  }

  const seen = new Set<string>();
  const facts: Fact[] = [];
  for (const f of [...curated, ...auto]) {
    const key = f.claim.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    facts.push(f);
    if (facts.length >= 10) break;
  }

  if (!facts.length) return null;

  return facts.map((f, i) => {
    const { choices, correctIndex } = buildChoices(f.answer, `${courseSlug}-${i}-${f.answer}`);
    return {
      id: `notes-${courseSlug}-${i + 1}`,
      prompt: f.claim,
      choices,
      correctIndex: correctIndex < 0 ? 0 : correctIndex,
      explain: f.source,
    };
  });
}

export function resolveCourseQuiz(
  courseSlug: string,
  staticBank: QuizQuestion[] | null | undefined,
): QuizQuestion[] | null {
  const fromNotes = generateQuizFromNotes(courseSlug);
  if (fromNotes && fromNotes.length >= 5) return fromNotes;
  return staticBank ?? fromNotes ?? null;
}
