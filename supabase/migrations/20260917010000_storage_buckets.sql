-- Avatar photos and resume uploads for student profiles.
-- Both are public-read (the public profile page shows them with no login),
-- but a student may only write to their own folder (named by their user id).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('resumes', 'resumes', true, 10485760, array['application/pdf']);

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Students can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Students can update their own avatar"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Students can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Resumes are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'resumes');

create policy "Students can upload their own resume"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Students can update their own resume"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Students can delete their own resume"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);
