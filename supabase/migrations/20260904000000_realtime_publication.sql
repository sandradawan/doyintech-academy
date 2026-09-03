-- Enable Supabase Realtime for CRM / learning tables
-- Run in SQL Editor if publication already exists (safe with exception handlers)

do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.enrollments;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.payments;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.quiz_attempts;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.waitlist;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.content_overrides;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.admin_activity;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.lesson_progress;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.video_progress;
exception when duplicate_object then null;
end $$;

comment on publication supabase_realtime is 'Doyintech Academy live sync tables';
