-- Link out to the club's official BoilerLink page — the actual roster/
-- membership administration tool this app deliberately doesn't rebuild.
alter table public.club
  add column boilerlink_url text;
