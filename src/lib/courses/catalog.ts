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
] as const;

export const courses: Course[] = [
  {
    slug: "web-foundations",
    thumbnail: youtubeThumb("CTiMiM99wSE", "hq"),
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
        title: "Practical patterns",
        lessons: [
          L("ts-2-1", "Unions, narrowings, generics", 16, "video", "Express real-world shapes."),
          L("ts-2-2", "Type a small API client", 20, "interactive", "Request and response types."),
          L("ts-2-3", "TypeScript quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "backend-apis-node",
    thumbnail: youtubeThumb("fgTGADljAeg", "hq"),
    title: "Backend APIs with Node",
    tagline: "HTTP, routes, validation, and auth habits that hold up.",
    description:
      "Design and implement JSON APIs with Node: routing, validation, databases, and protecting routes.",
    level: "Intermediate",
    accent: "from-emerald-600 to-teal-500",
    hours: 9,
    outcomes: [
      "Design REST-style endpoints",
      "Validate input on the server",
      "Persist enrollments and grades",
      "Protect routes with sessions",
    ],
    modules: [
      {
        id: "be-1",
        title: "HTTP and servers",
        lessons: [
          L("be-1-1", "APIs and HTTP", 14, "video", "Methods, status codes, and JSON."),
          L("be-1-2", "Your first route", 16, "interactive", "GET and POST that return data."),
        ],
      },
      {
        id: "be-2",
        title: "Data and validation",
        lessons: [
          L("be-2-1", "Validation is a boundary", 14, "text", "Parse input once. Never trust the client."),
          L("be-2-2", "Create and list enrollments", 20, "interactive", "POST a record, GET it back."),
          L("be-2-3", "Querying without surprises", 14, "video", "Filters, pagination, safe queries."),
        ],
      },
      {
        id: "be-3",
        title: "Auth and production habits",
        lessons: [
          L("be-3-1", "Sessions, cookies, and protected routes", 14, "text", "Identity on the server."),
          L("be-3-2", "Lock a gradebook route", 18, "interactive", "401, 403, and owner-only 200."),
          L("be-3-3", "Backend APIs quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "git-professional-workflow",
    thumbnail: youtubeThumb("RGOj5yH7evk", "hq"),
    title: "Git & Professional Workflow",
    tagline: "Commits, branches, and pull requests teams can trust.",
    description:
      "Write commits that explain themselves and open PRs that review cleanly on GitHub.",
    level: "Beginner",
    accent: "from-slate-600 to-blue-500",
    hours: 5,
    outcomes: [
      "Make a clean first commit",
      "Branch and merge safely",
      "Write solid pull requests",
      "Collaborate on GitHub",
    ],
    modules: [
      {
        id: "git-1",
        title: "Local Git",
        lessons: [
          L("git-1-1", "Snapshots, not folders", 10, "video", "Working tree, staging, and commits."),
          L("git-1-2", "Your first repository", 14, "interactive", "init, add, commit, log, gitignore."),
          L("git-1-3", "Branching without fear", 12, "text", "Feature branches and merge commits."),
        ],
      },
      {
        id: "git-2",
        title: "GitHub and review",
        lessons: [
          L("git-2-1", "Remotes, push, and pull", 12, "video", "origin, upstream, and not losing work."),
          L("git-2-2", "Open a pull request", 16, "interactive", "PR description and a reviewable diff."),
          L("git-2-3", "Undo, safely", 12, "text", "restore, revert, rewrite vs record."),
          L("git-2-4", "Git workflow quiz", 10, "quiz", "Pass at 60% toward your certificate."),
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
      "Learn Python syntax, data structures, functions, and files so you can automate tasks and prepare for data work.",
    level: "Beginner",
    accent: "from-yellow-500 to-green-600",
    hours: 12,
    featured: true,
    outcomes: [
      "Write Python scripts with confidence",
      "Use lists, dicts, and loops",
      "Read and write files",
      "Solve small problems cleanly",
    ],
    modules: [
      {
        id: "py-1",
        title: "Python basics",
        lessons: [
          L("py-1-1", "Python full course overview", 20, "video", "Install, REPL, and first program."),
          L("py-1-2", "Variables and types", 14, "text", "int, float, str, and bool."),
          L("py-1-3", "Functions lab", 18, "interactive", "Define, call, and return values."),
        ],
      },
      {
        id: "py-2",
        title: "Collections and control",
        lessons: [
          L("py-2-1", "Lists and loops", 16, "video", "Iterate and transform sequences."),
          L("py-2-2", "Dicts and conditionals", 16, "interactive", "Lookups and branching logic."),
        ],
      },
      {
        id: "py-3",
        title: "Files and projects",
        lessons: [
          L("py-3-1", "Working with files", 14, "text", "Read, write, and simple CSV."),
          L("py-3-2", "Mini CLI tool", 20, "interactive", "Parse args and print a report."),
          L("py-3-3", "Python quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "html-css-advanced",
    thumbnail: youtubeThumb("1Rs2ND1ryYc", "hq"),
    title: "HTML & CSS Advanced",
    tagline: "Layouts, animations, and production-ready UI polish.",
    description:
      "Go beyond basics: Grid, custom properties, accessibility, and motion that feels intentional.",
    level: "Intermediate",
    accent: "from-pink-500 to-rose-600",
    hours: 8,
    outcomes: [
      "Build complex layouts with Grid",
      "Theme with CSS variables",
      "Animate without jank",
      "Improve accessibility scores",
    ],
    modules: [
      {
        id: "hc-1",
        title: "Modern layout",
        lessons: [
          L("hc-1-1", "CSS Grid deep dive", 18, "video", "Tracks, areas, and responsive grids."),
          L("hc-1-2", "Grid gallery lab", 18, "interactive", "Photo grid that reflows cleanly."),
        ],
      },
      {
        id: "hc-2",
        title: "Polish and a11y",
        lessons: [
          L("hc-2-1", "Variables, themes, focus", 14, "text", "Design tokens and keyboard paths."),
          L("hc-2-2", "Micro-interactions", 16, "interactive", "Transitions and prefers-reduced-motion."),
          L("hc-2-3", "Advanced CSS quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "nextjs-fullstack",
    thumbnail: youtubeThumb("ZVBC_EZvnfI", "hq"),
    title: "Next.js Fullstack",
    tagline: "App Router, server components, and production deploys.",
    description:
      "Build fullstack apps with Next.js: routing, server components, server actions, and Vercel deployment.",
    level: "Intermediate",
    accent: "from-zinc-700 to-neutral-900",
    hours: 10,
    featured: true,
    outcomes: [
      "Structure an App Router project",
      "Mix server and client components",
      "Mutate data with server actions",
      "Deploy to production",
    ],
    modules: [
      {
        id: "nx-1",
        title: "App Router foundations",
        lessons: [
          L("nx-1-1", "Next.js App Router", 18, "video", "Layouts, pages, and nested routes."),
          L("nx-1-2", "Server vs client components", 14, "text", "When to add 'use client'."),
          L("nx-1-3", "Build a course list page", 18, "interactive", "Fetch and render on the server."),
        ],
      },
      {
        id: "nx-2",
        title: "Data and deploy",
        lessons: [
          L("nx-2-1", "Server actions and forms", 16, "video", "Mutations without a separate API."),
          L("nx-2-2", "Auth-aware dashboard shell", 20, "interactive", "Protect a route and show user state."),
          L("nx-2-3", "Next.js quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "sql-databases",
    thumbnail: youtubeThumb("HXV3zeQKqGY", "hq"),
    title: "SQL & Databases",
    tagline: "Query, model, and reason about relational data.",
    description:
      "Master SELECT, joins, aggregation, and schema design so your apps store data correctly.",
    level: "Beginner",
    accent: "from-violet-600 to-purple-500",
    hours: 9,
    outcomes: [
      "Write precise SELECT queries",
      "Join tables safely",
      "Aggregate and group results",
      "Design simple schemas",
    ],
    modules: [
      {
        id: "sql-1",
        title: "Query fundamentals",
        lessons: [
          L("sql-1-1", "SQL full course overview", 20, "video", "Tables, rows, and SELECT."),
          L("sql-1-2", "WHERE, ORDER BY, LIMIT", 14, "interactive", "Filter and sort results."),
        ],
      },
      {
        id: "sql-2",
        title: "Joins and design",
        lessons: [
          L("sql-2-1", "JOIN patterns", 16, "video", "INNER, LEFT, and when to use each."),
          L("sql-2-2", "GROUP BY and aggregates", 14, "text", "COUNT, SUM, AVG with care."),
          L("sql-2-3", "Schema for enrollments", 18, "interactive", "Students, courses, progress."),
          L("sql-2-4", "SQL quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "data-structures-algorithms",
    thumbnail: youtubeThumb("8hly31x25IM", "hq"),
    title: "Data Structures & Algorithms",
    tagline: "Arrays, trees, complexity, and interview-ready problem solving.",
    description:
      "Build intuition for Big-O, core data structures, and algorithmic patterns used in interviews and production systems.",
    level: "Intermediate",
    accent: "from-indigo-600 to-blue-700",
    hours: 14,
    outcomes: [
      "Analyze time and space complexity",
      "Implement core structures",
      "Apply search and sort patterns",
      "Solve medium interview problems",
    ],
    modules: [
      {
        id: "dsa-1",
        title: "Complexity and arrays",
        lessons: [
          L("dsa-1-1", "Algorithms course intro", 18, "video", "Big-O and problem framing."),
          L("dsa-1-2", "Arrays and two pointers", 16, "interactive", "In-place techniques."),
        ],
      },
      {
        id: "dsa-2",
        title: "Structures",
        lessons: [
          L("dsa-2-1", "Stacks, queues, hash maps", 16, "video", "When each structure wins."),
          L("dsa-2-2", "Trees and recursion", 16, "text", "DFS, BFS, and call stacks."),
          L("dsa-2-3", "Solve three classic problems", 22, "interactive", "Practice under constraints."),
          L("dsa-2-4", "DSA quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "cybersecurity-basics",
    thumbnail: youtubeThumb("inWWhr5tnEA", "hq"),
    title: "Cybersecurity Basics",
    tagline: "Threats, defenses, and secure habits for builders.",
    description:
      "Understand common attacks, authentication, and defensive practices so you ship safer software.",
    level: "Beginner",
    accent: "from-red-600 to-orange-500",
    hours: 6,
    outcomes: [
      "Name common web threats",
      "Apply safer auth patterns",
      "Spot risky code paths",
      "Use basic crypto concepts correctly",
    ],
    modules: [
      {
        id: "cy-1",
        title: "Threat landscape",
        lessons: [
          L("cy-1-1", "Cybersecurity overview", 16, "video", "CIA triad and attacker goals."),
          L("cy-1-2", "OWASP top risks tour", 14, "text", "Injection, XSS, and broken access."),
        ],
      },
      {
        id: "cy-2",
        title: "Defense in practice",
        lessons: [
          L("cy-2-1", "Auth, sessions, and secrets", 14, "video", "Store credentials safely."),
          L("cy-2-2", "Secure a sample form", 16, "interactive", "Validate, escape, and rate-limit."),
          L("cy-2-3", "Cybersecurity quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "mobile-react-native",
    thumbnail: youtubeThumb("0-S5a0eXPoc", "hq"),
    title: "Mobile with React Native",
    tagline: "Cross-platform apps with React skills you already have.",
    description:
      "Build mobile UIs with React Native: components, navigation, and device APIs.",
    level: "Intermediate",
    accent: "from-sky-500 to-indigo-600",
    hours: 10,
    outcomes: [
      "Scaffold a React Native app",
      "Navigate between screens",
      "Use lists and forms on mobile",
      "Access device capabilities carefully",
    ],
    modules: [
      {
        id: "rn-1",
        title: "RN foundations",
        lessons: [
          L("rn-1-1", "React Native intro", 16, "video", "Components that map to native views."),
          L("rn-1-2", "Styles and Flexbox on mobile", 14, "interactive", "Layout that works on phones."),
        ],
      },
      {
        id: "rn-2",
        title: "Navigation and data",
        lessons: [
          L("rn-2-1", "Stack and tab navigation", 14, "text", "Move between screens."),
          L("rn-2-2", "Build a mini course app", 22, "interactive", "List, detail, and progress screen."),
          L("rn-2-3", "React Native quiz", 12, "quiz", "Pass at 60% toward your certificate."),
        ],
      },
    ],
  },
  {
    slug: "devops-docker",
    thumbnail: youtubeThumb("3c-iBn73dDE", "hq"),
    title: "DevOps & Docker",
    tagline: "Containers, images, and shipping apps reliably.",
    description:
      "Package apps with Docker, write Dockerfiles, and understand the path from laptop to production.",
    level: "Intermediate",
    accent: "from-blue-500 to-cyan-600",
    hours: 7,
    outcomes: [
      "Write a clear Dockerfile",
      "Run multi-container stacks",
      "Understand images vs containers",
      "Ship a web app more safely",
    ],
    modules: [
      {
        id: "dk-1",
        title: "Containers",
        lessons: [
          L("dk-1-1", "Docker in practice", 18, "video", "Images, containers, and registries."),
          L("dk-1-2", "Dockerfile for a Node API", 16, "interactive", "Build and run locally."),
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
