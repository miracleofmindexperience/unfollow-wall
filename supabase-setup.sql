-- ============================================================
--  Unfollow Wall — Supabase setup
--  Run this once in your Supabase project:
--    Dashboard > SQL Editor > New query > paste > Run
-- ============================================================

-- 1. Table -----------------------------------------------------------------
create table if not exists public.submissions (
  id         uuid primary key default gen_random_uuid(),
  room       text not null default 'default',
  text       text not null,
  created_at timestamptz not null default now()
);

create index if not exists submissions_room_idx on public.submissions (room, created_at);

-- 2. Row Level Security ----------------------------------------------------
-- This is a public, anonymous, ephemeral session tool: anyone with the room
-- code may read, add, and clear cards. No personal data is collected.
alter table public.submissions enable row level security;

drop policy if exists "anyone can read"   on public.submissions;
drop policy if exists "anyone can insert" on public.submissions;
drop policy if exists "anyone can delete" on public.submissions;

create policy "anyone can read"
  on public.submissions for select
  using (true);

-- length is validated here so junk/empty rows can't be inserted
create policy "anyone can insert"
  on public.submissions for insert
  with check (char_length(trim(text)) between 1 and 80);

-- lets the host "New Session" button clear a room
create policy "anyone can delete"
  on public.submissions for delete
  using (true);

-- 3. Realtime --------------------------------------------------------------
-- Push new cards to the wall the instant they are submitted.
alter publication supabase_realtime add table public.submissions;
