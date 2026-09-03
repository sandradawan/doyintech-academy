"use client";

import { useEffect, useMemo, useState } from "react";
import { completeQuiz, getEnrollment, type Enrollment } from "@/lib/auth";
import { CERT_PASS_SCORE, isCertPassingScore } from "@/lib/certificates";
import { CertificateClaim } from "@/components/courses/certificate-claim";
import { getQuizForCourse } from "@/lib/courses/quiz-banks";

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explain?: string;
};

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which language describes the structure of a web page?",
    choices: ["CSS", "HTML", "JavaScript", "SQL"],
    correctIndex: 1,
    explain: "HTML defines structure and meaning; CSS styles; JS adds behavior.",
  },
  {
    id: "q2",
    prompt: "What does CSS primarily control?",
    choices: ["Server routes", "Presentation and layout", "Database schema", "DNS records"],
    correctIndex: 1,
  },
  {
    id: "q3",
    prompt: "Which is the best description of a component in React?",
    choices: [
      "A CSS file only",
      "A reusable piece of UI driven by props and state",
      "A SQL table",
      "A Git branch",
    ],
    correctIndex: 1,
  },
  {
    id: "q4",
    prompt: "What does HTTP status 404 mean?",
    choices: ["Success", "Redirect", "Not found", "Server error"],
    correctIndex: 2,
  },
  {
    id: "q5",
    prompt: "Why write semantic HTML?",
    choices: [
      "It makes the file smaller only",
      "Accessibility, SEO, and clearer structure",
      "It replaces JavaScript",
      "Browsers ignore it",
    ],
    correctIndex: 1,
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizPanel({
  courseSlug,
  courseTitle,
  studentName,
  studentId,
  title = "Course assessment",
  questions: questionsProp,
  shuffleQuestions = true,
}: {
  courseSlug: string;
  courseTitle: string;
  studentName: string;
  studentId?: string;
  title?: string;
  questions?: QuizQuestion[];
  shuffleQuestions?: boolean;
}) {
  const bank = questionsProp ?? getQuizForCourse(courseSlug) ?? DEFAULT_QUESTIONS;
  const questions = useMemo(
    () => (shuffleQuestions ? shuffle(bank) : bank),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [courseSlug, questionsProp],
  );

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    score: number;
    certificateId?: string;
    correct: number;
  } | null>(null);
  const [existing, setExisting] = useState<Enrollment | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getEnrollment(courseSlug)
      .then((e) => {
        if (!cancelled) setExisting(e);
      })
      .catch(() => {
        if (!cancelled) setExisting(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

  async function submit() {
    setSubmitting(true);
    try {
      let correct = 0;
      const answerPayload = questions.map((q) => {
        const selected = answers[q.id];
        const ok = selected === q.correctIndex;
        if (ok) correct += 1;
        return {
          questionId: q.id,
          selectedIndex: selected ?? null,
          correctIndex: q.correctIndex,
          correct: ok,
        };
      });
      const score = Math.round((correct / Math.max(questions.length, 1)) * 100);
      const enrollment = await completeQuiz(courseSlug, score);
      setResult({ score, certificateId: enrollment?.certificateId, correct });
      setExisting(enrollment);
      void recordQuizAttempt(
        courseSlug,
        score,
        isCertPassingScore(score),
        answerPayload,
        questions.length,
        correct,
      );
    } finally {
      setSubmitting(false);
    }
  }

  const bestScore = existing?.quizScore ?? result?.score;
  const certId = existing?.certificateId ?? result?.certificateId;
  const passed = isCertPassingScore(bestScore);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted">
              {questions.length} questions · Pass at{" "}
              <strong className="text-fg">{CERT_PASS_SCORE}%</strong> to unlock your certificate.
              Watching videos alone does not certify.
            </p>
          </div>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
        {typeof bestScore === "number" ? (
          <p className={`mt-3 text-sm ${passed ? "text-success" : "text-orange"}`}>
            Best score: {bestScore}%
            {certId ? ` · Certificate ${certId}` : ""}
          </p>
        ) : null}

        <ol className="mt-6 space-y-6">
          {questions.map((q, i) => (
            <li key={q.id}>
              <p className="text-sm font-medium text-fg">
                {i + 1}. {q.prompt}
              </p>
              <div className="mt-2 space-y-2">
                {q.choices.map((choice, idx) => (
                  <label
                    key={`${q.id}-${idx}`}
                    className="flex cursor-pointer items-start gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted hover:bg-surface-2"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      className="mt-0.5"
                      checked={answers[q.id] === idx}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                      disabled={Boolean(result)}
                    />
                    {choice}
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={submit}
          disabled={submitting || answeredCount < questions.length || Boolean(result)}
          className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : result ? "Submitted" : "Submit assessment"}
        </button>
        {result ? (
          <p className={`mt-4 text-sm ${passed ? "text-success" : "text-muted"}`}>
            Score: {result.score}% ({result.correct}/{questions.length} correct)
            {isCertPassingScore(result.score)
              ? " — Certificate unlocked. Payment required to download."
              : ` — Score ${CERT_PASS_SCORE}% or higher to unlock the certificate. You can retry after reviewing.`}
          </p>
        ) : null}
        {result ? (
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Answer review</p>
            <ul className="space-y-2">
              {questions.map((q, i) => {
                const picked = answers[q.id];
                const ok = picked === q.correctIndex;
                return (
                  <li
                    key={q.id}
                    className={`rounded-lg border px-3 py-2 text-xs ${
                      ok ? "border-success/30 bg-success/5" : "border-red-500/20 bg-red-500/5"
                    }`}
                  >
                    <p className="font-medium text-fg">
                      {i + 1}. {q.prompt}
                    </p>
                    <p className="mt-1 text-muted">
                      Your answer: {typeof picked === "number" ? q.choices[picked] : "—"}
                      {!ok ? (
                        <span className="block text-success">Correct: {q.choices[q.correctIndex]}</span>
                      ) : null}
                      {q.explain ? <span className="mt-1 block text-subtle">{q.explain}</span> : null}
                    </p>
                  </li>
                );
              })}
            </ul>
            {!isCertPassingScore(result.score) ? (
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                }}
                className="mt-2 text-sm font-semibold text-primary hover:underline"
              >
                Retry assessment
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {passed ? (
        <CertificateClaim
          studentName={studentName}
          studentId={studentId}
          courseTitle={courseTitle}
          courseSlug={courseSlug}
          quizScore={bestScore}
          certificateId={certId}
          certifiedAt={existing?.certifiedAt}
        />
      ) : null}
    </div>
  );
}

async function recordQuizAttempt(
  courseSlug: string,
  score: number,
  passed: boolean,
  answers: unknown[],
  questionCount: number,
  correctCount: number,
) {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      course_slug: courseSlug,
      score,
      passed,
      answers,
      question_count: questionCount,
      correct_count: correctCount,
    });
  } catch {
    /* table may not exist yet */
  }
}
