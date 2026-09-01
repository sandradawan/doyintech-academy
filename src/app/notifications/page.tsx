"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
} from "@/lib/notifications";
import { getStudent } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Notification[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getStudent();
      if (!s) {
        router.replace("/login?next=/notifications");
        return;
      }
      const list = await fetchNotifications();
      if (!cancelled) {
        setItems(list);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function markAll() {
    await markAllNotificationsRead();
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
  }

  async function openItem(n: Notification) {
    if (!n.read_at) {
      await markNotificationRead(n.id);
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)));
    }
    if (n.href) router.push(n.href);
  }

  if (!ready) {
    return <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted">Loading…</div>;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bell className="size-5 text-primary" />
          <h1 className="font-display text-2xl font-semibold">Notifications</h1>
        </div>
        <button type="button" onClick={markAll} className="text-xs font-medium text-primary hover:underline">
          Mark all read
        </button>
      </div>
      <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-surface">
        {items.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-muted">No notifications yet.</li>
        ) : (
          items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => openItem(n)}
                className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left hover:bg-surface-2 ${
                  !n.read_at ? "bg-primary/5" : ""
                }`}
              >
                <span className="text-sm font-semibold">{n.title}</span>
                {n.body ? <span className="text-xs text-muted">{n.body}</span> : null}
                <span className="text-[10px] text-subtle">{new Date(n.created_at).toLocaleString()}</span>
              </button>
            </li>
          ))
        )}
      </ul>
      <Link href="/dashboard" className="mt-6 inline-block text-sm text-primary hover:underline">
        Back to dashboard
      </Link>
    </main>
  );
}
