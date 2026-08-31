import { NextRequest, NextResponse } from "next/server";

/**
 * Remote runner for compiled languages.
 * Public emkc.org Piston is whitelist-only (as of 2026-02-15).
 *
 * Configure one of:
 *   PISTON_API_URL  – e.g. https://your-piston.example.com/api/v2/execute
 *   JUDGE0_API_URL  – e.g. https://judge0-ce.p.rapidapi.com
 *   JUDGE0_API_KEY  – RapidAPI key (required with JUDGE0_API_URL)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const language = String(body.language || "").trim();
    const version = String(body.version || "*").trim();
    const code = String(body.code || "");
    const stdin = String(body.stdin || "");

    if (!language) {
      return NextResponse.json({ error: "Language is required" }, { status: 400 });
    }
    if (!code.trim()) {
      return NextResponse.json({ error: "Code is empty" }, { status: 400 });
    }
    if (code.length > 80_000) {
      return NextResponse.json({ error: "Code is too long" }, { status: 400 });
    }

    const pistonUrl = process.env.PISTON_API_URL?.replace(/\/$/, "");
    const judge0Url = process.env.JUDGE0_API_URL?.replace(/\/$/, "");
    const judge0Key = process.env.JUDGE0_API_KEY;

    if (pistonUrl) {
      return runPiston(pistonUrl, language, version, code, stdin);
    }
    if (judge0Url && judge0Key) {
      return runJudge0(judge0Url, judge0Key, language, code, stdin);
    }

    return NextResponse.json(
      {
        error:
          "Remote languages need a code runner. HTML, JavaScript, TypeScript, and Python run in the browser with no setup. For Java/C/C++/Go/etc., set PISTON_API_URL (self-hosted Piston) or JUDGE0_API_URL + JUDGE0_API_KEY in Vercel env.",
        code: "RUNNER_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to run code" },
      { status: 500 },
    );
  }
}

async function runPiston(
  baseUrl: string,
  language: string,
  version: string,
  code: string,
  stdin: string,
) {
  const url = baseUrl.includes("/execute") ? baseUrl : `${baseUrl}/api/v2/execute`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language,
      version,
      files: [{ name: "main", content: code }],
      stdin,
      run_timeout: 5000,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: `Piston error (${res.status}): ${text.slice(0, 240)}` },
      { status: 502 },
    );
  }

  const data = await res.json();
  const run = data.run ?? {};
  const compile = data.compile ?? null;

  return NextResponse.json({
    stdout: run.stdout ?? "",
    stderr: run.stderr ?? "",
    code: run.code ?? 0,
    output: run.output ?? run.stdout ?? "",
    compileStdout: compile?.stdout ?? "",
    compileStderr: compile?.stderr ?? "",
    language: data.language,
    version: data.version,
  });
}

const JUDGE0_LANG: Record<string, number> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
  c: 50,
  "c++": 54,
  cpp: 54,
  go: 60,
  php: 68,
  ruby: 72,
  rust: 73,
  csharp: 51,
};

async function runJudge0(
  baseUrl: string,
  apiKey: string,
  language: string,
  code: string,
  stdin: string,
) {
  const language_id = JUDGE0_LANG[language.toLowerCase()];
  if (!language_id) {
    return NextResponse.json({ error: `Unsupported Judge0 language: ${language}` }, { status: 400 });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": apiKey,
    "X-RapidAPI-Host": new URL(baseUrl).host,
  };

  const create = await fetch(`${baseUrl}/submissions?base64_encoded=false&wait=true`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      language_id,
      source_code: code,
      stdin,
    }),
  });

  if (!create.ok) {
    const text = await create.text();
    return NextResponse.json(
      { error: `Judge0 error (${create.status}): ${text.slice(0, 240)}` },
      { status: 502 },
    );
  }

  const data = await create.json();
  return NextResponse.json({
    stdout: data.stdout ?? "",
    stderr: data.stderr ?? data.compile_output ?? "",
    code: data.status?.id ?? 0,
    output: data.stdout ?? "",
    compileStdout: "",
    compileStderr: data.compile_output ?? "",
    language,
    version: String(data.language_id ?? ""),
  });
}
