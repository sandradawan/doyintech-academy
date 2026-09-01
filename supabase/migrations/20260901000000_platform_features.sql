-- Platform features: video progress, notifications, comments, quiz attempts, rate limits

create table if not exists public.video_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  video_id text not null,
  course_slug text,
  lesson_id text,
  percent int not null default 0 check (percent >= 0 and percent <= 100),
  position_sec numeric not null default 0,
  duration_sec numeric not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, video_id)
);
create index if not exists video_progress_user_idx on public.video_progress (user_id);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null default 'info',
  title text not null,
  body text not null default '',
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_created_idx on public.notifications (user_id, created_at desc);

create table if not exists public.lesson_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_slug text not null,
  lesson_id text not null,
  body text not null check (char_length(body) between 1 and 4000),
  parent_id uuid references public.lesson_comments (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists lesson_comments_lesson_idx on public.lesson_comments (course_slug, lesson_id, created_at);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_slug text not null,
  score int not null,
  passed boolean not null default false,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists quiz_attempts_user_course_idx on public.quiz_attempts (user_id, course_slug, created_at desc);

create table if not exists public.rate_limits (
  key text primary key,
  hits int not null default 0,
  window_start timestamptz not null default now()
);

drop function if exists public.verify_certificate(text);
create or replace function public.verify_certificate(p_certificate_id text)
returns table (
  certificate_id text,
  course_slug text,
  student_name text,
  email text,
  quiz_score int,
  certified_at timestamptz,
  paid boolean
)
language plpgsql stable security definer set search_path = public as $$
begin
  return query
  select
    e.certificate_id,
    e.course_slug,
    coalesce(p.full_name, 'Student')::text,
    coalesce(p.email, '')::text,
    e.quiz_score,
    e.certified_at,
    exists (
      select 1 from public.payments pay
      where pay.certificate_id = e.certificate_id and pay.status = 'success'
    ) as paid
  from public.enrollments e
  left join public.profiles p on p.id = e.user_id
  where e.certificate_id = p_certificate_id
  limit 1;
end;
$$;
grant execute on function public.verify_certificate(text) to anon, authenticated;

create or replace function public.upsert_video_progress(
  p_video_id text,
  p_percent int,
  p_position numeric default 0,
  p_duration numeric default 0,
  p_completed boolean default false,
  p_course_slug text default null,
  p_lesson_id text default null
)
returns public.video_progress
language plpgsql security definer set search_path = public as $$
declare
  v public.video_progress;
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  insert into public.video_progress as vp (
    user_id, video_id, course_slug, lesson_id, percent, position_sec, duration_sec, completed, updated_at
  ) values (
    uid, p_video_id, p_course_slug, p_lesson_id,
    greatest(0, least(100, p_percent)),
    greatest(0, p_position), greatest(0, p_duration),
    p_completed or p_percent >= 90, now()
  )
  on conflict (user_id, video_id) do update set
    percent = greatest(vp.percent, excluded.percent),
    position_sec = case when excluded.percent >= vp.percent then excluded.position_sec else vp.position_sec end,
    duration_sec = greatest(vp.duration_sec, excluded.duration_sec),
    completed = vp.completed or excluded.completed,
    course_slug = coalesce(excluded.course_slug, vp.course_slug),
    lesson_id = coalesce(excluded.lesson_id, vp.lesson_id),
    updated_at = now()
  returning * into v;
  return v;
end;
$$;
grant execute on function public.upsert_video_progress(text, int, numeric, numeric, boolean, text, text) to authenticated;

create or replace function public.notify_user(
  p_user_id uuid, p_type text, p_title text, p_body text default '', p_href text default null
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (user_id, type, title, body, href)
  values (p_user_id, coalesce(p_type, 'info'), p_title, coalesce(p_body, ''), p_href);
end;
$$;

alter table public.video_progress enable row level security;
alter table public.notifications enable row level security;
alter table public.lesson_comments enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.rate_limits enable row level security;

drop policy if exists "video_progress_own" on public.video_progress;
create policy "video_progress_own" on public.video_progress
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "notifications_own" on public.notifications;
create policy "notifications_own" on public.notifications
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "notifications_own_update" on public.notifications;
create policy "notifications_own_update" on public.notifications
  for update using (auth.uid() = user_id or public.is_admin());

drop policy if exists "comments_read" on public.lesson_comments;
create policy "comments_read" on public.lesson_comments for select using (true);
drop policy if exists "comments_insert" on public.lesson_comments;
create policy "comments_insert" on public.lesson_comments for insert with check (auth.uid() = user_id);
drop policy if exists "comments_delete_own" on public.lesson_comments;
create policy "comments_delete_own" on public.lesson_comments for delete using (auth.uid() = user_id or public.is_admin());

drop policy if exists "quiz_attempts_own" on public.quiz_attempts;
create policy "quiz_attempts_own" on public.quiz_attempts
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "rate_limits_admin" on public.rate_limits;
create policy "rate_limits_admin" on public.rate_limits
  for all using (public.is_admin()) with check (public.is_admin());
