export type VideoProgressRecord = {
  videoId: string;
  percent: number;
  position: number;
  duration: number;
  completed: boolean;
  updatedAt: string;
};

const KEY = "doyintech-academy-video-progress";

function readAll(): Record<string, VideoProgressRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, VideoProgressRecord>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, VideoProgressRecord>) {
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function getVideoProgress(videoId: string): VideoProgressRecord | null {
  return readAll()[videoId] ?? null;
}

export function getAllVideoProgress(): VideoProgressRecord[] {
  return Object.values(readAll()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveVideoProgress(
  videoId: string,
  patch: Partial<Pick<VideoProgressRecord, "percent" | "position" | "duration" | "completed">>,
  meta?: { courseSlug?: string; lessonId?: string },
): VideoProgressRecord {
  const all = readAll();
  const prev = all[videoId];
  let percent = Math.min(100, Math.max(0, patch.percent ?? prev?.percent ?? 0));
  const completed = Boolean(patch.completed ?? prev?.completed ?? percent >= 90);
  if (completed) percent = Math.max(percent, 90);
  const next: VideoProgressRecord = {
    videoId,
    percent,
    position: patch.position ?? prev?.position ?? 0,
    duration: patch.duration ?? prev?.duration ?? 0,
    completed,
    updatedAt: new Date().toISOString(),
  };
  if (prev && next.percent < prev.percent && !patch.completed) {
    next.percent = prev.percent;
    next.completed = prev.completed || next.completed;
  }
  all[videoId] = next;
  writeAll(all);

  if (typeof window !== "undefined") {
    void syncVideoProgressToServer(next, meta).catch(() => {});
  }
  return next;
}

async function syncVideoProgressToServer(
  rec: VideoProgressRecord,
  meta?: { courseSlug?: string; lessonId?: string },
) {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.rpc("upsert_video_progress", {
      p_video_id: rec.videoId,
      p_percent: Math.round(rec.percent),
      p_position: rec.position,
      p_duration: rec.duration,
      p_completed: rec.completed,
      p_course_slug: meta?.courseSlug ?? null,
      p_lesson_id: meta?.lessonId ?? null,
    });
  } catch {
    /* offline / RPC not migrated yet */
  }
}

export function markVideoComplete(videoId: string) {
  return saveVideoProgress(videoId, { percent: 100, completed: true });
}

/**
 * Pull server-side video progress into localStorage after login.
 * Server wins when its percent is higher or completed is true.
 */
export async function hydrateVideoProgressFromServer(): Promise<number> {
  if (typeof window === "undefined") return 0;
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient() as any;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return 0;
    const { data, error } = await supabase
      .from("video_progress")
      .select("video_id, percent, position, duration, completed, updated_at")
      .eq("user_id", user.id);
    if (error || !data?.length) return 0;
    const all = readAll();
    let merged = 0;
    for (const row of data as any[]) {
      const videoId = row.video_id as string;
      if (!videoId) continue;
      const prev = all[videoId];
      const serverPercent = Math.min(100, Math.max(0, Number(row.percent) || 0));
      const serverCompleted = Boolean(row.completed) || serverPercent >= 90;
      if (
        !prev ||
        serverPercent > (prev.percent ?? 0) ||
        (serverCompleted && !prev.completed)
      ) {
        all[videoId] = {
          videoId,
          percent: Math.max(serverPercent, prev?.percent ?? 0),
          position: Number(row.position) || prev?.position || 0,
          duration: Number(row.duration) || prev?.duration || 0,
          completed: serverCompleted || Boolean(prev?.completed),
          updatedAt: row.updated_at || new Date().toISOString(),
        };
        merged += 1;
      }
    }
    if (merged) writeAll(all);
    return merged;
  } catch {
    return 0;
  }
}

export function youtubeThumb(youtubeId: string, quality: "hq" | "mq" | "max" = "hq") {
  const q = quality === "max" ? "maxresdefault" : quality === "mq" ? "mqdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${youtubeId}/${q}.jpg`;
}
