-- Suppression de toutes les politiques sur profiles
do $$ 
declare
    pol text;
begin
    for pol in (
        select policyname::text
        from pg_policies 
        where schemaname = 'public' 
        and tablename = 'profiles'
    )
    loop
        execute format('drop policy if exists %I on public.profiles', pol);
    end loop;
end $$;

-- Suppression de toutes les politiques sur student_profiles
do $$ 
declare
    pol text;
begin
    for pol in (
        select policyname::text
        from pg_policies 
        where schemaname = 'public' 
        and tablename = 'student_profiles'
    )
    loop
        execute format('drop policy if exists %I on public.student_profiles', pol);
    end loop;
end $$;

-- Suppression de toutes les politiques sur parent_profiles
do $$ 
declare
    pol text;
begin
    for pol in (
        select policyname::text
        from pg_policies 
        where schemaname = 'public' 
        and tablename = 'parent_profiles'
    )
    loop
        execute format('drop policy if exists %I on public.parent_profiles', pol);
    end loop;
end $$;

-- Suppression de toutes les politiques sur teacher_student_relations
do $$ 
declare
    pol text;
begin
    for pol in (
        select policyname::text
        from pg_policies 
        where schemaname = 'public' 
        and tablename = 'teacher_student_relations'
    )
    loop
        execute format('drop policy if exists %I on public.teacher_student_relations', pol);
    end loop;
end $$;

-- Suppression de toutes les politiques sur parent_student_relations
do $$ 
declare
    pol text;
begin
    for pol in (
        select policyname::text
        from pg_policies 
        where schemaname = 'public' 
        and tablename = 'parent_student_relations'
    )
    loop
        execute format('drop policy if exists %I on public.parent_student_relations', pol);
    end loop;
end $$;

-- Suppression des triggers existants
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
