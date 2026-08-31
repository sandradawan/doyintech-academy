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
  return next;
}

export function markVideoComplete(videoId: string) {
  return saveVideoProgress(videoId, { percent: 100, completed: true });
}

export function youtubeThumb(youtubeId: string, quality: "hq" | "mq" | "max" = "hq") {
  const q = quality === "max" ? "maxresdefault" : quality === "mq" ? "mqdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${youtubeId}/${q}.jpg`;
}
