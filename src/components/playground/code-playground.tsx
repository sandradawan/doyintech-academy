"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OnMount } from "@monaco-editor/react";
import { Loader2, Play, RotateCcw, Terminal, WrapText } from "lucide-react";
import {
  PLAYGROUND_LANGUAGES,
  getPlaygroundLanguage,
} from "@/lib/playground/languages";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center bg-[#0b0e14] text-sm text-slate-400">
      Loading editor…
    </div>
  ),
});

const STORAGE_KEY = "doyintech-playground-v1";

type SavedState = {
  languageId: string;
  codeByLang: Record<string, string>;
};

function loadSaved(): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedState) : null;
  } catch {
    return null;
  }
}

export function CodePlayground() {
  const saved = useMemo(() => loadSaved(), []);
  const [languageId, setLanguageId] = useState(saved?.languageId || "html");
  const [codeByLang, setCodeByLang] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const lang of PLAYGROUND_LANGUAGES) {
      map[lang.id] = saved?.codeByLang?.[lang.id] ?? lang.defaultCode;
    }
    return map;
  });
  const [stdin, setStdin] = useState("");
  const [running, setRunning] = useState(false);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [error, setError] = useState("");
  const [htmlPreview, setHtmlPreview] = useState("");
  const [wordWrap, setWordWrap] = useState<"on" | "off">("on");
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef<any>(null);

  const lang = getPlaygroundLanguage(languageId);
  const code = codeByLang[languageId] ?? lang.defaultCode;

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ languageId, codeByLang } satisfies SavedState),
    );
  }, [languageId, codeByLang]);

  const setCode = (value: string) => {
    setCodeByLang((prev) => ({ ...prev, [languageId]: value }));
  };

  const resetCode = () => {
    setCodeByLang((prev) => ({ ...prev, [languageId]: lang.defaultCode }));
    setStdout("");
    setStderr("");
    setError("");
    setHtmlPreview("");
  };

  const runBrowserHtml = useCallback((source: string) => {
    setHtmlPreview(source);
    setStdout("Preview updated in the Result panel.");
    setStderr("");
    setError("");
  }, []);

  const run = useCallback(async () => {
    setRunning(true);
    setError("");
    setStdout("");
    setStderr("");

    try {
      if (lang.runtime === "browser") {
        runBrowserHtml(code);
        return;
      }

      setHtmlPreview("");
      const res = await fetch("/api/playground/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang.pistonLanguage,
          version: lang.pistonVersion || "*",
          code,
          stdin,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Run failed");
        return;
      }

      const compileErr = [data.compileStderr, data.compileStdout].filter(Boolean).join("\n");
      const out = data.stdout || data.output || "";
      const err = [data.stderr, compileErr].filter(Boolean).join("\n");
      setStdout(out);
      setStderr(err);
      if (!out && !err) setStdout("(no output)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Run failed");
    } finally {
      setRunning(false);
    }
  }, [code, lang, runBrowserHtml, stdin]);

  const runRef = useRef(run);
  runRef.current = run;

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme("doyintech-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0b0e14",
        "editor.lineHighlightBackground": "#12161f",
        "editorLineNumber.foreground": "#475569",
        "editorCursor.foreground": "#3b82f6",
        "editor.selectionBackground": "#1d4ed866",
      },
    });
    monaco.editor.setTheme("doyintech-dark");

    editor.addAction({
      id: "doyintech-run",
      label: "Run code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        void runRef.current();
      },
    });

    editor.addAction({
      id: "doyintech-format",
      label: "Format document",
      keybindings: [
        monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI,
      ],
      run: async (ed) => {
        await ed.getAction("editor.action.formatDocument")?.run();
      },
    });

    editor.focus();
  };

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          Language
          <select
            value={languageId}
            onChange={(e) => {
              setLanguageId(e.target.value);
              setStdout("");
              setStderr("");
              setError("");
              setHtmlPreview("");
            }}
            className="h-10 rounded-md border border-border bg-bg px-3 text-sm"
          >
            {PLAYGROUND_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-muted">
          Size
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="h-10 rounded-md border border-border bg-bg px-2 text-sm"
          >
            {[12, 13, 14, 15, 16, 18].map((n) => (
              <option key={n} value={n}>
                {n}px
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => setWordWrap((w) => (w === "on" ? "off" : "on"))}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium hover:bg-surface-2"
          title="Toggle word wrap"
        >
          <WrapText className="size-4" />
          Wrap {wordWrap === "on" ? "on" : "off"}
        </button>

        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetCode}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium hover:bg-surface-2"
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => void run()}
            disabled={running}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg hover:bg-primary/90 disabled:opacity-60"
          >
            {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            Run
          </button>
        </div>
      </div>

      <p className="text-xs text-muted">
        Monaco editor · <kbd className="rounded border border-border px-1">Ctrl</kbd>/
        <kbd className="rounded border border-border px-1">⌘</kbd>+
        <kbd className="rounded border border-border px-1">Enter</kbd> to run · Find, multi-cursor,
        brackets, and syntax highlighting enabled
      </p>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-2">
        <div className="flex min-h-[24rem] flex-col overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Code</p>
            <p className="text-[11px] text-subtle">{lang.label}</p>
          </div>
          <div className="min-h-0 flex-1" style={{ minHeight: 360 }}>
            <Monaco
              height="100%"
              language={lang.monaco}
              theme="doyintech-dark"
              value={code}
              onChange={(value) => setCode(value ?? "")}
              onMount={handleMount}
              options={{
                fontSize,
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                fontLigatures: true,
                minimap: { enabled: true, scale: 0.8, showSlider: "mouseover" },
                wordWrap,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                detectIndentation: true,
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                renderLineHighlight: "line",
                lineNumbers: "on",
                glyphMargin: false,
                folding: true,
                bracketPairColorization: { enabled: true },
                matchBrackets: "always",
                autoClosingBrackets: "languageDefined",
                autoClosingQuotes: "languageDefined",
                autoIndent: "full",
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                snippetSuggestions: "inline",
                padding: { top: 12, bottom: 12 },
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
              }}
            />
          </div>
          {lang.runtime === "piston" ? (
            <div className="border-t border-border p-3">
              <label className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                Standard input (optional)
              </label>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                rows={2}
                placeholder="Values read by input() / Scanner / cin…"
                className="mt-1 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ) : null}
        </div>

        <div className="flex min-h-[24rem] flex-col overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Terminal className="size-3.5 text-primary" />
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">
              {lang.runtime === "browser" ? "Result (preview)" : "Output"}
            </p>
          </div>

          {lang.runtime === "browser" && htmlPreview ? (
            <iframe
              title="Playground preview"
              sandbox="allow-scripts"
              srcDoc={htmlPreview}
              className="min-h-0 flex-1 w-full bg-white"
            />
          ) : (
            <div className="min-h-0 flex-1 space-y-3 overflow-auto bg-[#0b0e14] p-4 font-mono text-[13px] leading-relaxed">
              {error ? <pre className="whitespace-pre-wrap text-red-400">{error}</pre> : null}
              {stdout ? (
                <div>
                  <p className="mb-1 text-[10px] font-semibold tracking-wider text-emerald-400/80 uppercase">
                    stdout
                  </p>
                  <pre className="whitespace-pre-wrap text-slate-100">{stdout}</pre>
                </div>
              ) : null}
              {stderr ? (
                <div>
                  <p className="mb-1 text-[10px] font-semibold tracking-wider text-orange/90 uppercase">
                    stderr
                  </p>
                  <pre className="whitespace-pre-wrap text-orange-200/90">{stderr}</pre>
                </div>
              ) : null}
              {!error && !stdout && !stderr ? (
                <p className="text-slate-500">Press Run (or Ctrl/⌘+Enter) to see output here.</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
