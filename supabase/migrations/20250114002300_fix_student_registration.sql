-- Mise à jour de la table profiles pour inclure tous les champs nécessaires
alter table public.profiles
  add column if not exists username text,
  add column if not exists last_seen_at timestamp with time zone,
  add column if not exists parent_id uuid references public.profiles(id),
  add column if not exists school_id uuid,
  add column if not exists class_id uuid,
  add column if not exists is_verified boolean default false,
  add column if not exists preferences jsonb default '{
    "theme": "system",
    "notifications": {
      "email": true,
      "push": true,
      "desktop": true
    },
    "accessibility": {
      "reduceMotion": false,
      "highContrast": false,
      "fontSize": "medium"
    },
    "language": "fr"
  }'::jsonb;

-- Création de la table pour les relations enseignant-élève
create table if not exists public.teacher_student_relations (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references public.profiles(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(teacher_id, student_id)
);

-- Mise à jour des triggers pour la création automatique des profils
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    username,
    role,
    is_verified,
    preferences
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student'),
    false,
    coalesce(
      (new.raw_user_meta_data->>'preferences')::jsonb,
      '{
        "theme": "system",
        "notifications": {
          "email": true,
          "push": true,
          "desktop": true
        },
        "accessibility": {
          "reduceMotion": false,
          "highContrast": false,
          "fontSize": "medium"
        },
        "language": "fr"
      }'::jsonb
    )
  );

  -- Si c'est un étudiant, créer son profil étudiant
  if (new.raw_user_meta_data->>'role' = 'student' or new.raw_user_meta_data->>'role' is null) then
    insert into public.student_profiles (
      id,
      birth_date,
      parent_email
    )
    values (
      new.id,
      (new.raw_user_meta_data->>'birth_date')::date,
      new.raw_user_meta_data->>'parent_email'
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Suppression des anciennes politiques
drop policy if exists "Les profils sont visibles par les utilisateurs authentifiés" on public.profiles;
drop policy if exists "Les utilisateurs peuvent modifier leur propre profil" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Anyone can view profiles" on public.profiles;

-- Nouvelles politiques pour profiles
create policy "Lecture des profils"
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

create policy "Modification de son propre profil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Politiques pour teacher_student_relations
create policy "Les enseignants peuvent voir leurs relations"
  on public.teacher_student_relations for select
  to authenticated
  using (
    auth.uid() = teacher_id
    or auth.uid() = student_id
    or (auth.jwt() ->> 'role')::text = 'admin'
  );

create policy "Les enseignants peuvent créer des relations"
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

create policy "Les enseignants peuvent supprimer leurs relations"
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

-- Fonction pour vérifier si un utilisateur est parent
create or replace function public.is_parent(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1
    from public.profiles
    where id = user_id
    and role = 'parent'
  );
end;
$$ language plpgsql security definer;

-- Fonction pour vérifier si un utilisateur est enseignant
create or replace function public.is_teacher(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1
    from public.profiles
    where id = user_id
    and role = 'teacher'
  );
end;
$$ language plpgsql security definer;
