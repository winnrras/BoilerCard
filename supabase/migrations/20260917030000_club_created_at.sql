-- Needed to order the homepage's featured clubs strip (most recently
-- created first), mirroring student.created_at.
alter table public.club
  add column created_at timestamptz not null default now();
