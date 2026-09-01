"use client";

import { createClient } from "@/lib/supabase/client";

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  href?: string | null;
  read_at?: string | null;
  created_at: string;
};

export async function fetchNotifications(limit = 30): Promise<Notification[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, href, read_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data || []) as Notification[];
}

export async function markNotificationRead(id: string) {
  const supabase = createClient();
  await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
}

export async function markAllNotificationsRead() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null);
}

export async function unreadCount(): Promise<number> {
  const supabase = createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);
  return count || 0;
}
