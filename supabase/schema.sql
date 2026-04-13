-- LinguaFlip — Supabase schema
-- Run this once in the Supabase SQL editor before loading seed.sql.
--
-- Design notes:
--   • The table holds only the vocabulary (no per-user data). User progress is
--     kept client-side in localStorage, so the table has no user_id column and
--     no write access is granted to the anon role.
--   • We use an explicit integer primary key (not a generated identity) so the
--     app can keep referencing word ids that are already stored in users'
--     localStorage progress from earlier versions.
--   • Row Level Security is enabled with a single read-only policy for the
--     anon role — everyone can read, nobody can write from the client.

create table if not exists public.words (
  id          integer primary key,
  english     text not null,
  indonesian  text not null,
  created_at  timestamptz not null default now()
);

alter table public.words enable row level security;

drop policy if exists "Words are readable by everyone" on public.words;

create policy "Words are readable by everyone"
  on public.words
  for select
  to anon, authenticated
  using (true);
