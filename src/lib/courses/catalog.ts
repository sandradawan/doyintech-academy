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
  "CTiMiM99wSE",
  "u7QxB-woWX0",
  "uJ7dUicwQOU",
  "Um0cfZB9Lmc",
  "V2YAF2DrFyY",
  "TLPVp39aS0E",
  "9xBtaGI8uns",
  "1A2nbj1-XBY",
  "CVD8p-Wc-fY",
  "Ts2VHzCyjfY",
] as const;

export const courses: Course[] = [
  {
    slug: "web-foundations",
    thumbnail: youtubeThumb("CTiMiM99wSE", "hq"),
    title: "Introduction to Web Development",
    tagline: "DoyinTech playlist Days 1–10 — watch each video fully to unlock the next.",
    description:
      "Learn web development step by step with DoyinTech (Days 1–10): HTML structure, lists, tables, forms, and CSS basics. Watch each video (≥90%) to unlock the next.",
    level: "Beginner",
    accent: "from-sky-600 to-cyan-400",
    hours: 3,
    featured: true,
    outcomes: [
      "Write a valid HTML document",
      "Structure pages with headings, lists, tables, and forms",
      "Add links, images, and basic CSS",
      "Understand the CSS box model",
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
          L("wf-2-2", "Day 5 — Lists", 2, "video", "Watch fully to unlock Day 6."),
        ],
      },
      {
        id: "wf-3",
        title: "Tables, forms & CSS start",
        lessons: [
          L("wf-3-1", "Day 6 — Tables", 2, "video", "Watch fully to unlock Day 7."),
          L("wf-3-2", "Day 7 — Forms & Inputs", 2, "video", "Watch fully to unlock Day 8."),
          L("wf-3-3", "Day 8 — Introduction to CSS", 2, "video", "Watch fully to unlock Day 9."),
        ],
      },
      {
        id: "wf-4",
        title: "Styling & assessment",
        lessons: [
          L("wf-4-1", "Day 9 — Colors, Fonts & Text", 2, "video", "Watch fully to unlock Day 10."),
          L("wf-4-2", "Day 10 — Box Model & Spacing", 2, "video", "Watch fully to unlock the quiz."),
          L("wf-4-3", "Introduction to Web Development quiz", 12, "quiz", "Pass at 60% toward your certificate."),
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
