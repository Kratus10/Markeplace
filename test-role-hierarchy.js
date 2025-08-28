// Convert the roleUtils.ts to a JavaScript version for testing
const ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN_L1: 'ADMIN_L1',
  ADMIN_L2: 'ADMIN_L2',
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

const isAdmin = (userRole) => {
  return hasPermission(userRole, ROLES.ADMIN_L1);
};

console.log('Role hierarchy test:');
console.log('ROLES:', ROLES);

console.log('\nTesting OWNER role:');
console.log('isOwner(OWNER):', isOwner(ROLES.OWNER));
console.log('isAdmin(OWNER):', isAdmin(ROLES.OWNER));
console.log('isAdminL1(OWNER):', isAdminL1(ROLES.OWNER));

console.log('\nTesting ADMIN_L1 role:');
console.log('isOwner(ADMIN_L1):', isOwner(ROLES.ADMIN_L1));
console.log('isAdmin(ADMIN_L1):', isAdmin(ROLES.ADMIN_L1));
console.log('isAdminL1(ADMIN_L1):', isAdminL1(ROLES.ADMIN_L1));

console.log('\nTesting USER role:');
console.log('isOwner(USER):', isOwner(ROLES.USER));
console.log('isAdmin(USER):', isAdmin(ROLES.USER));
console.log('isAdminL1(USER):', isAdminL1(ROLES.USER));

console.log('\nPermission checks:');
console.log('hasPermission(OWNER, ADMIN_L1):', hasPermission(ROLES.OWNER, ROLES.ADMIN_L1));
console.log('hasPermission(ADMIN_L1, ADMIN_L1):', hasPermission(ROLES.ADMIN_L1, ROLES.ADMIN_L1));
console.log('hasPermission(USER, ADMIN_L1):', hasPermission(ROLES.USER, ROLES.ADMIN_L1));