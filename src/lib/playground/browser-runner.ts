/** Capture console output while evaluating JS in the browser. */
export function runJavaScriptInBrowser(code: string): { stdout: string; stderr: string } {
  const logs: string[] = [];
  const errors: string[] = [];

  const push = (level: "log" | "info" | "warn" | "error" | "debug", args: unknown[]) => {
    const line = args
      .map((a) => {
        if (typeof a === "string") return a;
        try {
          return JSON.stringify(a, null, 2);
        } catch {
          return String(a);
        }
      })
      .join(" ");
    if (level === "error" || level === "warn") errors.push(line);
    else logs.push(line);
  };

  const original = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  };

  console.log = (...args: unknown[]) => {
    push("log", args);
    original.log(...args);
  };
  console.info = (...args: unknown[]) => {
    push("info", args);
    original.info(...args);
  };
  console.warn = (...args: unknown[]) => {
    push("warn", args);
    original.warn(...args);
  };
  console.error = (...args: unknown[]) => {
    push("error", args);
    original.error(...args);
  };
  console.debug = (...args: unknown[]) => {
    push("debug", args);
    original.debug(...args);
  };

  try {
    // Indirect eval keeps this slightly isolated from local scope
    // eslint-disable-next-line no-eval
    const result = (0, eval)(code);
    if (result !== undefined) {
      logs.push(String(result));
    }
  } catch (e) {
    errors.push(e instanceof Error ? `${e.name}: ${e.message}` : String(e));
  } finally {
    console.log = original.log;
    console.info = original.info;
    console.warn = original.warn;
    console.error = original.error;
    console.debug = original.debug;
  }

  return {
    stdout: logs.join("\n"),
    stderr: errors.join("\n"),
  };
}

/** Load TypeScript compiler from CDN and transpile to JS. */
export async function transpileTypeScript(code: string): Promise<{ js: string; diagnostics: string }> {
  const w = window as unknown as {
    ts?: {
      transpileModule: (
        input: string,
        opts: { compilerOptions: Record<string, unknown> },
      ) => { outputText: string; diagnostics?: unknown[] };
      ScriptTarget: { ES2020: number };
      ModuleKind: { ESNext: number };
    };
  };

  if (!w.ts) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/typescript@5.4.5/lib/typescript.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load TypeScript compiler"));
      document.head.appendChild(script);
    });
  }

  if (!w.ts) throw new Error("TypeScript compiler not available");

  const out = w.ts.transpileModule(code, {
    compilerOptions: {
      target: w.ts.ScriptTarget.ES2020,
      module: w.ts.ModuleKind.ESNext,
      strict: false,
    },
  });

  return { js: out.outputText, diagnostics: "" };
}

type PyodideLike = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
};

let pyodidePromise: Promise<PyodideLike> | null = null;

export async function getPyodide(): Promise<PyodideLike> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const w = window as unknown as {
        loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideLike>;
      };
      if (!w.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Pyodide"));
          document.head.appendChild(script);
        });
      }
      if (!w.loadPyodide) throw new Error("Pyodide loader missing");
      return w.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
      });
    })();
  }
  return pyodidePromise;
}

export async function runPythonInBrowser(code: string): Promise<{ stdout: string; stderr: string }> {
  const pyodide = await getPyodide();
  const logs: string[] = [];
  const errs: string[] = [];

  pyodide.setStdout({
    batched: (s) => {
      logs.push(s);
    },
  });
  pyodide.setStderr({
    batched: (s) => {
      errs.push(s);
    },
  });

  try {
    await pyodide.runPythonAsync(code);
  } catch (e) {
    errs.push(e instanceof Error ? e.message : String(e));
  }

  return { stdout: logs.join("\n"), stderr: errs.join("\n") };
}
