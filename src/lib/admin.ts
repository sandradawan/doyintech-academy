"use client";

const ADMIN_KEY = "doyintech-academy-admin";
const CONTENT_KEY = "doyintech-academy-content-overrides";
const WAITLIST_KEY = "doyintech-academy-waitlist";
const QUIZ_KEY = "doyintech-academy-quizzes";

// Demo admin PIN — replace with real auth before production traffic
export const ADMIN_PIN = "doyin2026";

export type WaitlistEntry = {
  email: string;
  name: string;
  createdAt: string;
};

export type ContentOverride = {
  courseSlug: string;
  lessonId: string;
  title?: string;
  summary?: string;
  videoUrl?: string;
  body?: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_KEY) === "1";
}

export function adminLogin(pin: string): boolean {
  if (pin.trim() === ADMIN_PIN) {
    localStorage.setItem(ADMIN_KEY, "1");
    return true;
  }
  return false;
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_KEY);
}

export function getOverrides(): ContentOverride[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(CONTENT_KEY), []);
}

export function saveOverride(override: ContentOverride) {
  const list = getOverrides().filter(
    (o) => !(o.courseSlug === override.courseSlug && o.lessonId === override.lessonId),
  );
  list.push(override);
  localStorage.setItem(CONTENT_KEY, JSON.stringify(list));
}

export function getOverride(courseSlug: string, lessonId: string): ContentOverride | undefined {
  return getOverrides().find((o) => o.courseSlug === courseSlug && o.lessonId === lessonId);
}

export function getWaitlist(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(WAITLIST_KEY), []);
}

export function addToWaitlist(name: string, email: string): { ok: boolean; message: string } {
  const list = getWaitlist();
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) {
    return { ok: false, message: "Enter a valid email." };
  }
  if (list.some((e) => e.email === normalized)) {
    return { ok: false, message: "You are already on the waitlist." };
  }
  list.push({
    name: name.trim() || "Student",
    email: normalized,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(list));
  return { ok: true, message: "You are on the list. We will write when the cohort opens." };
}

export function getQuiz(courseSlug: string): QuizQuestion[] {
  if (typeof window === "undefined") return defaultQuiz(courseSlug);
  const all = safeParse<Record<string, QuizQuestion[]>>(localStorage.getItem(QUIZ_KEY), {});
  return all[courseSlug] || defaultQuiz(courseSlug);
}

export function saveQuiz(courseSlug: string, questions: QuizQuestion[]) {
  const all = safeParse<Record<string, QuizQuestion[]>>(localStorage.getItem(QUIZ_KEY), {});
  all[courseSlug] = questions;
  localStorage.setItem(QUIZ_KEY, JSON.stringify(all));
}

function defaultQuiz(courseSlug: string): QuizQuestion[] {
  const bank: Record<string, QuizQuestion[]> = {
    "web-foundations": [
      {
        id: "q1",
        prompt: "What does HTML stand for in practice?",
        choices: [
          "A styling language for colors",
          "The structure and meaning of a web document",
          "A JavaScript framework",
          "A database query language",
        ],
        correctIndex: 1,
      },
      {
        id: "q2",
        prompt: "Which CSS layout tool is best for two-dimensional grids?",
        choices: ["float", "position: absolute", "CSS Grid", "text-align"],
        correctIndex: 2,
      },
      {
        id: "q3",
        prompt: "document.querySelector is used to…",
        choices: [
          "Install packages",
          "Select a DOM node",
          "Compile TypeScript",
          "Create a Git commit",
        ],
        correctIndex: 1,
      },
    ],
    "react-essentials": [
      {
        id: "q1",
        prompt: "Props in React flow…",
        choices: ["Up from child to parent", "One way, parent to child", "Both directions equally", "Only through context"],
        correctIndex: 1,
      },
      {
        id: "q2",
        prompt: "useState returns…",
        choices: [
          "Only the current value",
          "A value and a setter function",
          "A ref object",
          "A promise",
        ],
        correctIndex: 1,
      },
      {
        id: "q3",
        prompt: "An effect with an empty dependency array runs…",
        choices: ["On every render", "Once after mount", "Never", "Only on unmount"],
        correctIndex: 1,
      },
    ],
  };
  return (
    bank[courseSlug] || [
      {
        id: "q1",
        prompt: "What is the pass mark for a Doyintech Academy certificate?",
        choices: ["50%", "60%", "70%", "90%"],
        correctIndex: 2,
      },
      {
        id: "q2",
        prompt: "A good commit message should…",
        choices: [
          "Only say 'update'",
          "Explain the change clearly",
          "List every file name",
          "Be empty",
        ],
        correctIndex: 1,
      },
      {
        id: "q3",
        prompt: "TypeScript helps primarily by…",
        choices: [
          "Replacing JavaScript at runtime",
          "Catching type errors before runtime",
          "Speeding up the network",
          "Styling components",
        ],
        correctIndex: 1,
      },
    ]
  );
}
