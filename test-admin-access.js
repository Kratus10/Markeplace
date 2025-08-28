// Test to verify admin access permissions
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

// Function to check access to specific admin pages
const canAccessAdminPage = (userRole, page) => {
  // OWNER has access to all admin pages
  if (userRole === ROLES.OWNER) {
    return true;
  }
  
  // ADMIN_L1 has access to all admin pages except the main /admin page and /admin/owner pages
  if (userRole === ROLES.ADMIN_L1) {
    // Deny access to main /admin page and owner-specific pages
    if (page === '/admin' || page === '/admin/owner' || page.startsWith('/admin/owner/')) {
      return false;
    }
    return true;
  }
  
  // Other roles don't have general admin access
  return false;
};

console.log('Admin access permissions test:');
console.log('ROLES:', ROLES);

console.log('\nGeneral admin access (isAdmin function):');
console.log('OWNER has admin access:', isAdmin(ROLES.OWNER));
console.log('ADMIN_L1 has admin access:', isAdmin(ROLES.ADMIN_L1));
console.log('ADMIN_L2 has admin access:', isAdmin(ROLES.ADMIN_L2));
console.log('MODERATOR has admin access:', isAdmin(ROLES.MODERATOR));
console.log('USER has admin access:', isAdmin(ROLES.USER));

console.log('\nSpecific page access:');
console.log('OWNER can access /admin:', canAccessAdminPage(ROLES.OWNER, '/admin'));
console.log('OWNER can access /admin/owner:', canAccessAdminPage(ROLES.OWNER, '/admin/owner'));
console.log('OWNER can access /admin/l1:', canAccessAdminPage(ROLES.OWNER, '/admin/l1'));

console.log('\nADMIN_L1 can access /admin:', canAccessAdminPage(ROLES.ADMIN_L1, '/admin'));
console.log('ADMIN_L1 can access /admin/owner:', canAccessAdminPage(ROLES.ADMIN_L1, '/admin/owner'));
console.log('ADMIN_L1 can access /admin/l1:', canAccessAdminPage(ROLES.ADMIN_L1, '/admin/l1'));

console.log('\nADMIN_L2 can access /admin:', canAccessAdminPage(ROLES.ADMIN_L2, '/admin'));
console.log('ADMIN_L2 can access /admin/owner:', canAccessAdminPage(ROLES.ADMIN_L2, '/admin/owner'));
console.log('ADMIN_L2 can access /admin/l1:', canAccessAdminPage(ROLES.ADMIN_L2, '/admin/l1'));