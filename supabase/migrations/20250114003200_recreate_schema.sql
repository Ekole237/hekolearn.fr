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

-- Création des tables de relations si elles n'existent pas
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
create function public.handle_new_user()
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
