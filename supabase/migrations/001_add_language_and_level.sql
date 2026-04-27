-- LinguaFlip — Migration 001: add language + level support
--
-- WHAT THIS DOES
--   Generalises the `words` table so it can hold vocab for multiple languages
--   and difficulty levels. Specifically:
--     • adds a `language` column (defaults to 'indonesian' for existing rows)
--     • adds a `level`    column (defaults to 'beginner'   for existing rows)
--     • renames the old `indonesian` column to `translation`
--     • adds an index on (language, level) for fast filtering
--
-- HOW TO RUN IT (Supabase)
--   1. Open https://app.supabase.com → your project
--   2. Sidebar → "SQL Editor" → "New query"
--   3. Paste the entire contents of this file
--   4. Click "Run"
--
--   The script is idempotent — safe to re-run if you're not sure whether it
--   already applied. Your existing 200 Indonesian rows will be preserved and
--   tagged with language='indonesian', level='beginner'.
--
-- AFTER RUNNING
--   You don't need to re-run seed.sql — your existing rows stay put. If you
--   later add data for another language / level, just insert with explicit
--   language and level values.

begin;

-- 1. language column ----------------------------------------------------------
alter table public.words
  add column if not exists language text not null default 'indonesian';

-- 2. level column -------------------------------------------------------------
alter table public.words
  add column if not exists level text not null default 'beginner';

-- 3. rename indonesian → translation -----------------------------------------
do $$
begin
  if exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name   = 'words'
       and column_name  = 'indonesian'
  ) then
    alter table public.words rename column indonesian to translation;
  end if;
end $$;

-- 4. index for fast filtering -------------------------------------------------
create index if not exists words_language_level_idx
  on public.words (language, level);

commit;
