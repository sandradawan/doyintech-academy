import type { LessonKind } from "./types";

export type CodeBlock = {
  lang: string;
  title?: string;
  code: string;
};

export type Practice = {
  prompt: string;
  starter?: string;
  solution?: string;
};

export type LessonQuizItem = {
  question?: string;
  q?: string;
  choices: string[];
  answerIndex?: number;
  answer?: number;
  explain?: string;
};

export type LessonVideo = {
  script: string;
  storyboard?: { t: string; visual: string; line: string }[];
  grokVideoPrompt?: string;
  url?: string | null;
  status: "script_ready" | "rendered" | "skipped";
};

export type LessonContent = {
  id: string;
  courseSlug?: string;
  title: string;
  kind?: LessonKind;
  durationMin?: number;
  goals?: string[];
  bodyMd?: string;
  body?: string;
  codeBlocks?: CodeBlock[];
  practice?: Practice;
  quiz?: LessonQuizItem[];
  video?: LessonVideo;
  videoScript?: string;
  youtubeId?: string;
  thumbnail?: string;
  publishedAt?: string;
  version?: number;
};

export function contentPath(lessonId: string): string {
  return `/content/lessons/${lessonId}.json`;
}

export function lessonBody(data: LessonContent): string {
  return data.bodyMd || data.body || "";
}
