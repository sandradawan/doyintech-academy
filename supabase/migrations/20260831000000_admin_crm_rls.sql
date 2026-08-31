-- Doyintech Academy — full schema, admin CRM tables, RLS
-- Paste entire file into Supabase SQL Editor and Run

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'admin')),
  avatar_url text,
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists status text not null default 'active';

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_slug text not null,
  enrolled_at timestamptz not null default now(),
  quiz_score int,
  certificate_id text unique,
  certified_at timestamptz,
  unique (user_id, course_slug)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_slug text not null,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  unique (user_id, course_slug, lesson_id)
);

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id uuid references public.profiles (id) on delete set null,
  email text not null,
  course_slug text not null,
  course_title text,
  certificate_id text not null,
  amount_kobo int not null,
  currency text not null default 'NGN',
  status text not null default 'pending' check (status in ('success', 'failed', 'pending')),
  provider text not null default 'paystack' check (provider in ('paystack', 'manual')),
  paid_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.content_overrides (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  lesson_id text not null,
  title text,
  summary text,
  video_url text,
  body text,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (course_slug, lesson_id)
);

create table if not exists public.admin_activity (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  activity_type text not null,
  message text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'student'), '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.enroll_in_course(p_course_slug text)
returns public.enrollments language plpgsql security definer set search_path = public as $$
declare row public.enrollments;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  insert into public.enrollments (user_id, course_slug)
  values (auth.uid(), p_course_slug)
  on conflict (user_id, course_slug) do update set course_slug = excluded.course_slug
  returning * into row;
  return row;
end;
$$;

create or replace function public.complete_lesson(p_course_slug text, p_lesson_id text)
returns public.lesson_progress language plpgsql security definer set search_path = public as $$
declare row public.lesson_progress;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  insert into public.lesson_progress (user_id, course_slug, lesson_id)
  values (auth.uid(), p_course_slug, p_lesson_id)
  on conflict (user_id, course_slug, lesson_id) do update set completed_at = now()
  returning * into row;
  return row;
end;
$$;

create or replace function public.submit_course_quiz(p_course_slug text, p_score int)
returns public.enrollments language plpgsql security definer set search_path = public as $$
declare row public.enrollments; cert text;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select * into row from public.enrollments where user_id = auth.uid() and course_slug = p_course_slug;
  if not found then raise exception 'Not enrolled'; end if;
  cert := row.certificate_id;
  if p_score >= 60 and cert is null then
    cert := 'DTA-' || upper(substr(p_course_slug, 1, 3)) || '-' || upper(substr(md5(random()::text), 1, 6));
  end if;
  update public.enrollments set
    quiz_score = greatest(coalesce(quiz_score, 0), p_score),
    certificate_id = case when p_score >= 60 then coalesce(certificate_id, cert) else certificate_id end,
    certified_at = case when p_score >= 60 and certified_at is null then now() else certified_at end
  where id = row.id returning * into row;
  return row;
end;
$$;

create or replace function public.verify_certificate(p_certificate_id text)
returns table (certificate_id text, course_slug text, quiz_score int, certified_at timestamptz, student_name text)
language sql stable security definer set search_path = public as $$
  select e.certificate_id, e.course_slug, e.quiz_score, e.certified_at, p.full_name
  from public.enrollments e join public.profiles p on p.id = e.user_id
  where e.certificate_id = p_certificate_id;
$$;

create or replace function public.record_payment(
  p_reference text, p_email text, p_course_slug text, p_certificate_id text, p_amount_kobo int,
  p_status text default 'success', p_provider text default 'paystack',
  p_course_title text default null, p_currency text default 'NGN', p_user_id uuid default null
) returns public.payments language plpgsql security definer set search_path = public as $$
declare row public.payments; uid uuid;
begin
  uid := coalesce(p_user_id, auth.uid());
  insert into public.payments (reference, user_id, email, course_slug, course_title, certificate_id, amount_kobo, currency, status, provider, paid_at)
  values (p_reference, uid, lower(trim(p_email)), p_course_slug, p_course_title, p_certificate_id, p_amount_kobo, p_currency, p_status, p_provider, now())
  on conflict (reference) do update set status = excluded.status, amount_kobo = excluded.amount_kobo,
    paid_at = case when excluded.status = 'success' then now() else payments.paid_at end
  returning * into row;
  return row;
end;
$$;

create or replace function public.admin_set_student_status(p_user_id uuid, p_status text)
returns public.profiles language plpgsql security definer set search_path = public as $$
declare row public.profiles;
begin
  if not public.is_admin() then raise exception 'Admin only'; end if;
  if p_status not in ('active', 'inactive', 'suspended') then raise exception 'Invalid status'; end if;
  update public.profiles set status = p_status, updated_at = now() where id = p_user_id returning * into row;
  return row;
end;
$$;

alter table public.profiles enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.waitlist enable row level security;
alter table public.payments enable row level security;
alter table public.content_overrides enable row level security;
alter table public.admin_activity enable row level security;

do $$
declare r record;
begin
  for r in select policyname, tablename from pg_policies where schemaname = 'public'
    and tablename in ('profiles','enrollments','lesson_progress','waitlist','payments','content_overrides','admin_activity')
  loop execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename); end loop;
end $$;

create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_admin_update" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "enrollments_select_own_or_admin" on public.enrollments for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "enrollments_insert_own" on public.enrollments for insert to authenticated with check (user_id = auth.uid() or public.is_admin());
create policy "enrollments_update_own_or_admin" on public.enrollments for update to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "progress_select_own_or_admin" on public.lesson_progress for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "progress_insert_own" on public.lesson_progress for insert to authenticated with check (user_id = auth.uid() or public.is_admin());
create policy "progress_update_own" on public.lesson_progress for update to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "waitlist_insert_anon" on public.waitlist for insert to anon, authenticated with check (true);
create policy "waitlist_select_admin" on public.waitlist for select to authenticated using (public.is_admin());

create policy "payments_select_own_or_admin" on public.payments for select to authenticated
  using (user_id = auth.uid() or email = (select email from public.profiles where id = auth.uid()) or public.is_admin());
create policy "payments_insert_authenticated" on public.payments for insert to authenticated with check (true);
create policy "payments_admin_all" on public.payments for update to authenticated using (public.is_admin());

create policy "content_select_all_authenticated" on public.content_overrides for select to authenticated, anon using (true);
create policy "content_admin_write" on public.content_overrides for insert to authenticated with check (public.is_admin());
create policy "content_admin_update" on public.content_overrides for update to authenticated using (public.is_admin());
create policy "content_admin_delete" on public.content_overrides for delete to authenticated using (public.is_admin());

create policy "activity_select_admin" on public.admin_activity for select to authenticated using (public.is_admin());
create policy "activity_insert_admin" on public.admin_activity for insert to authenticated with check (public.is_admin());

grant execute on function public.is_admin() to authenticated;
grant execute on function public.enroll_in_course(text) to authenticated;
grant execute on function public.complete_lesson(text, text) to authenticated;
grant execute on function public.submit_course_quiz(text, int) to authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;
grant execute on function public.record_payment(text, text, text, text, int, text, text, text, text, uuid) to authenticated;
grant execute on function public.admin_set_student_status(uuid, text) to authenticated;

-- Promote admin after signup:
-- update public.profiles set role = 'admin' where email = 'you@example.com';
