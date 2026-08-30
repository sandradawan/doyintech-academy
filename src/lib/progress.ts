"use client";

import type { Course, CourseModule, Lesson } from "@/lib/courses/types";
import type { Enrollment } from "@/lib/auth";

/** Module 0 is always open. Module N opens only after every lesson in modules 0..N-1 is complete. */
export function isModuleUnlocked(
  course: Course,
  enrollment: Enrollment | undefined,
  moduleIndex: number,
): boolean {
  if (moduleIndex <= 0) return true;
  if (!enrollment) return false;
  for (let i = 0; i < moduleIndex; i++) {
    if (!isModuleComplete(course.modules[i], enrollment)) return false;
  }
  return true;
}

export function isModuleComplete(
  mod: CourseModule,
  enrollment: Enrollment | undefined,
): boolean {
  if (!enrollment) return false;
  return mod.lessons.every((lesson) => enrollment.completedLessons.includes(lesson.id));
}

/** Highest module index the student may work on (0-based). */
export function getActiveModuleIndex(
  course: Course,
  enrollment: Enrollment | undefined,
): number {
  if (!enrollment) return 0;
  let active = 0;
  for (let i = 0; i < course.modules.length; i++) {
    if (isModuleUnlocked(course, enrollment, i)) {
      active = i;
      if (!isModuleComplete(course.modules[i], enrollment)) break;
    } else {
      break;
    }
  }
  return active;
}

export function countUnlockedModules(
  course: Course,
  enrollment: Enrollment | undefined,
): number {
  let n = 0;
  for (let i = 0; i < course.modules.length; i++) {
    if (isModuleUnlocked(course, enrollment, i)) n += 1;
    else break;
  }
  return n;
}

/** True when every lesson in every module is complete. */
export function isCourseLessonsComplete(
  course: Course,
  enrollment: Enrollment | undefined,
): boolean {
  if (!enrollment) return false;
  return course.modules.every((mod) => isModuleComplete(mod, enrollment));
}

export function getNextIncompleteLesson(
  course: Course,
  enrollment: Enrollment | undefined,
): { moduleIndex: number; lesson: Lesson } | null {
  if (!enrollment) {
    const first = course.modules[0]?.lessons[0];
    return first ? { moduleIndex: 0, lesson: first } : null;
  }
  for (let i = 0; i < course.modules.length; i++) {
    if (!isModuleUnlocked(course, enrollment, i)) break;
    for (const lesson of course.modules[i].lessons) {
      if (!enrollment.completedLessons.includes(lesson.id)) {
        return { moduleIndex: i, lesson };
      }
    }
  }
  return null;
}

export function moduleProgress(
  mod: CourseModule,
  enrollment: Enrollment | undefined,
): { done: number; total: number; percent: number } {
  const total = mod.lessons.length;
  const done = enrollment
    ? mod.lessons.filter((l) => enrollment.completedLessons.includes(l.id)).length
    : 0;
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}
