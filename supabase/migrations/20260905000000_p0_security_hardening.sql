-- P0 security hardening (pen-test findings)
-- Run this on existing Supabase projects after prior migrations.
-- Safe to re-run (uses CREATE OR REPLACE / DROP IF EXISTS).

-- ---------------------------------------------------------------------------
-- 1) Signup: never trust client metadata for role (blocks admin self-promote)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'student'), '@', 1)),
    'student'  -- NEVER read role from raw_user_meta_data
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
    -- role intentionally not updated on conflict
    updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2) Block non-admin role / status escalation on profiles UPDATE
-- ---------------------------------------------------------------------------
create or replace function public.prevent_profile_privilege_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' then
    if new.role is distinct from old.role then
      if not exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      ) then
        raise exception 'Cannot change role';
      end if;
    end if;
    if new.status is distinct from old.status then
      if not exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      ) then
        raise exception 'Cannot change status';
      end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_profile_privilege_escalation on public.profiles;
create trigger trg_prevent_profile_privilege_escalation
  before update on public.profiles
  for each row execute function public.prevent_profile_privilege_escalation();

-- Own profile may update name/avatar only (role/status enforced by trigger above)
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- 3) Enrollments: students must not UPDATE (no forged quiz_score / certificate_id)
-- ---------------------------------------------------------------------------
drop policy if exists "enrollments_update_own_or_admin" on public.enrollments;
drop policy if exists "enrollments_update_admin_only" on public.enrollments;
create policy "enrollments_update_admin_only" on public.enrollments
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4) Payments: no direct INSERT by authenticated clients
-- ---------------------------------------------------------------------------
drop policy if exists "payments_insert_authenticated" on public.payments;

-- record_payment: only service_role (auth.uid() null) or admin may invoke
create or replace function public.record_payment(
  p_reference text, p_email text, p_course_slug text, p_certificate_id text, p_amount_kobo int,
  p_status text default 'success', p_provider text default 'paystack',
  p_course_title text default null, p_currency text default 'NGN', p_user_id uuid default null
) returns public.payments language plpgsql security definer set search_path = public as $$
declare row public.payments; uid uuid;
begin
  -- Block ordinary students; allow service_role (uid null) and admins
  if auth.uid() is not null and not public.is_admin() then
    raise exception 'Forbidden';
  end if;
  uid := coalesce(p_user_id, auth.uid());
  insert into public.payments (reference, user_id, email, course_slug, course_title, certificate_id, amount_kobo, currency, status, provider, paid_at)
  values (p_reference, uid, lower(trim(p_email)), p_course_slug, p_course_title, p_certificate_id, p_amount_kobo, p_currency, p_status, p_provider, now())
  on conflict (reference) do update set status = excluded.status, amount_kobo = excluded.amount_kobo,
    paid_at = case when excluded.status = 'success' then now() else payments.paid_at end
  returning * into row;
  return row;
end;
$$;

grant execute on function public.record_payment(text, text, text, text, int, text, text, text, text, uuid) to authenticated;
revoke execute on function public.record_payment(text, text, text, text, int, text, text, text, text, uuid) from anon;

-- ---------------------------------------------------------------------------
-- 5) complete_lesson requires enrollment
-- ---------------------------------------------------------------------------
create or replace function public.complete_lesson(p_course_slug text, p_lesson_id text)
returns public.lesson_progress language plpgsql security definer set search_path = public as $$
declare row public.lesson_progress;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if not exists (
    select 1 from public.enrollments e
    where e.user_id = auth.uid() and e.course_slug = p_course_slug
  ) then
    raise exception 'Not enrolled in this course';
  end if;
  insert into public.lesson_progress (user_id, course_slug, lesson_id)
  values (auth.uid(), p_course_slug, p_lesson_id)
  on conflict (user_id, course_slug, lesson_id) do update set completed_at = now()
  returning * into row;
  return row;
end;
$$;

grant execute on function public.complete_lesson(text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 6) submit_course_quiz: clamp score; mark quiz lessons complete on pass
--    (score is still client-supplied until P1 server-side answer checking)
-- ---------------------------------------------------------------------------
create or replace function public.submit_course_quiz(p_course_slug text, p_score int)
returns public.enrollments language plpgsql security definer set search_path = public as $$
declare
  row public.enrollments;
  cert text;
  score int;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  score := greatest(0, least(100, coalesce(p_score, 0)));

  select * into row from public.enrollments
  where user_id = auth.uid() and course_slug = p_course_slug;
  if not found then raise exception 'Not enrolled'; end if;

  cert := row.certificate_id;
  if score >= 60 and cert is null then
    cert := 'DTA-' || upper(substr(p_course_slug, 1, 3)) || '-' || upper(substr(md5(random()::text), 1, 6));
  end if;

  update public.enrollments set
    quiz_score = greatest(coalesce(quiz_score, 0), score),
    certificate_id = case when score >= 60 then coalesce(certificate_id, cert) else certificate_id end,
    certified_at = case when score >= 60 and certified_at is null then now() else certified_at end
  where id = row.id
  returning * into row;

  -- Mark common quiz lesson ids complete so outline progress is consistent
  if score >= 60 then
    insert into public.lesson_progress (user_id, course_slug, lesson_id)
    select auth.uid(), p_course_slug, lid
    from unnest(array[
      p_course_slug || '-quiz',
      'wf-4-3',
      'js-3-3',
      're-3-3',
      'ts-3-3',
      'be-3-3',
      'git-3-3',
      'py-3-3',
      'hc-3-3',
      'nx-3-3',
      'sql-3-3'
    ]) as lid
    on conflict (user_id, course_slug, lesson_id) do update set completed_at = now();
  end if;

  return row;
end;
$$;

grant execute on function public.submit_course_quiz(text, int) to authenticated;

-- ---------------------------------------------------------------------------
-- 7) notify_user: only self or admin (reduces in-app phishing spam)
-- ---------------------------------------------------------------------------
create or replace function public.notify_user(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text default '',
  p_href text default null
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if p_user_id is distinct from auth.uid() and not public.is_admin() then
    raise exception 'Cannot notify other users';
  end if;
  insert into public.notifications (user_id, type, title, body, href)
  values (p_user_id, coalesce(p_type, 'info'), p_title, coalesce(p_body, ''), p_href);
end;
$$;

-- Promote admin only via SQL console (never from client metadata):
-- update public.profiles set role = 'admin' where email = 'you@example.com';
