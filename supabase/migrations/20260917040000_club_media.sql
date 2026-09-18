-- Club logo (image) and a general document upload (e.g. a charter/info
-- sheet), mirroring student's avatar_url/resume_url pattern.

alter table public.club
  add column logo_url text,
  add column document_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('club-logos', 'club-logos', true, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('club-documents', 'club-documents', true, 10485760, array['application/pdf']);

-- Files are stored at `${club_id}/...`. Ownership is the club's creator,
-- not the uploader's own id (unlike student avatars/resumes), so the policy
-- looks up the club row instead of matching the folder name to auth.uid().
create policy "Club logos are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'club-logos');

create policy "Club creators can upload their club logo"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'club-logos'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(name))[1]
        and c.created_by = auth.uid()
    )
  );

create policy "Club creators can update their club logo"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'club-logos'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(name))[1]
        and c.created_by = auth.uid()
    )
  )
  with check (
    bucket_id = 'club-logos'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(name))[1]
        and c.created_by = auth.uid()
    )
  );

create policy "Club creators can delete their club logo"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'club-logos'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(name))[1]
        and c.created_by = auth.uid()
    )
  );

create policy "Club documents are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'club-documents');

create policy "Club creators can upload their club document"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'club-documents'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(name))[1]
        and c.created_by = auth.uid()
    )
  );

create policy "Club creators can update their club document"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'club-documents'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(name))[1]
        and c.created_by = auth.uid()
    )
  )
  with check (
    bucket_id = 'club-documents'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(name))[1]
        and c.created_by = auth.uid()
    )
  );

create policy "Club creators can delete their club document"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'club-documents'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(name))[1]
        and c.created_by = auth.uid()
    )
  );
