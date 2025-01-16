import { User } from '@supabase/auth-helpers-nextjs';

export type UserRole = 'student' | 'teacher';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export interface SessionEvent {
  type: 'SIGNED_OUT' | 'SESSION_EXPIRED' | 'USER_UPDATED';
  payload?: any;
}

export interface AuthError extends Error {
  code?: string;
  statusCode?: number;
}
