// Convert the roleUtils.ts to a JavaScript version for testing
const ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN_L2: 'ADMIN_L2',
  ADMIN_L1: 'ADMIN_L1',
  OWNER: 'OWNER'
};

// Define role permissions with correct hierarchy
// OWNER > ADMIN_L1 > ADMIN_L2 > MODERATOR > USER
const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN_L2, ROLES.ADMIN_L1, ROLES.OWNER];
  
  const userIndex = roleHierarchy.indexOf(userRole);
  const requiredIndex = roleHierarchy.indexOf(requiredRole);
  
  return userIndex >= requiredIndex;
};

// Specific role checking functions
const isOwner = (userRole) => {
  return userRole === ROLES.OWNER;
};

const isAdminL1 = (userRole) => {
  return hasPermission(userRole, ROLES.ADMIN_L1);
};

// isAdmin should return true for OWNER and ADMIN_L1 (and potentially ADMIN_L2 based on requirements)
const isAdmin = (userRole) => {
  // Based on your description, OWNER and ADMIN_L1 have admin access
  // ADMIN_L2 might also have some admin access, but let's keep it specific to OWNER and ADMIN_L1 for now
  return userRole === ROLES.OWNER || userRole === ROLES.ADMIN_L1;
};

console.log('Role hierarchy test:');
console.log('ROLES:', ROLES);
console.log('Hierarchy order:', [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN_L2, ROLES.ADMIN_L1, ROLES.OWNER]);

console.log('\nTesting OWNER role:');
console.log('isOwner(OWNER):', isOwner(ROLES.OWNER));
console.log('isAdmin(OWNER):', isAdmin(ROLES.OWNER));
console.log('isAdminL1(OWNER):', isAdminL1(ROLES.OWNER));

console.log('\nTesting ADMIN_L1 role:');
console.log('isOwner(ADMIN_L1):', isOwner(ROLES.ADMIN_L1));
console.log('isAdmin(ADMIN_L1):', isAdmin(ROLES.ADMIN_L1));
console.log('isAdminL1(ADMIN_L1):', isAdminL1(ROLES.ADMIN_L1));

console.log('\nTesting ADMIN_L2 role:');
console.log('isOwner(ADMIN_L2):', isOwner(ROLES.ADMIN_L2));
console.log('isAdmin(ADMIN_L2):', isAdmin(ROLES.ADMIN_L2));
console.log('isAdminL1(ADMIN_L2):', isAdminL1(ROLES.ADMIN_L2));

console.log('\nTesting MODERATOR role:');
console.log('isOwner(MODERATOR):', isOwner(ROLES.MODERATOR));
console.log('isAdmin(MODERATOR):', isAdmin(ROLES.MODERATOR));
console.log('isAdminL1(MODERATOR):', isAdminL1(ROLES.MODERATOR));

console.log('\nTesting USER role:');
console.log('isOwner(USER):', isOwner(ROLES.USER));
console.log('isAdmin(USER):', isAdmin(ROLES.USER));
console.log('isAdminL1(USER):', isAdminL1(ROLES.USER));

console.log('\nPermission checks:');
console.log('hasPermission(OWNER, ADMIN_L1):', hasPermission(ROLES.OWNER, ROLES.ADMIN_L1));
console.log('hasPermission(ADMIN_L1, ADMIN_L1):', hasPermission(ROLES.ADMIN_L1, ROLES.ADMIN_L1));
console.log('hasPermission(ADMIN_L2, ADMIN_L1):', hasPermission(ROLES.ADMIN_L2, ROLES.ADMIN_L1));
console.log('hasPermission(MODERATOR, ADMIN_L1):', hasPermission(ROLES.MODERATOR, ROLES.ADMIN_L1));
console.log('hasPermission(USER, ADMIN_L1):', hasPermission(ROLES.USER, ROLES.ADMIN_L1));