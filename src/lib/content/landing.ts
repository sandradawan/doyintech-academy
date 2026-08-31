import { youtubeThumb } from "@/lib/video-progress";

export type LandingVideo = {
  id: string;
  title: string;
  course: string;
  courseSlug: string;
  duration: string;
  summary: string;
  youtubeId: string;
  thumbnail: string;
  topics: string[];
};

export const landingVideos: LandingVideo[] = [
  {
    id: "wf-html",
    title: "HTML structure in 8 minutes",
    course: "Web Foundations",
    courseSlug: "web-foundations",
    duration: "8:12",
    summary:
      "How browsers turn tags into a document tree — headings, paragraphs, links, and the skeleton every page needs.",
    youtubeId: "UB1O30fX-d8",
    thumbnail: youtubeThumb("UB1O30fX-d8"),
    topics: ["HTML", "Semantics", "Beginner"],
  },
  {
    id: "js-core",
    title: "JavaScript values, functions, and flow",
    course: "JavaScript Mastery",
    courseSlug: "javascript-mastery",
    duration: "14:05",
    summary:
      "Variables, functions, and control flow — the language core before frameworks.",
    youtubeId: "W6NZfCO5SIk",
    thumbnail: youtubeThumb("W6NZfCO5SIk"),
    topics: ["JavaScript", "Functions", "Core"],
  },
  {
    id: "react-comp",
    title: "React components and state",
    course: "React Essentials",
    courseSlug: "react-essentials",
    duration: "12:28",
    summary:
      "UI as a function of state. Props, components, and the mental model before hooks go deep.",
    youtubeId: "Tn6-PIqc4UM",
    thumbnail: youtubeThumb("Tn6-PIqc4UM"),
    topics: ["React", "Components", "State"],
  },
  {
    id: "py-intro",
    title: "Python for beginners",
    course: "Python for Beginners",
    courseSlug: "python-for-beginners",
    duration: "20:00",
    summary: "Readable syntax, the REPL, and your first scripts — built for automation and data.",
    youtubeId: "rfscVS0vtbw",
    thumbnail: youtubeThumb("rfscVS0vtbw"),
    topics: ["Python", "Beginner", "Scripts"],
  },
  {
    id: "sql-intro",
    title: "SQL & relational data",
    course: "SQL & Databases",
    courseSlug: "sql-databases",
    duration: "18:00",
    summary: "SELECT, filters, and the table model every backend and analytics role needs.",
    youtubeId: "HXV3zeQKqGY",
    thumbnail: youtubeThumb("HXV3zeQKqGY"),
    topics: ["SQL", "Databases", "Queries"],
  },
  {
    id: "next-app",
    title: "Next.js App Router",
    course: "Next.js Fullstack",
    courseSlug: "nextjs-fullstack",
    duration: "16:00",
    summary: "Layouts, server components, and modern fullstack React on the web.",
    youtubeId: "ZVBC_EZvnfI",
    thumbnail: youtubeThumb("ZVBC_EZvnfI"),
    topics: ["Next.js", "Fullstack", "React"],
  },
];

export const learningSteps = [
  {
    title: "Watch short lessons",
    body: "Focused videos. One idea per lesson so you can finish on a commute or lunch break.",
  },
  {
    title: "Read + practice",
    body: "Written notes, code snippets, and exercises sit next to every video so nothing is watch only.",
  },
  {
    title: "Unlock the next module",
    body: "Learn as you go: finish a module to open the next. A path with progress.",
  },
  {
    title: "Pass the quiz, get certified",
    body: "Score 60%+ on the end-of-course quiz and receive a named Doyintech Academy certificate ID.",
  },
];

export const testimonials = [
  {
    quote:
      "The module unlock system kept me honest. I finished Web Foundations in two weeks and finally understood CSS layout.",
    name: "Adaeze O.",
    role: "Junior frontend · Lagos",
  },
  {
    quote:
      "Short videos plus real exercises — not a 40-hour binge. The certificate actually has my name on it.",
    name: "Kwame B.",
    role: "Career switcher · Accra",
  },
  {
    quote:
      "Feels like a studio code review, not a random YouTube playlist. Exactly what our interns needed.",
    name: "Ngozi I.",
    role: "Engineering lead · Abuja",
  },
];
