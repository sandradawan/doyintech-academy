import type { Course } from "./types";
import { courseLessonCount } from "./types";

function L(id: string, title: string, durationMin: number, kind: Course["modules"][0]["lessons"][0]["kind"], summary: string) {
  return { id, title, durationMin, kind, summary };
}

export const courses: Course[] = [
  {
    slug: "web-foundations",
    title: "Web Foundations",
    tagline: "HTML, CSS, and JavaScript — the three languages of the web.",
    description: "Structure documents, style layouts, and add behaviour until you can ship a responsive site without a framework.",
    level: "Beginner",
    accent: "from-blue-600 to-cyan-400",
    hours: 8,
    featured: true,
    outcomes: ["Build semantic HTML", "Lay out pages with Flexbox and Grid", "Write DOM JavaScript", "Ship a responsive page"],
    modules: [
      { id: "wf-1", title: "How the web works", lessons: [
        L("wf-1-1", "Browsers, servers, and requests", 8, "video", "URLs, HTTP, and what happens when you hit Enter."),
        L("wf-1-2", "Your first HTML document", 12, "interactive", "Write a valid page from DOCTYPE to a paragraph."),
      ]},
      { id: "wf-2", title: "Structure with HTML", lessons: [
        L("wf-2-1", "Elements, attributes, and semantics", 14, "text", "Headings, lists, links, and images."),
        L("wf-2-2", "Forms and accessible labels", 16, "interactive", "Build a contact form a screen reader can use."),
      ]},
      { id: "wf-3", title: "Style with CSS", lessons: [
        L("wf-3-1", "Cascade, box model, and units", 12, "video", "Specificity, margin vs padding, rem."),
        L("wf-3-2", "Flexbox and Grid studio", 20, "interactive", "Two-column layout and a card grid."),
        L("wf-3-3", "Responsive layouts", 14, "text", "Mobile-first media queries and fluid type."),
      ]},
      { id: "wf-4", title: "Behaviour with JavaScript", lessons: [
        L("wf-4-1", "The DOM in 10 minutes", 10, "video", "Select, create, and update nodes."),
        L("wf-4-2", "Capstone: a responsive page", 25, "interactive", "Structure, style, and a mobile nav."),
        L("wf-4-3", "Web Foundations quiz", 12, "quiz", "Pass at 70% to unlock your certificate."),
      ]},
    ],
  },
  {
    slug: "javascript-mastery",
    title: "JavaScript Mastery",
    tagline: "Modern JS — the language, not the framework.",
    description: "Own scope, arrays, async, and modules well enough to read production code.",
    level: "Intermediate",
    accent: "from-indigo-500 to-blue-400",
    hours: 10,
    featured: true,
    outcomes: ["Use ES modules fluently", "Transform data with map/filter/reduce", "Handle async with promises", "Structure a small app"],
    modules: [
      { id: "js-1", title: "The language core", lessons: [
        L("js-1-1", "Values, types, and equality", 12, "video", "Primitives vs objects, == vs ===."),
        L("js-1-2", "Functions, scope, and closures", 16, "text", "Lexical scope and arrow functions."),
        L("js-1-3", "Closures in the editor", 18, "interactive", "Counter factory and private cache."),
      ]},
      { id: "js-2", title: "Data and collections", lessons: [
        L("js-2-1", "Arrays and objects as tools", 14, "video", "Spread, rest, destructuring."),
        L("js-2-2", "Transform a dataset", 20, "interactive", "Filter, map, and reduce a student list."),
      ]},
      { id: "js-3", title: "Async JavaScript", lessons: [
        L("js-3-1", "Promises, async/await, and fetch", 14, "video", "Event loop and a clean fetch wrapper."),
        L("js-3-2", "Load and render remote data", 18, "interactive", "Loading, success, and failure states."),
        L("js-3-3", "Modules and a tiny app", 16, "text", "Split code into files with a single entry."),
        L("js-3-4", "JavaScript Mastery quiz", 12, "quiz", "Pass at 70% to unlock your certificate."),
      ]},
    ],
  },
  {
    slug: "react-essentials",
    title: "React Essentials",
    tagline: "Components, state, and hooks — the parts you will use every day.",
    description: "Think in components, lift state on purpose, and ship a small interactive app.",
    level: "Intermediate",
    accent: "from-cyan-500 to-blue-600",
    hours: 10,
    featured: true,
    outcomes: ["Design component trees", "Manage state with hooks", "Fetch data with effects", "Build multi-view UIs"],
    modules: [
      { id: "re-1", title: "Thinking in React", lessons: [
        L("re-1-1", "JSX, props, and composition", 12, "video", "UI as a function of state."),
        L("re-1-2", "Break a mock into components", 16, "interactive", "Split a course card into pieces."),
      ]},
      { id: "re-2", title: "State and events", lessons: [
        L("re-2-1", "useState without the traps", 14, "text", "Updater functions and lifting state."),
        L("re-2-2", "A working filter and form", 20, "interactive", "Controlled inputs and derived state."),
      ]},
      { id: "re-3", title: "Effects and data", lessons: [
        L("re-3-1", "useEffect, dependencies, and cleanup", 12, "video", "When an effect is the right tool."),
        L("re-3-2", "Fetch a course list", 18, "interactive", "Loading, error, and empty states."),
        L("re-3-3", "Client routing and layout", 14, "text", "Shared chrome and nested views."),
        L("re-3-4", "React Essentials quiz", 12, "quiz", "Pass at 70% to unlock your certificate."),
      ]},
    ],
  },
  {
    slug: "typescript-for-developers",
    title: "TypeScript for Developers",
    tagline: "Types that catch bugs before your users do.",
    description: "Model data with interfaces and unions, and read compiler errors as instructions.",
    level: "Intermediate",
    accent: "from-sky-600 to-indigo-500",
    hours: 7,
    outcomes: ["Annotate functions and objects", "Use unions and narrowing", "Type API responses", "Migrate a JS module"],
    modules: [
      { id: "ts-1", title: "Types you will actually use", lessons: [
        L("ts-1-1", "Why TypeScript, and how tsc works", 10, "video", "Gradual typing and tsconfig."),
        L("ts-1-2", "Primitives, objects, and interfaces", 14, "text", "type vs interface and optional fields."),
        L("ts-1-3", "Type a course catalog", 18, "interactive", "Model Course and Lesson."),
      ]},
      { id: "ts-2", title: "Unions and real data", lessons: [
        L("ts-2-1", "Unions, narrowing, and never", 14, "video", "Discriminated unions for lesson kinds."),
        L("ts-2-2", "Generics without the intimidation", 16, "interactive", "Typed fetch helper and Result type."),
        L("ts-2-3", "Migrate a module", 16, "text", "Rename to .ts and fix the first errors."),
        L("ts-2-4", "TypeScript quiz", 12, "quiz", "Pass at 70% to unlock your certificate."),
      ]},
    ],
  },
  {
    slug: "backend-apis-node",
    title: "Backend APIs with Node",
    tagline: "REST, validation, and data — the server side of a product.",
    description: "Design resources, validate input, persist records, and protect routes.",
    level: "Intermediate",
    accent: "from-blue-700 to-cyan-500",
    hours: 11,
    outcomes: ["Design REST resources", "Validate at the boundary", "Persist and query records", "Protect routes"],
    modules: [
      { id: "be-1", title: "HTTP as a product surface", lessons: [
        L("be-1-1", "Methods, status codes, and JSON", 12, "video", "GET vs POST vs PATCH and error shapes."),
        L("be-1-2", "Your first route", 16, "interactive", "Health check and course list endpoint."),
      ]},
      { id: "be-2", title: "Validation and persistence", lessons: [
        L("be-2-1", "Schemas at the boundary", 14, "text", "Parse input once. Never trust the client."),
        L("be-2-2", "Create and list enrollments", 20, "interactive", "POST a record, GET it back."),
        L("be-2-3", "Querying without surprises", 14, "video", "Filters, pagination, safe queries."),
      ]},
      { id: "be-3", title: "Auth and production habits", lessons: [
        L("be-3-1", "Sessions, cookies, and protected routes", 14, "text", "Identity on the server."),
        L("be-3-2", "Lock a gradebook route", 18, "interactive", "401, 403, and owner-only 200."),
        L("be-3-3", "Backend APIs quiz", 12, "quiz", "Pass at 70% to unlock your certificate."),
      ]},
    ],
  },
  {
    slug: "git-professional-workflow",
    title: "Git & Professional Workflow",
    tagline: "Commits, branches, and pull requests that other people can trust.",
    description: "Write commits that explain themselves and open PRs that review cleanly.",
    level: "Beginner",
    accent: "from-slate-600 to-blue-500",
    hours: 5,
    outcomes: ["Make a clean first commit", "Branch and merge safely", "Write solid pull requests", "Collaborate on GitHub"],
    modules: [
      { id: "git-1", title: "Local Git", lessons: [
        L("git-1-1", "Snapshots, not folders", 10, "video", "Working tree, staging, and commits."),
        L("git-1-2", "Your first repository", 14, "interactive", "init, add, commit, log, gitignore."),
        L("git-1-3", "Branching without fear", 12, "text", "Feature branches and merge commits."),
      ]},
      { id: "git-2", title: "GitHub and review", lessons: [
        L("git-2-1", "Remotes, push, and pull", 12, "video", "origin, upstream, and not losing work."),
        L("git-2-2", "Open a pull request", 16, "interactive", "PR description and a reviewable diff."),
        L("git-2-3", "Undo, safely", 12, "text", "restore, revert, rewrite vs record."),
        L("git-2-4", "Git workflow quiz", 10, "quiz", "Pass at 70% to unlock your certificate."),
      ]},
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
