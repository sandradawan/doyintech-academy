import type { QuizQuestion } from "@/components/courses/quiz-panel";
import { LESSON_TRANSCRIPTS, type LessonTranscript } from "@/lib/courses/transcripts";

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

const COURSE_TRANSCRIPT_LESSONS: Record<string, string[]> = {
  "web-foundations": [
    "wf-1-1",
    "wf-1-2",
    "wf-1-3",
    "wf-2-1",
    "wf-2-2",
    "wf-3-1",
    "wf-3-2",
    "wf-3-3",
    "wf-4-1",
    "wf-4-2",
  ],
};

type Fact = { lessonId: string; claim: string; answer: string; source: string };

const CURATED_FACTS: Fact[] = [
  { lessonId: "wf-1-1", claim: "According to the Day 1 notes, what does HTML primarily describe?", answer: "The structure and meaning of a web page", source: "HTML describes structure and meaning." },
  { lessonId: "wf-1-1", claim: "What should every modern HTML document start with?", answer: "<!DOCTYPE html>", source: "Doctype declaration." },
  { lessonId: "wf-1-2", claim: "Which semantic landmark is recommended for primary content?", answer: "<main>", source: "Use main for primary content." },
  { lessonId: "wf-1-3", claim: "How many h1 elements should a page typically use?", answer: "One", source: "One h1 for the main topic." },
  { lessonId: "wf-2-1", claim: "Which attribute on an anchor holds the destination URL?", answer: "href", source: "href is the destination." },
  { lessonId: "wf-2-2", claim: "Which list is best when order does not matter?", answer: "ul (unordered list)", source: "ul for unordered lists." },
  { lessonId: "wf-3-1", claim: "Why should every form control have a label?", answer: "So users know what to enter and assistive tech can associate the field", source: "Labels improve usability and accessibility." },
  { lessonId: "wf-3-1", claim: "Which attribute on an input adds basic email validation in HTML?", answer: "type=\"email\"", source: "type=email gives basic validation." },
  { lessonId: "wf-3-2", claim: "Which elements make a basic HTML table row of cells?", answer: "tr with th or td children", source: "table > tr > th/td." },
  { lessonId: "wf-3-2", claim: "When should you use an HTML table?", answer: "For rows of related data — not full page layout", source: "Tables for data, not layout." },
  { lessonId: "wf-3-3", claim: "Why prefer semantic tags over only divs?", answer: "They describe meaning for browsers, assistive tech, and SEO", source: "Semantics convey meaning." },
  { lessonId: "wf-4-1", claim: "What is the difference between id and class attributes?", answer: "id is unique; class can be reused on many elements", source: "id unique, class shared." },
  { lessonId: "wf-4-1", claim: "When opening a link in a new tab, which rel value improves security?", answer: "noopener", source: "rel=noopener with target=_blank." },
  { lessonId: "wf-4-2", claim: "What is the Day 10 capstone goal?", answer: "Assemble Days 1–9 into one complete profile page", source: "Capstone combines prior HTML skills." },
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
  return { choices: mixed, correctIndex: mixed.findIndex((c) => c === correct) };
}

export function getTranscriptsForCourse(courseSlug: string): LessonTranscript[] {
  const ids = COURSE_TRANSCRIPT_LESSONS[courseSlug];
  if (!ids) return [];
  return ids.map((id) => LESSON_TRANSCRIPTS[id]).filter(Boolean) as LessonTranscript[];
}

export function generateQuizFromNotes(courseSlug: string): QuizQuestion[] | null {
  const transcripts = getTranscriptsForCourse(courseSlug);
  if (!transcripts.length) return null;
  const lessonIds = new Set(transcripts.map((t) => t.lessonId));
  const curated = CURATED_FACTS.filter((f) => lessonIds.has(f.lessonId));
  const auto: Fact[] = [];
  for (const tr of transcripts) {
    for (const takeaway of tr.takeaways ?? []) {
      if (takeaway.length < 12) continue;
      auto.push({
        lessonId: tr.lessonId,
        claim: `From ${tr.title}: which statement is correct?`,
        answer: takeaway,
        source: takeaway,
      });
    }
  }
  const seen = new Set<string>();
  const facts: Fact[] = [];
  for (const f of [...curated, ...auto]) {
    const key = f.claim.toLowerCase() + f.answer.toLowerCase();
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
