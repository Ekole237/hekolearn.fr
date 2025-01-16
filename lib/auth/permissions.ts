import { Database } from '@/types/database.types';

export type UserRole = Database['public']['Tables']['profiles']['Row']['role'];

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete';
  subject: 'courses' | 'lessons' | 'chapters' | 'quizzes';
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'teacher': [
    { action: 'create', subject: 'courses' },
    { action: 'read', subject: 'courses' },
    { action: 'update', subject: 'courses' },
    { action: 'delete', subject: 'courses' },
    { action: 'create', subject: 'lessons' },
    { action: 'read', subject: 'lessons' },
    { action: 'update', subject: 'lessons' },
    { action: 'delete', subject: 'lessons' },
    { action: 'create', subject: 'chapters' },
    { action: 'read', subject: 'chapters' },
    { action: 'update', subject: 'chapters' },
    { action: 'delete', subject: 'chapters' },
    { action: 'create', subject: 'quizzes' },
    { action: 'read', subject: 'quizzes' },
    { action: 'update', subject: 'quizzes' },
    { action: 'delete', subject: 'quizzes' },
  ],
  'student': [
    { action: 'read', subject: 'courses' },
    { action: 'read', subject: 'lessons' },
    { action: 'read', subject: 'chapters' },
    { action: 'read', subject: 'quizzes' },
  ],
  'admin': [
    { action: 'create', subject: 'courses' },
    { action: 'read', subject: 'courses' },
    { action: 'update', subject: 'courses' },
    { action: 'delete', subject: 'courses' },
    { action: 'create', subject: 'lessons' },
    { action: 'read', subject: 'lessons' },
    { action: 'update', subject: 'lessons' },
    { action: 'delete', subject: 'lessons' },
    { action: 'create', subject: 'chapters' },
    { action: 'read', subject: 'chapters' },
    { action: 'update', subject: 'chapters' },
    { action: 'delete', subject: 'chapters' },
    { action: 'create', subject: 'quizzes' },
    { action: 'read', subject: 'quizzes' },
    { action: 'update', subject: 'quizzes' },
    { action: 'delete', subject: 'quizzes' },
  ],
  'parent': [
    { action: 'read', subject: 'courses' },
    { action: 'read', subject: 'lessons' },
    { action: 'read', subject: 'chapters' },
    { action: 'read', subject: 'quizzes' },
  ],
};

export function hasPermission(role: UserRole , permission: Permission): boolean {
  if (!role) return false;
  
  return ROLE_PERMISSIONS[role]?.some(
    p => p.action === permission.action && p.subject === permission.subject
  ) ?? false;
}
