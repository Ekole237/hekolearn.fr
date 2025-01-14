import { User } from '@supabase/supabase-js';

export type UserRole = 'student' | 'teacher' | 'admin' | 'parent';

export interface Profile {
  id: string;
  username: string;
  role: UserRole;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_seen_at?: string;
  birth_date?: string;
  parent_email?: string;
  parent_id?: string;
  school_id?: string;
  class_id?: string;
  is_verified: boolean;
  preferences: UserPreferences;
}

export interface UserWithProfile extends User {
  profile: Profile;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  language: string;
}

export interface AuthError {
  code: string;
  message: string;
  status?: number;
}

export interface AuthState {
  user: UserWithProfile | null;
  loading: boolean;
  error: AuthError | null;
  initialized: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  role: UserRole;
  birthDate?: string;
  parentEmail?: string;
}

export interface AuthResponse {
  user: UserWithProfile | null;
  error: AuthError | null;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete';
  resource: 'courses' | 'lessons' | 'resources' | 'users' | 'profiles' | 'settings';
  conditions?: {
    ownerOnly?: boolean;
    schoolOnly?: boolean;
    roleRequired?: UserRole[];
  };
}

export const PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { action: 'create', resource: 'courses' },
    { action: 'read', resource: 'courses' },
    { action: 'update', resource: 'courses' },
    { action: 'delete', resource: 'courses' },
    { action: 'create', resource: 'users' },
    { action: 'read', resource: 'users' },
    { action: 'update', resource: 'users' },
    { action: 'delete', resource: 'users' },
  ],
  teacher: [
    { 
      action: 'create', 
      resource: 'courses',
      conditions: { ownerOnly: true }
    },
    { 
      action: 'update', 
      resource: 'courses',
      conditions: { ownerOnly: true }
    },
    { 
      action: 'read', 
      resource: 'courses',
      conditions: { schoolOnly: true }
    },
    { 
      action: 'create', 
      resource: 'resources',
      conditions: { ownerOnly: true }
    },
  ],
  student: [
    { 
      action: 'read', 
      resource: 'courses',
      conditions: { schoolOnly: true }
    },
    { 
      action: 'read', 
      resource: 'resources',
      conditions: { schoolOnly: true }
    },
  ],
  parent: [
    { 
      action: 'read', 
      resource: 'courses',
      conditions: { schoolOnly: true }
    },
    { 
      action: 'read', 
      resource: 'resources',
      conditions: { schoolOnly: true }
    },
  ],
};
