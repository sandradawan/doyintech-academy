"use client";

import { useEffect, useRef } from "react";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type RealtimeTable =
  | "profiles"
  | "enrollments"
  | "payments"
  | "quiz_attempts"
  | "waitlist"
  | "content_overrides"
  | "admin_activity"
  | "lesson_progress"
  | "notifications"
  | "video_progress";

type ChangePayload = RealtimePostgresChangesPayload<Record<string, unknown>>;

/**
 * Subscribe to Postgres changes on one or more public tables.
 * Debounces rapid bursts so admin UIs don't refetch on every row of a bulk write.
 */
export function useRealtimeSync(
  tables: RealtimeTable[],
  onChange: (meta: { table: string; event: string }) => void,
  enabled = true,
) {
  const cb = useRef(onChange);
  cb.current = onChange;
  const tablesKey = tables.slice().sort().join(",");

  useEffect(() => {
    if (!enabled || tables.length === 0) return;

    let channel: RealtimeChannel | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const schedule = (table: string, event: string) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (!disposed) cb.current({ table, event });
      }, 350);
    };

    try {
      const supabase = createClient();
      const name = `rt-${tablesKey}-${Math.random().toString(36).slice(2, 8)}`;
      channel = supabase.channel(name);

      for (const table of tables) {
        channel = channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload: ChangePayload) => {
            schedule(table, payload.eventType || "*");
          },
        );
      }

      channel.subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("[realtime] channel status:", status);
        }
      });
    } catch (e) {
      console.warn("[realtime] subscribe failed", e);
    }

    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      if (channel) {
        void createClient().removeChannel(channel);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tablesKey, enabled]);
}
