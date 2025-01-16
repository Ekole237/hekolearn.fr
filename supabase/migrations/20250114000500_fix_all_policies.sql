-- Suppression de toutes les politiques existantes
drop policy if exists "Les profils sont visibles par les utilisateurs authentifiés" on public.profiles;
drop policy if exists "Les utilisateurs peuvent modifier leur propre profil" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Anyone can view profiles" on public.profiles;
drop policy if exists "Les profils étudiants sont visibles par eux-mêmes et leurs parents" on public.student_profiles;
drop policy if exists "Les profils parents sont visibles par eux-mêmes" on public.parent_profiles;
drop policy if exists "Les relations parent-étudiant sont visibles par les concernés" on public.parent_student_relations;

-- Suppression des triggers existants qui pourraient causer des problèmes
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Création de la fonction de gestion des nouveaux utilisateurs
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role, auth_provider)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student'),
    coalesce(new.raw_user_meta_data->>'provider', 'email')
  );
  
  -- Si c'est un étudiant, créer son profil étudiant
  if (new.raw_user_meta_data->>'role' = 'student' or new.raw_user_meta_data->>'role' is null) then
    insert into public.student_profiles (id)
    values (new.id);
  end if;
  
  -- Si c'est un parent, créer son profil parent
  if (new.raw_user_meta_data->>'role' = 'parent') then
    insert into public.parent_profiles (id)
    values (new.id);
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Recréation du trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Nouvelles politiques pour profiles
create policy "Profils visibles par utilisateurs authentifiés"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Modification de son propre profil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Nouvelles politiques pour student_profiles
create policy "Accès aux profils étudiants"
  on public.student_profiles for select
  to authenticated
  using (
    auth.uid() = id or 
    exists (
      select 1 
      from public.parent_student_relations psr
      where psr.student_id = public.student_profiles.id 
      and psr.parent_id = auth.uid()
    )
  );

create policy "Modification de son profil étudiant"
  on public.student_profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Nouvelles politiques pour parent_profiles
create policy "Accès aux profils parents"
  on public.parent_profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Modification de son profil parent"
  on public.parent_profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Nouvelles politiques pour parent_student_relations
create policy "Accès aux relations parent-étudiant"
  on public.parent_student_relations for select
  to authenticated
  using (
    parent_id = auth.uid() or
    student_id = auth.uid()
  );

create policy "Création de relations parent-étudiant"
  on public.parent_student_relations for insert
  to authenticated
  with check (
    parent_id = auth.uid() or
    student_id = auth.uid()
  );

-- Fonction pour vérifier si un utilisateur est parent
create or replace function public.is_parent(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1
    from public.profiles
    where id = user_id and role = 'parent'
  );
end;
$$ language plpgsql security definer;
