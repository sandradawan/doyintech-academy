import { youtubeThumb } from "@/lib/video-progress";
import type { Course } from "./types";
import { courseLessonCount } from "./types";

function L(
  id: string,
  title: string,
  durationMin: number,
  kind: Course["modules"][0]["lessons"][0]["kind"],
  summary: string,
) {
  return { id, title, durationMin, kind, summary };
}

/** DoyinTech playlist https://www.youtube.com/playlist?list=PLb1kWUJelqlw */
export const WEB_DEV_PLAYLIST_IDS = [
  "CTiMiM99wSE", // Day 1 — HTML Basics
  "u7QxB-woWX0", // Day 2 — Page Structure
  "uJ7dUicwQOU", // Day 3 — Headings & Paragraphs
  "Um0cfZB9Lmc", // Day 4 — Links & Images
  "V2YAF2DrFyY", // Day 5 — Lists
] as const;

export const courses: Course[] = [
  {
    slug: "web-foundations",
    thumbnail: youtubeThumb(WEB_DEV_PLAYLIST_IDS[0], "hq"),
    title: "Introduction to Web Development",
    tagline: "DoyinTech playlist — watch each video fully to unlock the next.",
    description:
      "Learn HTML step by step with DoyinTech: HTML basics, page structure, headings, links, images, and lists. Watch each video (≥90%) to unlock the next lesson.",
    level: "Beginner",
    accent: "from-sky-600 to-cyan-400",
    hours: 1,
    featured: true,
    outcomes: [
      "Write a valid HTML document",
      "Structure pages with headings and paragraphs",
      "Add links, images, and lists",
      "Build a foundation for CSS and JavaScript",
    ],
    modules: [
      {
        id: "wf-1",
        title: "HTML foundations",
        lessons: [
          L("wf-1-1", "Day 1 — HTML Basics", 3, "video", "Watch fully to unlock Day 2."),
          L("wf-1-2", "Day 2 — Page Structure", 2, "video", "Watch fully to unlock Day 3."),
          L("wf-1-3", "Day 3 — Headings & Paragraphs", 2, "video", "Watch fully to unlock Day 4."),
        ],
      },
      {
        id: "wf-2",
        title: "Links, media & lists",
        lessons: [
          L("wf-2-1", "Day 4 — Links & Images", 2, "video", "Watch fully to unlock Day 5."),
          L("wf-2-2", "Day 5 — Lists", 2, "video", "Watch fully to unlock the quiz."),
          L("wf-2-3", "Introduction to Web Development quiz", 10, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "javascript-mastery",
    thumbnail: youtubeThumb("W6NZfCO5SIk", "hq"),
    title: "JavaScript Mastery",
    tagline: "Variables, functions, arrays, and the browser APIs you use daily.",
    description:
      "Learn modern JavaScript from first principles so you can read docs, write logic, and wire up interactive UIs.",
    level: "Beginner",
    accent: "from-amber-500 to-orange-600",
    hours: 10,
    featured: true,
    outcomes: [
      "Write clear functions and modules",
      "Transform data with arrays and objects",
      "Handle events and the DOM",
      "Use async/await with confidence",
    ],
    modules: [
      {
        id: "js-1",
        title: "Language basics",
        lessons: [
          L("js-1-1", "JavaScript in the browser", 16, "video", "Console, scripts, and values."),
          L("js-1-2", "Variables and types", 14, "text", "let, const, numbers, strings, and booleans."),
          L("js-1-3", "Functions practice", 18, "interactive", "Parameters, returns, and pure helpers."),
        ],
      },
      {
        id: "js-2",
        title: "Data and control flow",
        lessons: [
          L("js-2-1", "Arrays and objects", 16, "video", "Map, filter, and structured data."),
          L("js-2-2", "Conditionals and loops", 14, "interactive", "Decide and iterate without chaos."),
        ],
      },
      {
        id: "js-3",
        title: "Async and the DOM",
        lessons: [
          L("js-3-1", "Promises and async/await", 16, "video", "Fetch data without blocking the UI."),
          L("js-3-2", "DOM events lab", 20, "interactive", "Buttons, forms, and live updates."),
          L("js-3-3", "JavaScript mastery quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function featuredCourses(): Course[] {
  return courses.filter((course) => course.featured);
}

export function catalogStats() {
  return {
    courseCount: courses.length,
    lessonCount: courses.reduce((n, course) => n + courseLessonCount(course), 0),
    hours: courses.reduce((n, course) => n + course.hours, 0),
  };
}
