-- Create teachers table
create table if not exists public.teachers (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  title text,
  bio text,
  avatar_url text,
  email text unique,
  active boolean default true,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.teachers enable row level security;

-- Create policy for public read access
create policy "Les enseignants sont visibles par tous"
  on public.teachers for select
  using (true);

-- Insert initial teacher data
insert into public.teachers (full_name, title, bio, email, order_index)
values 
  ('M. Martin', 'Professeur de Mathématiques', 'Passionné par l''enseignement des mathématiques depuis plus de 10 ans.', 'prof.martin@hekolearn.fr', 1),
  ('Mme Dubois', 'Professeure de Physique-Chimie', 'Docteure en physique avec une expérience de 8 ans dans l''enseignement.', 'prof.dubois@hekolearn.fr', 2)
on conflict (email) do nothing;

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_updated_at
  before update on public.teachers
  for each row
  execute procedure public.handle_updated_at();
