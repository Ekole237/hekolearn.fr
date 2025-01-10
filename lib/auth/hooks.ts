'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import { Permission, hasPermission } from './permissions';

type Profile = {
  id: string;
  role: string;
};

export function useUser() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUser = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      const userData = session?.user ?? null;

      if (userData) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.id)
          .single();

        return {
          ...userData,
          ...profile
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }, [supabase]);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, getUser]);

  return { user, loading, supabase };
}

export function usePermissions() {
  const { user } = useUser();

  const can = useCallback((permission: Permission) => {
    if (!user?.role) return false;
    return hasPermission(user.role, permission);
  }, [user?.role]);

  const isTeacher = useCallback(() => {
    return user?.role === 'teacher';
  }, [user?.role]);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user?.role]);

  const isStudent = useCallback(() => {
    return user?.role === 'student';
  }, [user?.role]);

  return {
    can,
    isTeacher,
    isAdmin,
    isStudent
  };
}

export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const { user } = useUser();

  const redirect = useCallback(async () => {
    if (user) {
      router.replace('/courses');
    }
  }, [router, user]);

  useEffect(() => {
    redirect();
  }, [redirect]);

  return { redirect };
}

export function useRequireAuth() {
  const router = useRouter();
  const { user } = useUser();

  const requireAuth = useCallback(async () => {
    if (!user) {
      router.replace('/auth/login');
      return null;
    }
    return user;
  }, [router, user]);

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  return { requireAuth };
}

export function useRequireTeacher() {
  const router = useRouter();
  const { user } = useUser();
  const { isTeacher } = usePermissions();

  const requireTeacher = useCallback(async () => {
    if (!user) {
      router.replace('/auth/login');
      return null;
    }

    if (!isTeacher()) {
      router.replace('/courses');
      return null;
    }

    return user;
  }, [router, user, isTeacher]);

  useEffect(() => {
    requireTeacher();
  }, [requireTeacher]);

  return { requireTeacher };
}
