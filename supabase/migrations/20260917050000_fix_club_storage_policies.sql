-- The previous migration's policies referenced a bare `name` column inside
-- a correlated subquery against public.club, which also has a `name`
-- column (the club's display name) — Postgres resolved it to the inner
-- scope, so storage.foldername() was computing off the club's display name
-- instead of the storage object's path, and the ownership check never
-- matched. Recreate the same policies with the outer column qualified.

drop policy "Club creators can upload their club logo" on storage.objects;
drop policy "Club creators can update their club logo" on storage.objects;
drop policy "Club creators can delete their club logo" on storage.objects;
drop policy "Club creators can upload their club document" on storage.objects;
drop policy "Club creators can update their club document" on storage.objects;
drop policy "Club creators can delete their club document" on storage.objects;

create policy "Club creators can upload their club logo"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'club-logos'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(storage.objects.name))[1]
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
      where c.id::text = (storage.foldername(storage.objects.name))[1]
        and c.created_by = auth.uid()
    )
  )
  with check (
    bucket_id = 'club-logos'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(storage.objects.name))[1]
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
      where c.id::text = (storage.foldername(storage.objects.name))[1]
        and c.created_by = auth.uid()
    )
  );

create policy "Club creators can upload their club document"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'club-documents'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(storage.objects.name))[1]
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
      where c.id::text = (storage.foldername(storage.objects.name))[1]
        and c.created_by = auth.uid()
    )
  )
  with check (
    bucket_id = 'club-documents'
    and exists (
      select 1 from public.club c
      where c.id::text = (storage.foldername(storage.objects.name))[1]
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
      where c.id::text = (storage.foldername(storage.objects.name))[1]
        and c.created_by = auth.uid()
    )
  );
