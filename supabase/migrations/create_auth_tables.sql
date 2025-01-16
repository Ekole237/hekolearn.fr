-- Enable les extensions nécessaires
create extension if not exists "uuid-ossp";

-- Enum pour les rôles utilisateur
create type user_role as enum ('student', 'teacher', 'parent');

-- Table des profils utilisateur étendus
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  role user_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Table pour les profils étudiants
create table if not exists public.student_profiles (
  id uuid references public.profiles on delete cascade,
  birth_date date,
  grade text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Table pour les profils parents
create table if not exists public.parent_profiles (
  id uuid references public.profiles on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Table de relation parent-étudiant
create table if not exists public.parent_student_relations (
  id uuid default uuid_generate_v4() primary key,
  parent_id uuid references public.parent_profiles on delete cascade,
  student_id uuid references public.student_profiles on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(parent_id, student_id)
);

-- Configuration de l'enseignant (vous)
create table if not exists public.teacher_config (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  full_name text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insérer votre profil enseignant (à modifier avec vos informations)
insert into public.teacher_config (email, full_name)
values ('votre-email@example.com', 'Votre Nom')
on conflict (email) do nothing;

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.parent_profiles enable row level security;
alter table public.parent_student_relations enable row level security;
alter table public.teacher_config enable row level security;

-- Policies
create policy "Les profils sont visibles par les utilisateurs authentifiés"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Les utilisateurs peuvent modifier leur propre profil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

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

create policy "Les profils parents sont visibles par eux-mêmes"
  on public.parent_profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Les relations parent-étudiant sont visibles par les concernés"
  on public.parent_student_relations for select
  to authenticated
  using (
    parent_id = auth.uid() or
    student_id = auth.uid()
  );

-- Triggers pour updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_teacher_config_updated_at
  before update on public.teacher_config
  for each row
  execute procedure public.handle_updated_at();
