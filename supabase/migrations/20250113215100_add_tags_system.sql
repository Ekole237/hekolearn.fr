-- Fonction pour gérer les timestamps updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Table des ressources
create table if not exists public.resources (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    type text not null,
    subject text not null,
    level text,
    file_url text,
    thumbnail_url text,
    download_count integer default 0,
    is_premium boolean default false,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Création de la table des tags
create table if not exists public.tags (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text not null unique,
    description text,
    color text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table de liaison pour les ressources
create table if not exists public.resource_tags (
    id uuid default uuid_generate_v4() primary key,
    resource_id uuid not null references public.resources(id) on delete cascade,
    tag_id uuid not null references public.tags(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(resource_id, tag_id)
);

-- Enable RLS
alter table public.resources enable row level security;
alter table public.tags enable row level security;
alter table public.resource_tags enable row level security;

-- Policies
create policy "Les ressources sont visibles par tous les utilisateurs authentifiés"
    on public.resources for select
    to authenticated
    using (true);

create policy "Les tags sont visibles par tous les utilisateurs authentifiés"
    on public.tags for select
    to authenticated
    using (true);

create policy "Les resource_tags sont visibles par tous les utilisateurs authentifiés"
    on public.resource_tags for select
    to authenticated
    using (true);

create policy "Seul l'admin peut créer/modifier les ressources"
    on public.resources for all
    to authenticated
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.role = 'teacher'
        )
    );

create policy "Seul l'admin peut créer/modifier les tags"
    on public.tags for all
    to authenticated
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.role = 'teacher'
        )
    );

create policy "Seul l'admin peut gérer les relations resource_tags"
    on public.resource_tags for all
    to authenticated
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.role = 'teacher'
        )
    );

-- Fonction pour slugifier les noms de tags
create or replace function slugify(text)
returns text as $$
  select lower(regexp_replace(regexp_replace($1, '[^a-zA-Z0-9\s-]', ''), '\s+', '-', 'g'));
$$ language sql immutable;

-- Trigger pour mettre à jour le slug automatiquement
create or replace function update_tag_slug()
returns trigger as $$
begin
    new.slug := slugify(new.name);
    return new;
end;
$$ language plpgsql;

create trigger update_tag_slug_trigger
    before insert or update of name on public.tags
    for each row
    execute function update_tag_slug();

-- Trigger pour updated_at
create trigger handle_resources_updated_at
    before update on public.resources
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_tags_updated_at
    before update on public.tags
    for each row
    execute procedure public.handle_updated_at();

-- Insertion de quelques tags de base
insert into public.tags (name, description, color) values
    ('Débutant', 'Contenu adapté aux débutants', '#22c55e'),
    ('Intermédiaire', 'Contenu de niveau intermédiaire', '#3b82f6'),
    ('Avancé', 'Contenu pour les élèves avancés', '#ef4444'),
    ('Exercice', 'Exercices pratiques', '#8b5cf6'),
    ('Cours', 'Support de cours', '#f59e0b'),
    ('Méthodologie', 'Guides et méthodes', '#06b6d4')
on conflict (slug) do nothing;

-- Insertion de quelques ressources d'exemple
insert into public.resources (title, description, type, subject, level, is_premium) values
    ('Introduction aux fonctions', 'Cours complet sur les fonctions mathématiques', 'document', 'Mathématiques', '2nde', false),
    ('Les figures de style', 'Guide des principales figures de style en français', 'document', 'Français', '1ère', false),
    ('Exercices - Équations du second degré', 'Série d''exercices progressifs', 'exercise', 'Mathématiques', '1ère', false)
on conflict do nothing;
