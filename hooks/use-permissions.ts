import { useAuth } from '@/lib/auth/context';
import { Permission, PERMISSIONS } from '@/types/auth';
import { useMemo } from 'react';

export function usePermissions() {
  const { user } = useAuth();

  const userPermissions = useMemo(() => {
    if (!user?.profile?.role) return [];
    return PERMISSIONS[user.profile.role] || [];
  }, [user?.profile?.role]);

  const hasPermission = (requiredPermission: Permission): boolean => {
    if (!user?.profile?.role) return false;

    return userPermissions.some(permission => {
      // Vérifier l'action et la ressource
      const basicMatch = 
        permission.action === requiredPermission.action &&
        permission.resource === requiredPermission.resource;

      if (!basicMatch) return false;

      // Si pas de conditions, la permission est accordée
      if (!permission.conditions && !requiredPermission.conditions) {
        return true;
      }

      // Vérifier les conditions
      const permissionConditions = permission.conditions || {};
      const requiredConditions = requiredPermission.conditions || {};

      // Vérifier ownerOnly
      if (requiredConditions.ownerOnly && !permissionConditions.ownerOnly) {
        return false;
      }

      // Vérifier schoolOnly
      if (requiredConditions.schoolOnly && !permissionConditions.schoolOnly) {
        return false;
      }

      // Vérifier les rôles requis
      if (requiredConditions.roleRequired && 
          (!permissionConditions.roleRequired || 
           !permissionConditions.roleRequired.includes(user.profile.role))) {
        return false;
      }

      return true;
    });
  };

  const checkPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const filterByPermission = <T extends { id: string; userId?: string }>(
    items: T[],
    permission: Permission
  ): T[] => {
    if (!user?.profile) return [];

    return items.filter(item => {
      const itemPermission = { ...permission };

      // Si la condition ownerOnly est présente, vérifier que l'utilisateur est le propriétaire
      if (permission.conditions?.ownerOnly && item.userId) {
        if (item.userId !== user.profile.id) {
          return false;
        }
      }

      return hasPermission(itemPermission);
    });
  };

  return {
    permissions: userPermissions,
    hasPermission,
    checkPermissions,
    filterByPermission,
  };
}
