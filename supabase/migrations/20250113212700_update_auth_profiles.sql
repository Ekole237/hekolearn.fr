-- Création des tables de base si elles n'existent pas
create table if not exists public.student_profiles (
  id uuid references public.profiles on delete cascade primary key,
  birth_date date,
  grade text,
  parent_email text,
  registration_status text default 'pending',
  registration_token uuid default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.parent_profiles (
  id uuid references public.profiles on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.parent_student_relations (
  id uuid default uuid_generate_v4() primary key,
  parent_id uuid references public.parent_profiles on delete cascade,
  student_id uuid references public.student_profiles on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(parent_id, student_id)
);

-- Table pour les invitations parents
create table if not exists public.parent_invitations (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  student_id uuid references public.student_profiles on delete cascade,
  token uuid default uuid_generate_v4(),
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone default timezone('utc'::text, now() + interval '7 days') not null,
  unique(email, student_id)
);

-- Sauvegarde des données existantes
create table if not exists public.temp_profiles as
select * from public.profiles;

create table if not exists public.temp_student_profiles as
select * from public.student_profiles;

-- Ajout d'une colonne pour le provider d'authentification
alter table public.profiles
add column if not exists auth_provider text;

-- Mise à jour des données existantes
update public.profiles
set auth_provider = 
  case 
    when email = 'ekoledev@gmail.com' then 'google'
    else 'email'
  end
where auth_provider is null;

-- Enable RLS pour les nouvelles tables
alter table public.student_profiles enable row level security;
alter table public.parent_profiles enable row level security;
alter table public.parent_student_relations enable row level security;
alter table public.parent_invitations enable row level security;

-- Policies pour les profils étudiants
create policy "Les profils étudiants sont visibles par eux-mêmes et leurs parents"
  on public.student_profiles for select
  to authenticated
  using (
    auth.uid() = id or
    exists (
      select 1 from public.parent_student_relations
      where student_id = id and parent_id = auth.uid()
    )
  );

-- Policies pour les profils parents
create policy "Les profils parents sont visibles par eux-mêmes"
  on public.parent_profiles for select
  to authenticated
  using (auth.uid() = id);

-- Policies pour les relations parent-étudiant
create policy "Les relations parent-étudiant sont visibles par les concernés"
  on public.parent_student_relations for select
  to authenticated
  using (
    parent_id = auth.uid() or
    student_id = auth.uid()
  );

-- Policies pour les invitations
create policy "Les invitations sont visibles par l'email invité"
  on public.parent_invitations for select
  to authenticated
  using (email = auth.email());

-- Fonction pour créer une invitation parent
create or replace function public.create_parent_invitation(
  student_id uuid,
  parent_email text
) returns uuid as $$
declare
  invitation_id uuid;
begin
  insert into public.parent_invitations (student_id, email)
  values (student_id, parent_email)
  returning id into invitation_id;
  
  return invitation_id;
end;
$$ language plpgsql security definer;

-- Fonction pour valider une invitation parent
create or replace function public.validate_parent_invitation(
  token uuid
) returns boolean as $$
declare
  invitation record;
begin
  select * into invitation
  from public.parent_invitations
  where token = validate_parent_invitation.token
  and status = 'pending'
  and expires_at > now();

  if not found then
    return false;
  end if;

  -- Créer la relation parent-étudiant
  insert into public.parent_student_relations (parent_id, student_id)
  values (auth.uid(), invitation.student_id);

  -- Mettre à jour le statut de l'invitation
  update public.parent_invitations
  set status = 'accepted'
  where token = validate_parent_invitation.token;

  return true;
end;
$$ language plpgsql security definer;

-- Nettoyage des tables temporaires
drop table if exists public.temp_profiles;
drop table if exists public.temp_student_profiles;
