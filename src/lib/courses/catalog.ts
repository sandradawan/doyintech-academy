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
      "Learn web development step by step with DoyinTech (Days 1–10): HTML structure, lists, forms, tables, semantic landmarks, attributes, and a capstone profile page. Watch each video (≥90%) to unlock the next.",
    level: "Beginner",
    accent: "from-sky-600 to-cyan-400",
    hours: 3,
    featured: true,
    outcomes: [
      "Write a valid HTML document",
      "Structure pages with headings, lists, forms, and tables",
      "Use semantic HTML and attributes correctly",
      "Assemble a complete profile page from Days 1–9",
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
        title: "Forms, tables & semantics",
        lessons: [
          L("wf-3-1", "Day 6 — Forms", 2, "video", "Watch fully to unlock Day 7."),
          L("wf-3-2", "Day 7 — Tables", 2, "video", "Watch fully to unlock Day 8."),
          L("wf-3-3", "Day 8 — Semantic HTML", 2, "video", "Watch fully to unlock Day 9."),
        ],
      },
      {
        id: "wf-4",
        title: "Attributes, capstone & assessment",
        lessons: [
          L("wf-4-1", "Day 9 — HTML Attributes", 2, "video", "Watch fully to unlock Day 10."),
          L("wf-4-2", "Day 10 — Capstone Profile Page", 2, "video", "Watch fully to unlock the quiz."),
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
  {
    slug: "react-essentials",
    thumbnail: youtubeThumb("Tn6-PIqc4UM", "hq"),
    title: "React Essentials",
    tagline: "Components, state, and hooks for interactive interfaces.",
    description:
      "Build UIs as composable components with state, effects, and clean props — the React mental model teams ship with.",
    level: "Intermediate",
    accent: "from-cyan-500 to-blue-600",
    hours: 9,
    featured: true,
    outcomes: [
      "Model UI as components",
      "Manage state with hooks",
      "Fetch data in effects",
      "Lift state and pass props cleanly",
    ],
    modules: [
      {
        id: "re-1",
        title: "Components first",
        lessons: [
          L("re-1-1", "React in one hour", 18, "video", "JSX, components, and props."),
          L("re-1-2", "Compose a card list", 16, "interactive", "Map data into components."),
        ],
      },
      {
        id: "re-2",
        title: "State and events",
        lessons: [
          L("re-2-1", "useState patterns", 14, "text", "When state belongs in a component."),
          L("re-2-2", "Controlled forms", 18, "interactive", "Inputs that mirror React state."),
        ],
      },
      {
        id: "re-3",
        title: "Effects and data",
        lessons: [
          L("re-3-1", "useEffect and fetching", 16, "video", "Load data after render safely."),
          L("re-3-2", "Mini dashboard", 22, "interactive", "List, filter, and loading states."),
          L("re-3-3", "React essentials quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "typescript-for-developers",
    thumbnail: youtubeThumb("30LWjhZzg50", "hq"),
    title: "TypeScript for Developers",
    tagline: "Types that catch bugs before runtime.",
    description:
      "Add TypeScript to real projects: types, interfaces, generics, and patterns that scale with your team.",
    level: "Intermediate",
    accent: "from-blue-600 to-indigo-500",
    hours: 7,
    outcomes: [
      "Annotate functions and objects",
      "Model domain data with types",
      "Use generics without fear",
      "Migrate a JS module safely",
    ],
    modules: [
      {
        id: "ts-1",
        title: "TypeScript basics",
        lessons: [
          L("ts-1-1", "Why TypeScript", 14, "video", "Types as documentation that runs."),
          L("ts-1-2", "Primitives and objects", 14, "text", "Interfaces vs type aliases."),
          L("ts-1-3", "Type a utility module", 18, "interactive", "Strict functions and return types."),
        ],
      },
      {
        id: "ts-2",
        title: "Real project patterns",
        lessons: [
          L("ts-2-1", "Unions, narrowings, generics", 16, "video", "Express real-world shapes."),
          L("ts-2-2", "Type a small API client", 20, "interactive", "Responses, errors, and helpers."),
          L("ts-2-3", "TypeScript quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "backend-apis-node",
    thumbnail: youtubeThumb("fgTGADljAeg", "hq"),
    title: "Backend APIs with Node",
    tagline: "HTTP, JSON APIs, and durable server habits.",
    description:
      "Design and implement REST-style APIs with Node: routing, validation, auth boundaries, and clear error shapes.",
    level: "Intermediate",
    accent: "from-emerald-600 to-teal-500",
    hours: 10,
    outcomes: [
      "Design resource-oriented endpoints",
      "Validate input and shape errors",
      "Protect routes with auth checks",
      "Persist data with a simple store",
    ],
    modules: [
      {
        id: "be-1",
        title: "HTTP and routing",
        lessons: [
          L("be-1-1", "APIs and HTTP", 14, "video", "Methods, status codes, and JSON."),
          L("be-1-2", "Route design", 14, "text", "Nouns, verbs, and versioning."),
          L("be-1-3", "Build a notes API", 20, "interactive", "CRUD with in-memory storage."),
        ],
      },
      {
        id: "be-2",
        title: "Validation and data",
        lessons: [
          L("be-2-1", "Input validation", 12, "text", "Never trust the client."),
          L("be-2-2", "Auth boundaries", 14, "text", "Who can call what."),
          L("be-2-3", "Querying without surprises", 14, "video", "Filters, pagination, safe queries."),
          L("be-2-4", "Backend APIs quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "git-professional-workflow",
    thumbnail: youtubeThumb("RGOj5yH7evk", "hq"),
    title: "Git Professional Workflow",
    tagline: "Commits, branches, and collaboration that teams trust.",
    description:
      "Use Git like a professional: clean history, branches, pull requests, and recovery without panic.",
    level: "Beginner",
    accent: "from-orange-600 to-red-500",
    hours: 5,
    featured: true,
    outcomes: [
      "Commit with clear messages",
      "Branch and merge safely",
      "Use pull requests effectively",
      "Recover from common mistakes",
    ],
    modules: [
      {
        id: "git-1",
        title: "Core model",
        lessons: [
          L("git-1-1", "Snapshots, not folders", 10, "video", "Working tree, staging, and commits."),
          L("git-1-2", "Branching workflow", 12, "text", "Feature branches and main."),
          L("git-1-3", "Practice: first repo", 16, "interactive", "Init, commit, branch, merge."),
        ],
      },
      {
        id: "git-2",
        title: "Collaboration",
        lessons: [
          L("git-2-1", "Remotes, push, and pull", 12, "video", "origin, upstream, and not losing work."),
          L("git-2-2", "PRs and code review", 12, "text", "What good review looks like."),
          L("git-2-3", "Git quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "python-for-beginners",
    thumbnail: youtubeThumb("rfscVS0vtbw", "hq"),
    title: "Python for Beginners",
    tagline: "Readable code for scripts, data, and automation.",
    description:
      "Learn Python from zero: syntax, data structures, functions, and small programs you can run today.",
    level: "Beginner",
    accent: "from-yellow-500 to-amber-600",
    hours: 8,
    featured: true,
    outcomes: [
      "Write and run Python scripts",
      "Use lists, dicts, and loops",
      "Structure code with functions",
      "Read files and handle errors",
    ],
    modules: [
      {
        id: "py-1",
        title: "Python basics",
        lessons: [
          L("py-1-1", "Python full course overview", 20, "video", "Install, REPL, and first program."),
          L("py-1-2", "Variables and control flow", 14, "text", "if, while, and for."),
          L("py-1-3", "Functions lab", 16, "interactive", "Arguments, returns, and defaults."),
        ],
      },
      {
        id: "py-2",
        title: "Data and files",
        lessons: [
          L("py-2-1", "Lists and loops", 16, "video", "Iterate and transform sequences."),
          L("py-2-2", "Dicts and JSON", 14, "text", "Keyed data and simple APIs."),
          L("py-2-3", "Python quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "html-css-advanced",
    thumbnail: youtubeThumb("1Rs2ND1ryYc", "hq"),
    title: "HTML & CSS Advanced",
    tagline: "Layout systems, responsive design, and polished UI.",
    description:
      "Go beyond basics: Grid, Flexbox mastery, responsive patterns, and accessible components.",
    level: "Intermediate",
    accent: "from-pink-500 to-rose-600",
    hours: 8,
    outcomes: [
      "Build complex layouts with Grid",
      "Master Flexbox alignment",
      "Ship responsive pages",
      "Use modern CSS features carefully",
    ],
    modules: [
      {
        id: "hc-1",
        title: "Layout systems",
        lessons: [
          L("hc-1-1", "CSS Grid deep dive", 18, "video", "Tracks, areas, and responsive grids."),
          L("hc-1-2", "Flexbox patterns", 14, "text", "Alignment, wrapping, and gaps."),
          L("hc-1-3", "Responsive landing page", 20, "interactive", "Mobile-first sections."),
        ],
      },
      {
        id: "hc-2",
        title: "Polish",
        lessons: [
          L("hc-2-1", "Typography and color", 12, "text", "Readable type scales."),
          L("hc-2-2", "Advanced CSS quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "nextjs-fullstack",
    thumbnail: youtubeThumb("ZVBC_EZvnfI", "hq"),
    title: "Next.js Fullstack",
    tagline: "App Router, server components, and production patterns.",
    description:
      "Build fullstack apps with Next.js: routing, data fetching, server actions, and deployment awareness.",
    level: "Intermediate",
    accent: "from-slate-700 to-zinc-500",
    hours: 10,
    featured: true,
    outcomes: [
      "Use the App Router confidently",
      "Fetch data on the server",
      "Mutate with server actions",
      "Structure a small production app",
    ],
    modules: [
      {
        id: "nx-1",
        title: "App Router",
        lessons: [
          L("nx-1-1", "Next.js App Router", 18, "video", "Layouts, pages, and nested routes."),
          L("nx-1-2", "Server vs client components", 14, "text", "Where code should run."),
          L("nx-1-3", "Build a multi-page app", 20, "interactive", "Navigation and shared layout."),
        ],
      },
      {
        id: "nx-2",
        title: "Data and mutations",
        lessons: [
          L("nx-2-1", "Server actions and forms", 16, "video", "Mutations without a separate API."),
          L("nx-2-2", "Next.js quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "sql-databases",
    thumbnail: youtubeThumb("HXV3zeQKqGY", "hq"),
    title: "SQL & Databases",
    tagline: "Query relational data with confidence.",
    description:
      "Learn SQL for real applications: SELECT, joins, aggregation, indexes, and safe updates.",
    level: "Beginner",
    accent: "from-lime-600 to-green-600",
    hours: 7,
    outcomes: [
      "Write SELECT queries",
      "Join tables correctly",
      "Aggregate and group data",
      "Understand keys and indexes",
    ],
    modules: [
      {
        id: "sql-1",
        title: "Query foundations",
        lessons: [
          L("sql-1-1", "SQL full course overview", 20, "video", "Tables, rows, and SELECT."),
          L("sql-1-2", "WHERE, ORDER BY, LIMIT", 12, "text", "Filter and sort results."),
          L("sql-1-3", "Practice queries", 16, "interactive", "Hands-on SELECT drills."),
        ],
      },
      {
        id: "sql-2",
        title: "Joins and design",
        lessons: [
          L("sql-2-1", "INNER and LEFT JOIN", 14, "video", "Combine related tables."),
          L("sql-2-2", "Keys and normalization", 12, "text", "Why schemas matter."),
          L("sql-2-3", "SQL quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "data-structures-algorithms",
    thumbnail: youtubeThumb("8hly31x25IM", "hq"),
    title: "Data Structures & Algorithms",
    tagline: "Think clearly about time, space, and problem shape.",
    description:
      "Core DSA for interviews and real code: arrays, hash maps, recursion, sorting, and Big-O intuition.",
    level: "Intermediate",
    accent: "from-violet-600 to-purple-600",
    hours: 12,
    outcomes: [
      "Analyze Big-O roughly",
      "Use arrays and hash maps well",
      "Write recursive solutions",
      "Choose simple algorithms first",
    ],
    modules: [
      {
        id: "dsa-1",
        title: "Foundations",
        lessons: [
          L("dsa-1-1", "Big-O and tradeoffs", 14, "video", "Time vs space in plain language."),
          L("dsa-1-2", "Arrays and hash maps", 16, "text", "When each structure wins."),
          L("dsa-1-3", "Solve two classic problems", 20, "interactive", "Two-sum style drills."),
        ],
      },
      {
        id: "dsa-2",
        title: "Recursion and sorting",
        lessons: [
          L("dsa-2-1", "Recursion patterns", 14, "video", "Base case and progress."),
          L("dsa-2-2", "DSA quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "cybersecurity-basics",
    thumbnail: youtubeThumb("inWWhr5tnEA", "hq"),
    title: "Cybersecurity Basics",
    tagline: "Defend accounts, apps, and data from common threats.",
    description:
      "Practical security for builders: passwords, phishing, HTTPS, XSS/CSRF awareness, and safer defaults.",
    level: "Beginner",
    accent: "from-red-600 to-orange-600",
    hours: 5,
    outcomes: [
      "Recognize common attacks",
      "Use safer authentication habits",
      "Understand HTTPS and cookies",
      "Avoid basic web vulns",
    ],
    modules: [
      {
        id: "sec-1",
        title: "Threats and accounts",
        lessons: [
          L("sec-1-1", "Threat landscape", 12, "video", "What attackers actually do."),
          L("sec-1-2", "Passwords and MFA", 12, "text", "Credentials that resist theft."),
          L("sec-1-3", "Phishing lab", 14, "interactive", "Spot suspicious messages."),
        ],
      },
      {
        id: "sec-2",
        title: "Web security",
        lessons: [
          L("sec-2-1", "XSS, CSRF, and HTTPS", 14, "video", "Browser security basics."),
          L("sec-2-2", "Security quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "mobile-react-native",
    thumbnail: youtubeThumb("0-S5a0eXPoc", "hq"),
    title: "Mobile with React Native",
    tagline: "Cross-platform mobile UI with React skills you already have.",
    description:
      "Build mobile screens with React Native: components, navigation basics, and platform differences.",
    level: "Intermediate",
    accent: "from-sky-500 to-indigo-600",
    hours: 8,
    outcomes: [
      "Compose mobile screens",
      "Style with Flexbox on mobile",
      "Navigate between screens",
      "Handle platform quirks",
    ],
    modules: [
      {
        id: "rn-1",
        title: "RN fundamentals",
        lessons: [
          L("rn-1-1", "React Native overview", 16, "video", "Components that map to native views."),
          L("rn-1-2", "Layout on mobile", 14, "text", "Flexbox differences that matter."),
          L("rn-1-3", "First mobile screen", 18, "interactive", "List + detail pattern."),
        ],
      },
      {
        id: "rn-2",
        title: "Navigation",
        lessons: [
          L("rn-2-1", "Stack navigation", 14, "video", "Screens and params."),
          L("rn-2-2", "React Native quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "devops-docker",
    thumbnail: youtubeThumb("3c-iBn73dDE", "hq"),
    title: "DevOps & Docker",
    tagline: "Package and run apps the same way everywhere.",
    description:
      "Containers for developers: images, Dockerfiles, volumes, and a minimal path to deployable services.",
    level: "Intermediate",
    accent: "from-blue-500 to-cyan-600",
    hours: 6,
    outcomes: [
      "Write a Dockerfile",
      "Run multi-container setups",
      "Understand images vs containers",
      "Ship a small service consistently",
    ],
    modules: [
      {
        id: "dk-1",
        title: "Containers",
        lessons: [
          L("dk-1-1", "Docker overview", 16, "video", "Images, containers, and registries."),
          L("dk-1-2", "Write a Dockerfile", 14, "text", "Layers and best practices."),
          L("dk-1-3", "Containerize an app", 18, "interactive", "Build and run locally."),
        ],
      },
      {
        id: "dk-2",
        title: "Compose and deploy habits",
        lessons: [
          L("dk-2-1", "docker-compose basics", 14, "text", "App + database together."),
          L("dk-2-2", "Ship a small stack", 18, "interactive", "Healthchecks and env files."),
          L("dk-2-3", "Docker quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "ai-prompt-engineering",
    thumbnail: youtubeThumb("jHv63Uvk5VA", "hq"),
    title: "AI & Prompt Engineering",
    tagline: "Use large language models effectively for learning and building.",
    description:
      "Learn how prompts, context, and evaluation shape model output so you can use AI as a serious coding partner.",
    level: "Beginner",
    accent: "from-fuchsia-600 to-purple-500",
    hours: 5,
    featured: true,
    outcomes: [
      "Write clear, constrained prompts",
      "Iterate with examples and rubrics",
      "Use AI for learning without outsourcing thinking",
      "Spot hallucinations and weak answers",
    ],
    modules: [
      {
        id: "ai-1",
        title: "How models respond",
        lessons: [
          L("ai-1-1", "LLMs for developers", 14, "video", "Tokens, context, and limitations."),
          L("ai-1-2", "Prompt patterns that work", 14, "text", "Roles, steps, and output formats."),
        ],
      },
      {
        id: "ai-2",
        title: "Practical prompting",
        lessons: [
          L("ai-2-1", "Few-shot and chain-of-thought", 14, "video", "Patterns that improve reliability."),
          L("ai-2-2", "Build a study coach prompt", 18, "interactive", "Turn a syllabus into a tutor."),
          L("ai-2-3", "AI & prompting quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
];

/** Alias marketing URLs to canonical slugs. */
const SLUG_ALIASES: Record<string, string> = {
  "introduction-to-web-development": "web-foundations",
  "intro-to-web-development": "web-foundations",
};

export function getCourse(slug: string): Course | undefined {
  const canonical = SLUG_ALIASES[slug] || slug;
  return courses.find((course) => course.slug === canonical);
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
