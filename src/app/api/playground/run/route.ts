import { NextRequest, NextResponse } from "next/server";

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

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

    const res = await fetch(PISTON_URL, {
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
        { error: `Runner error (${res.status}): ${text.slice(0, 200)}` },
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
      signal: run.signal ?? null,
      output: run.output ?? run.stdout ?? "",
      compileStdout: compile?.stdout ?? "",
      compileStderr: compile?.stderr ?? "",
      language: data.language,
      version: data.version,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to run code" },
      { status: 500 },
    );
  }
}
