-- Create teachers table
create table if not exists public.teachers (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references auth.users(id),
  full_name text not null,
  role_title text not null,
  subjects text[] not null,
  bio text,
  education text,
  avatar_url text,
  is_founder boolean default false,
  order_index integer default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS if not already enabled
alter table if exists public.teachers enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Les profils enseignants sont publics" on public.teachers;
drop policy if exists "Seuls les admins peuvent gérer les enseignants" on public.teachers;

-- Create policies
create policy "Les profils enseignants sont publics"
  on public.teachers for select using (true);

create policy "Seuls les admins peuvent gérer les enseignants"
  on public.teachers for all
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Insert initial teacher if not exists
insert into public.teachers (profile_id, full_name, role_title, subjects, bio, education, is_founder, order_index)
select 
  id,
  'Ekodev',
  'Fondateur & Enseignant',
  array['Mathématiques', 'Informatique'],
  'Passionné par l''enseignement et le développement web, je combine ces deux domaines pour créer une expérience d''apprentissage innovante et personnalisée.',
  'Développeur Full Stack | Enseignant en mathématiques',
  true,
  1
from auth.users 
where email = 'contact@hekolearn.com'
and not exists (
  select 1 from public.teachers where full_name = 'Ekodev'
);
