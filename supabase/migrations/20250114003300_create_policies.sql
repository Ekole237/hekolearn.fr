-- Politiques pour profiles
create policy "profiles_read_policy"
  on public.profiles for select
  to authenticated
  using (
    -- Les administrateurs peuvent voir tous les profils
    (auth.jwt() ->> 'role')::text = 'admin'
    -- Les utilisateurs peuvent voir leur propre profil
    or auth.uid() = id
    -- Les parents peuvent voir les profils de leurs enfants
    or (
      (auth.jwt() ->> 'role')::text = 'parent'
      and exists (
        select 1
        from public.parent_student_relations
        where parent_id = auth.uid()
        and student_id = profiles.id
      )
    )
    -- Les enseignants peuvent voir les profils de leurs élèves
    or (
      (auth.jwt() ->> 'role')::text = 'teacher'
      and exists (
        select 1
        from public.teacher_student_relations
        where teacher_id = auth.uid()
        and student_id = profiles.id
      )
    )
  );

create policy "profiles_update_policy"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Politiques pour teacher_student_relations
create policy "teacher_student_read_policy"
  on public.teacher_student_relations for select
  to authenticated
  using (
    auth.uid() = teacher_id
    or auth.uid() = student_id
    or (auth.jwt() ->> 'role')::text = 'admin'
  );

create policy "teacher_student_insert_policy"
  on public.teacher_student_relations for insert
  to authenticated
  with check (
    auth.uid() = teacher_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'teacher'
    )
  );

create policy "teacher_student_delete_policy"
  on public.teacher_student_relations for delete
  to authenticated
  using (
    auth.uid() = teacher_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'teacher'
    )
  );

-- Politiques pour parent_student_relations
create policy "parent_student_read_policy"
  on public.parent_student_relations for select
  to authenticated
  using (
    auth.uid() = parent_id
    or auth.uid() = student_id
    or (auth.jwt() ->> 'role')::text = 'admin'
  );

create policy "parent_student_insert_policy"
  on public.parent_student_relations for insert
  to authenticated
  with check (
    auth.uid() = parent_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'parent'
    )
  );

-- Politiques pour student_profiles
create policy "student_profiles_read_policy"
  on public.student_profiles for select
  to authenticated
  using (
    auth.uid() = id
    or exists (
      select 1 
      from public.parent_student_relations
      where parent_id = auth.uid()
      and student_id = student_profiles.id
    )
    or exists (
      select 1
      from public.teacher_student_relations
      where teacher_id = auth.uid()
      and student_id = student_profiles.id
    )
    or exists (
      select 1
      from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "student_profiles_update_policy"
  on public.student_profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
