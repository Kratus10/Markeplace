// FILE: lib/auth/roleUtils.ts
/**
 * Utility functions for role-based access control
 */

// Define role hierarchy - OWNER is at the top, followed by admin levels
export const ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN_L2: 'ADMIN_L2',
  ADMIN_L1: 'ADMIN_L1',
  OWNER: 'OWNER'
} as const;

export type Role = keyof typeof ROLES;

// Define role permissions with correct hierarchy
// OWNER > ADMIN_L1 > ADMIN_L2 > MODERATOR > USER
export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN_L2, ROLES.ADMIN_L1, ROLES.OWNER];
  
  const userIndex = roleHierarchy.indexOf(userRole as any);
  const requiredIndex = roleHierarchy.indexOf(requiredRole as any);
  
  return userIndex >= requiredIndex;
};

// Specific role checking functions
export const isOwner = (userRole: string): boolean => {
  return userRole === ROLES.OWNER;
};

export const isAdminL1 = (userRole: string): boolean => {
  return hasPermission(userRole, ROLES.ADMIN_L1);
};

// isAdmin should return true for OWNER and ADMIN_L1 (and potentially ADMIN_L2 based on requirements)
export const isAdmin = (userRole: string): boolean => {
  // Based on your description, OWNER and ADMIN_L1 have admin access
  // ADMIN_L2 might also have some admin access, but let's keep it specific to OWNER and ADMIN_L1 for now
  return userRole === ROLES.OWNER || userRole === ROLES.ADMIN_L1;
};
