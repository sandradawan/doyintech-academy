export type LessonKind = "video" | "text" | "interactive" | "quiz";
export type CourseLevel = "Beginner" | "Intermediate";

export type Lesson = {
  id: string;
  title: string;
  durationMin: number;
  kind: LessonKind;
  summary: string;
};

export type CourseModule = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  level: CourseLevel;
  accent: string;
  hours: number;
  /** Cover image URL (YouTube thumb or hosted asset) */
  thumbnail?: string;
  featured?: boolean;
  outcomes: string[];
  modules: CourseModule[];
};

export function courseLessonCount(course: Course): number {
  return course.modules.reduce((n, mod) => n + mod.lessons.length, 0);
}

export function courseDurationMin(course: Course): number {
  return course.modules.reduce(
    (n, mod) => n + mod.lessons.reduce((m, lesson) => m + lesson.durationMin, 0),
    0,
  );
}
