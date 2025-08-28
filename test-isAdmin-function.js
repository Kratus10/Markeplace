// Test the isAdmin function with different roles
const ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN_L2: 'ADMIN_L2',
  ADMIN_L1: 'ADMIN_L1',
  OWNER: 'OWNER'
};

// isAdmin should return true for OWNER and ADMIN_L1 (and potentially ADMIN_L2 based on requirements)
const isAdmin = (userRole) => {
  // Based on your description, OWNER and ADMIN_L1 have admin access
  return userRole === ROLES.OWNER || userRole === ROLES.ADMIN_L1;
};

console.log('Testing isAdmin function:');
console.log('isAdmin(OWNER):', isAdmin(ROLES.OWNER));
console.log('isAdmin(ADMIN_L1):', isAdmin(ROLES.ADMIN_L1));
console.log('isAdmin(ADMIN_L2):', isAdmin(ROLES.ADMIN_L2));
console.log('isAdmin(MODERATOR):', isAdmin(ROLES.MODERATOR));
console.log('isAdmin(USER):', isAdmin(ROLES.USER));