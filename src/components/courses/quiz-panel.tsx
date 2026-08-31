"use client";

import { useEffect, useState } from "react";
import { completeQuiz, getEnrollment, type Enrollment } from "@/lib/auth";
import { CERT_PASS_SCORE, isCertPassingScore } from "@/lib/certificates";
import { CertificateClaim } from "@/components/courses/certificate-claim";

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
};

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which language describes the structure of a web page?",
    choices: ["CSS", "HTML", "JavaScript", "SQL"],
    correctIndex: 1,
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

export function QuizPanel({
  courseSlug,
  courseTitle,
  studentName,
  studentId,
  title = "Module / course assessment",
  questions = DEFAULT_QUESTIONS,
}: {
  courseSlug: string;
  courseTitle: string;
  studentName: string;
  studentId?: string;
  title?: string;
  questions?: QuizQuestion[];
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; certificateId?: string } | null>(null);
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
      for (const q of questions) {
        if (answers[q.id] === q.correctIndex) correct += 1;
      }
      const score = Math.round((correct / Math.max(questions.length, 1)) * 100);
      const enrollment = await completeQuiz(courseSlug, score);
      setResult({ score, certificateId: enrollment?.certificateId });
      setExisting(enrollment);
    } finally {
      setSubmitting(false);
    }
  }

  const bestScore = existing?.quizScore ?? result?.score;
  const certId = existing?.certificateId ?? result?.certificateId;
  const passed = isCertPassingScore(bestScore);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted">
          Text-based assessment. Pass at <strong className="text-fg">{CERT_PASS_SCORE}%</strong> to
          unlock your certificate. Watching videos alone does not certify.
        </p>
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
                    key={choice}
                    className="flex cursor-pointer items-start gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted hover:bg-surface-2"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      className="mt-0.5"
                      checked={answers[q.id] === idx}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
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
          disabled={submitting || Object.keys(answers).length < questions.length}
          className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit assessment"}
        </button>
        {result ? (
          <p className={`mt-4 text-sm ${passed ? "text-success" : "text-muted"}`}>
            Score: {result.score}%
            {isCertPassingScore(result.score)
              ? " — Certificate unlocked. Payment required to download."
              : ` — Score ${CERT_PASS_SCORE}% or higher to unlock the certificate.`}
          </p>
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
