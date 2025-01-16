-- Suppression de toutes les politiques existantes
drop policy if exists "Les profils sont visibles par les utilisateurs authentifiés" on public.profiles;
drop policy if exists "Les utilisateurs peuvent modifier leur propre profil" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Anyone can view profiles" on public.profiles;
drop policy if exists "Profils visibles par utilisateurs authentifiés" on public.profiles;
drop policy if exists "Modification de son propre profil" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can update their own profile." on public.profiles;

-- Suppression des triggers existants
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Mise à jour de la table profiles
alter table public.profiles
  add column if not exists email text,
  add column if not exists role user_role default 'student',
  add column if not exists last_seen_at timestamp with time zone,
  add column if not exists parent_id uuid references public.profiles(id),
  add column if not exists school_id uuid,
  add column if not exists class_id uuid,
  add column if not exists is_verified boolean default false,
  add column if not exists auth_provider text default 'email',
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

-- Création des tables de relations
create table if not exists public.teacher_student_relations (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references public.profiles(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(teacher_id, student_id)
);

create table if not exists public.parent_student_relations (
  id uuid default gen_random_uuid() primary key,
  parent_id uuid references public.profiles(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(parent_id, student_id)
);

create table if not exists public.student_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  birth_date date,
  parent_email text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Activation de RLS sur toutes les tables
alter table public.profiles enable row level security;
alter table public.teacher_student_relations enable row level security;
alter table public.parent_student_relations enable row level security;
alter table public.student_profiles enable row level security;

-- Création de la fonction de gestion des nouveaux utilisateurs
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    username,
    role,
    is_verified,
    auth_provider,
    preferences
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student'),
    false,
    coalesce(new.raw_user_meta_data->>'provider', 'email'),
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

-- Création du trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Politiques pour profiles
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
create policy "Lecture des relations enseignant-élève"
  on public.teacher_student_relations for select
  to authenticated
  using (
    auth.uid() = teacher_id
    or auth.uid() = student_id
    or (auth.jwt() ->> 'role')::text = 'admin'
  );

create policy "Création des relations enseignant-élève"
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

create policy "Suppression des relations enseignant-élève"
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
create policy "Lecture des relations parent-élève"
  on public.parent_student_relations for select
  to authenticated
  using (
    auth.uid() = parent_id
    or auth.uid() = student_id
    or (auth.jwt() ->> 'role')::text = 'admin'
  );

create policy "Création des relations parent-élève"
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
create policy "Lecture des profils étudiants"
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

create policy "Modification de son profil étudiant"
  on public.student_profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
