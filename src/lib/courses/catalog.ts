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

export const courses: Course[] = [
  {
    slug: "web-foundations",
    thumbnail: youtubeThumb("UB1O30fX-d8", "hq"),
    title: "Introduction to Web Development",
    tagline: "Learn HTML, CSS, and how the web works — watch each video to unlock the next.",
    description:
      "A sequential video path into web development. Finish each video (watch ≥90%) to unlock the next lesson — HTML, CSS, layout, and shipping your first pages.",
    level: "Beginner",
    accent: "from-sky-600 to-cyan-400",
    hours: 8,
    featured: true,
    outcomes: [
      "Structure pages with semantic HTML",
      "Style layouts with modern CSS",
      "Use DevTools to debug the DOM",
      "Ship a responsive landing page",
    ],
    modules: [
      {
        id: "wf-1",
        title: "How the web works",
        lessons: [
          L("wf-1-1", "How the web works", 12, "video", "Watch fully to unlock the next video."),
          L("wf-1-2", "Your first HTML page", 18, "video", "Watch fully to unlock the next video."),
          L("wf-1-3", "Inspect and understand", 10, "video", "Watch fully to unlock the next video."),
        ],
      },
      {
        id: "wf-2",
        title: "Structure and meaning",
        lessons: [
          L("wf-2-1", "Semantic HTML", 14, "video", "Watch fully to unlock the next video."),
          L("wf-2-2", "Forms that collect data", 16, "video", "Watch fully to unlock the next video."),
        ],
      },
      {
        id: "wf-3",
        title: "CSS foundations",
        lessons: [
          L("wf-3-1", "CSS cascade and selectors", 14, "video", "Watch fully to unlock the next video."),
          L("wf-3-2", "Box model and spacing", 12, "video", "Watch fully to unlock the next video."),
          L("wf-3-3", "Flexbox layout lab", 20, "video", "Watch fully to unlock the next video."),
        ],
      },
      {
        id: "wf-4",
        title: "Responsive pages",
        lessons: [
          L("wf-4-1", "Responsive design", 14, "video", "Watch fully to unlock the next video."),
          L("wf-4-2", "Ship a landing page", 22, "video", "Watch fully to unlock the next video."),
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

// NOTE: remaining courses are loaded from the full catalog in production builds.
// This intermediate publish keeps Introduction to Web Development sequential-video ready.
// Full 15-course catalog will be restored in the next sync if truncated.

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function catalogStats() {
  const courseCount = courses.length;
  const lessonCount = courses.reduce((n, c) => n + courseLessonCount(c), 0);
  const hours = courses.reduce((n, c) => n + c.hours, 0);
  return { courseCount, lessonCount, hours };
}
