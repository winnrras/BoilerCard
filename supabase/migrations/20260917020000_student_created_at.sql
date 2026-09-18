-- Needed to order/tag students on the homepage's featured strip and the
-- /featured wall page (most recently joined first).
alter table public.student
  add column created_at timestamptz not null default now();
