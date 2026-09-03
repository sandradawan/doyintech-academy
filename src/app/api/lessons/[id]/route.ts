import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readFile } from "fs/promises";
import path from "path";

type OverrideRow = {
  title?: string | null;
  summary?: string | null;
  video_url?: string | null;
  youtube_id?: string | null;
  body?: string | null;
  quiz_json?: unknown;
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const lessonId = decodeURIComponent(id || "").trim();
  if (!lessonId) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  let base: Record<string, unknown> = {};
  try {
    const file = path.join(process.cwd(), "public", "content", "lessons", `${lessonId}.json`);
    const raw = await readFile(file, "utf8");
    base = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    base = { id: lessonId };
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("content_overrides")
      .select("title, summary, video_url, youtube_id, body, quiz_json")
      .eq("lesson_id", lessonId)
      .maybeSingle();

    const o = data as OverrideRow | null;
    if (o) {
      if (o.title) base.title = o.title;
      if (o.summary) base.summary = o.summary;
      if (o.body) base.body = o.body;
      if (o.youtube_id) {
        base.youtubeId = o.youtube_id;
        base.thumbnail = `https://i.ytimg.com/vi/${o.youtube_id}/hqdefault.jpg`;
      }
      if (o.video_url) base.videoUrl = o.video_url;
      if (o.quiz_json && Array.isArray(o.quiz_json) && o.quiz_json.length > 0) {
        base.quiz = o.quiz_json;
      }
    }
  } catch {
    /* overrides optional */
  }

  return NextResponse.json(base, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
  });
}
