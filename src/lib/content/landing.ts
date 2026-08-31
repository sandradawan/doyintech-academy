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
    id: "wf-css",
    title: "CSS layout that actually sticks",
    course: "Web Foundations",
    courseSlug: "web-foundations",
    duration: "11:40",
    summary:
      "Box model, flex, and spacing — the tools you use every day to build clean interfaces without fighting the browser.",
    youtubeId: "1Rs2ND1ryYc",
    thumbnail: youtubeThumb("1Rs2ND1ryYc"),
    topics: ["CSS", "Flexbox", "Layout"],
  },
  {
    id: "js-core",
    title: "JavaScript values, functions, and flow",
    course: "JavaScript Mastery",
    courseSlug: "javascript-mastery",
    duration: "14:05",
    summary:
      "Variables, functions, and control flow — the language core before frameworks. Built for people who ship.",
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
      "UI as a function of state. Props, components, and the mental model you need before hooks go deep.",
    youtubeId: "Tn6-PIqc4UM",
    thumbnail: youtubeThumb("Tn6-PIqc4UM"),
    topics: ["React", "Components", "State"],
  },
];

export const learningSteps = [
  {
    title: "Watch short lessons",
    body: "Focused videos under 15 minutes. One idea per lesson so you can finish on a commute or lunch break.",
  },
  {
    title: "Read + practice",
    body: "Written notes, code snippets, and exercises sit next to every video so nothing is watch only.",
  },
  {
    title: "Unlock the next module",
    body: "Learn as you go: finish a module to open the next. No endless playlist — a path with progress.",
  },
  {
    title: "Pass the quiz, get certified",
    body: "Score 70%+ on the end-of-course quiz and receive a named Doyintech Academy certificate ID.",
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
