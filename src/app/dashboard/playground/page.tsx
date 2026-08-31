"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StudentShell } from "@/components/layout/app-sidebar";
import { CodePlayground } from "@/components/playground/code-playground";
import { getStudent, signOut, type Student } from "@/lib/auth";

export default function PlaygroundPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getStudent();
      if (cancelled) return;
      if (!s) {
        router.replace("/login?next=/dashboard/playground");
        setReady(true);
        return;
      }
      setStudent(s);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted">Loading…</div>
    );
  }

  return (
    <StudentShell
      student={student}
      onSignOut={handleSignOut}
      title="Practice playground"
      subtitle="Write code · run · see output"
      actions={
        <Link href="/dashboard" className="text-xs font-medium text-primary hover:underline">
          Back to learning
        </Link>
      }
    >
      <CodePlayground />
    </StudentShell>
  );
}
