-- Lesson content: quiz JSON + youtube id on overrides
alter table public.content_overrides
  add column if not exists youtube_id text,
  add column if not exists quiz_json jsonb not null default '[]'::jsonb;

-- Ensure quiz_attempts stores full answer payloads
alter table public.quiz_attempts
  add column if not exists answers jsonb not null default '[]'::jsonb,
  add column if not exists question_count int,
  add column if not exists correct_count int;

-- Public verify stays available to anon
grant execute on function public.verify_certificate(text) to anon, authenticated;

comment on column public.content_overrides.quiz_json is 'Array of {id,prompt,choices,correctIndex,explain?}';
comment on column public.content_overrides.youtube_id is 'YouTube video id for the lesson';
