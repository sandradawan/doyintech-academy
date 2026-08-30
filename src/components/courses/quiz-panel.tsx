"use client";

import { useMemo, useState } from "react";
import { getQuiz } from "@/lib/admin";
import { completeQuiz, getEnrollment } from "@/lib/auth";

export function QuizPanel({ courseSlug }: { courseSlug: string }) {
  const questions = useMemo(() => getQuiz(courseSlug), [courseSlug]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; certificateId?: string } | null>(null);

  function submit() {
    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) correct += 1;
    }
    const score = Math.round((correct / questions.length) * 100);
    const enrollment = completeQuiz(courseSlug, score);
    setResult({ score, certificateId: enrollment?.certificateId });
  }

  const existing = getEnrollment(courseSlug);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="font-display text-lg font-medium">End-of-course quiz</h3>
      <p className="mt-1 text-sm text-muted">Pass at 70% to earn your certificate.</p>
      {existing?.quizScore != null ? (
        <p className="mt-4 text-sm text-cyan">
          Best score on this device: {existing.quizScore}%
          {existing.certificateId ? ` · Certificate ${existing.certificateId}` : ""}
        </p>
      ) : null}
      <ol className="mt-6 space-y-6">
        {questions.map((q, i) => (
          <li key={q.id}>
            <p className="text-sm font-medium text-fg">{i + 1}. {q.prompt}</p>
            <div className="mt-2 space-y-2">
              {q.choices.map((choice, idx) => (
                <label key={choice} className="flex cursor-pointer items-start gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted hover:bg-surface-2">
                  <input type="radio" name={q.id} className="mt-0.5" checked={answers[q.id] === idx} onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))} />
                  {choice}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button type="button" onClick={submit} disabled={Object.keys(answers).length < questions.length} className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-fg hover:bg-primary/90 disabled:opacity-50">
        Submit quiz
      </button>
      {result ? (
        <p className={`mt-4 text-sm ${result.score >= 70 ? "text-cyan" : "text-muted"}`}>
          Score: {result.score}%
          {result.score >= 70
            ? result.certificateId
              ? ` — Certificate issued: ${result.certificateId}`
              : " — You passed."
            : " — Score 70% or higher to certify."}
        </p>
      ) : null}
    </div>
  );
}
