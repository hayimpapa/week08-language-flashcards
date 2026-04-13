# LinguaFlip

A flashcard app for learning Indonesian, built with React + Vite. The
vocabulary is stored in **Supabase** and your review progress is kept in
**localStorage** (no user accounts).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase credentials
npm run dev
```

## Build

```bash
npm run build
```

## Supabase setup

The app reads a table called `public.words` from Supabase at startup. Follow
these steps once to provision it.

### 1. Create a Supabase project

1. Sign in at [supabase.com](https://supabase.com) and create a new project.
2. Once the project is ready, go to **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. Copy `.env.example` to `.env.local` and paste those values in.

> Only the anon (public) key goes in the browser. Never expose the
> `service_role` key in client code.

### 2. Create the `words` table

Open the Supabase dashboard → **SQL Editor → New query** and paste the
contents of [`supabase/schema.sql`](supabase/schema.sql), then click **Run**.

This creates the table with:

- `id` (integer primary key) — matches the ids the app uses in localStorage,
  so existing progress stays compatible.
- `english`, `indonesian` (text) — the word pair.
- `created_at` (timestamptz, default `now()`).
- Row Level Security enabled with a single `select` policy for the `anon`
  and `authenticated` roles. The anon key cannot insert, update, or delete.

### 3. Seed the 200 starter words

Still in the SQL Editor, open a new query, paste the contents of
[`supabase/seed.sql`](supabase/seed.sql), and run it. The file uses
`on conflict (id) do nothing`, so it is safe to re-run.

Verify with:

```sql
select count(*) from public.words;   -- should return 200
```

### 4. Restart the dev server

```bash
npm run dev
```

Open the app — you should see the loading state for a moment, then the
dashboard with 200 cards.

## Architecture notes

- `src/lib/supabase.js` — single Supabase client instance built from env vars.
- `src/data/wordsApi.js` — `fetchWords()` returns the full vocabulary, ordered
  by `id`.
- `src/App.jsx` — fetches words once on mount, reconciles with any saved
  progress from localStorage, and passes both `cards` and `words` down to
  child screens.
- `src/utils/storage.js` — unchanged; still only reads/writes the `cards`
  array (progress) to `localStorage`. It never touches words.
- `src/utils/scheduler.js` — unchanged; pure functions for the spaced
  repetition logic.

If you want to add or edit words later, just update the `words` table in
Supabase — no redeploy required.
