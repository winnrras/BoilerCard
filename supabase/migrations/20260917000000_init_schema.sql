-- BoilerCard initial schema: student, club, club_membership
-- See CLAUDE.md for the full spec this schema implements.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- student
-- One row per authenticated Purdue account. id is shared with auth.users so
-- the row is created/deleted in lockstep with the Supabase Auth user.
-- ---------------------------------------------------------------------------
create table public.student (
  id uuid primary key references auth.users (id) on delete cascade,
  purdue_email text not null unique,
  slug text not null unique,
  name text not null,
  avatar_url text,
  major text,
  grad_year int,
  bio text,
  linkedin_url text,
  github_url text,
  resume_url text,
  discord text,

  constraint student_purdue_email_domain check (purdue_email like '%@purdue.edu'),
  constraint student_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint student_bio_length check (char_length(bio) <= 140)
);

comment on table public.student is 'Public profile for a Purdue student, keyed to their Supabase Auth account.';

-- ---------------------------------------------------------------------------
-- club
-- ---------------------------------------------------------------------------
create table public.club (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  discord_url text,
  created_by uuid not null references public.student (id) on delete cascade,

  constraint club_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

comment on table public.club is 'A student club with an opt-in public directory page.';

-- ---------------------------------------------------------------------------
-- club_membership
-- Opt-in join table: a student must explicitly set visible = true to appear
-- on a club's public page. This is NOT a roster/approval system.
-- ---------------------------------------------------------------------------
create table public.club_membership (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student (id) on delete cascade,
  club_id uuid not null references public.club (id) on delete cascade,
  visible boolean not null default false,
  role text,

  constraint club_membership_unique unique (student_id, club_id)
);

comment on table public.club_membership is 'Opt-in visibility of a student on a club''s public directory page.';

create index club_membership_club_id_idx on public.club_membership (club_id) where visible;
create index club_membership_student_id_idx on public.club_membership (student_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.student enable row level security;
alter table public.club enable row level security;
alter table public.club_membership enable row level security;

-- student: public profile pages are viewable by anyone (no login required),
-- per CLAUDE.md's core flow. purdue_email is intentionally not part of any
-- public-facing page, but RLS here is row-level, not column-level, so keep
-- that in mind if a public API/view is added later.
create policy "Student profiles are publicly readable"
  on public.student for select
  using (true);

create policy "Students can insert their own profile"
  on public.student for insert
  with check (auth.uid() = id);

create policy "Students can update their own profile"
  on public.student for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Students can delete their own profile"
  on public.student for delete
  using (auth.uid() = id);

-- club: directory pages are public; only the creator can manage the club.
create policy "Clubs are publicly readable"
  on public.club for select
  using (true);

create policy "Authenticated students can create clubs"
  on public.club for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "Club creators can update their club"
  on public.club for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "Club creators can delete their club"
  on public.club for delete
  using (auth.uid() = created_by);

-- club_membership: visible memberships are public; a student always sees
-- (and manages) their own membership rows regardless of visibility.
create policy "Visible memberships are publicly readable"
  on public.club_membership for select
  using (visible = true or auth.uid() = student_id);

create policy "Students can join a club"
  on public.club_membership for insert
  to authenticated
  with check (auth.uid() = student_id);

create policy "Students can update their own membership"
  on public.club_membership for update
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "Students can leave a club"
  on public.club_membership for delete
  using (auth.uid() = student_id);

-- ---------------------------------------------------------------------------
-- Auto-create a student row when a Purdue account signs up.
-- Gives every new user a working slug and a friendly default name (derived
-- from their email) so nobody is blocked from finishing signup, per
-- CLAUDE.md's core flow step 2.
-- ---------------------------------------------------------------------------
create function public.handle_new_student()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_slug text;
  final_slug text;
  attempt int := 0;
begin
  base_slug := regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'student';
  end if;

  final_slug := base_slug;
  while exists (select 1 from public.student where slug = final_slug) loop
    attempt := attempt + 1;
    final_slug := base_slug || '-' || attempt;
  end loop;

  insert into public.student (id, purdue_email, slug, name)
  values (
    new.id,
    new.email,
    final_slug,
    initcap(replace(split_part(new.email, '@', 1), '.', ' '))
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_student();
