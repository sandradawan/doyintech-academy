"use client";

import { createClient } from "@/lib/supabase/client";

export type LessonComment = {
  id: string;
  user_id: string;
  course_slug: string;
  lesson_id: string;
  body: string;
  parent_id?: string | null;
  created_at: string;
  author_name?: string;
};

export async function fetchLessonComments(courseSlug: string, lessonId: string): Promise<LessonComment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lesson_comments")
    .select("id, user_id, course_slug, lesson_id, body, parent_id, created_at")
    .eq("course_slug", courseSlug)
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: true })
    .limit(100);
  if (error || !data) return [];

  const userIds = [...new Set(data.map((c) => c.user_id))];
  const names: Record<string, string> = {};
  if (userIds.length) {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", userIds);
    for (const p of profiles || []) names[p.id] = p.full_name || "Student";
  }

  return data.map((c) => ({
    ...c,
    author_name: names[c.user_id] || "Student",
  })) as LessonComment[];
}

export async function postLessonComment(courseSlug: string, lessonId: string, body: string, parentId?: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to comment");
  const text = body.trim();
  if (!text) throw new Error("Comment cannot be empty");
  if (text.length > 4000) throw new Error("Comment too long");

  const { data, error } = await supabase
    .from("lesson_comments")
    .insert({
      user_id: user.id,
      course_slug: courseSlug,
      lesson_id: lessonId,
      body: text,
      parent_id: parentId || null,
    })
    .select("id, user_id, course_slug, lesson_id, body, parent_id, created_at")
    .single();
  if (error) throw new Error(error.message);
  return data as LessonComment;
}
