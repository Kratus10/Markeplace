import { User } from '@prisma/client';
import { hasPermission, ROLES } from '@/lib/auth/roleUtils';

export function isAdmin(userOrRole: User | string) {
  const role = typeof userOrRole === 'string' ? userOrRole : userOrRole.role;
  return hasPermission(role, ROLES.ADMIN_L1);
}