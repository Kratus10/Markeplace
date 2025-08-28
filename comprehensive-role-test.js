// Comprehensive test for role hierarchy and access permissions
const { PrismaClient } = require('@prisma/client');

// Define roles
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

async function runTests() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== Role Hierarchy and Access Permissions Test ===\n');
    
    console.log('Roles defined:');
    console.log(ROLES);
    console.log('Hierarchy order:', [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN_L2, ROLES.ADMIN_L1, ROLES.OWNER]);
    
    console.log('\n=== Role-based Function Tests ===');
    console.log('isOwner(OWNER):', isOwner(ROLES.OWNER));
    console.log('isOwner(ADMIN_L1):', isOwner(ROLES.ADMIN_L1));
    
    console.log('\nisAdminL1(OWNER):', isAdminL1(ROLES.OWNER));
    console.log('isAdminL1(ADMIN_L1):', isAdminL1(ROLES.ADMIN_L1));
    console.log('isAdminL1(ADMIN_L2):', isAdminL1(ROLES.ADMIN_L2));
    
    console.log('\nisAdmin(OWNER):', isAdmin(ROLES.OWNER));
    console.log('isAdmin(ADMIN_L1):', isAdmin(ROLES.ADMIN_L1));
    console.log('isAdmin(ADMIN_L2):', isAdmin(ROLES.ADMIN_L2));
    
    console.log('\n=== Page Access Tests ===');
    console.log('OWNER can access /admin:', canAccessAdminPage(ROLES.OWNER, '/admin'));
    console.log('OWNER can access /admin/owner:', canAccessAdminPage(ROLES.OWNER, '/admin/owner'));
    console.log('OWNER can access /admin/l1:', canAccessAdminPage(ROLES.OWNER, '/admin/l1'));
    
    console.log('\nADMIN_L1 can access /admin:', canAccessAdminPage(ROLES.ADMIN_L1, '/admin'));
    console.log('ADMIN_L1 can access /admin/owner:', canAccessAdminPage(ROLES.ADMIN_L1, '/admin/owner'));
    console.log('ADMIN_L1 can access /admin/l1:', canAccessAdminPage(ROLES.ADMIN_L1, '/admin/l1'));
    
    console.log('\nADMIN_L2 can access /admin:', canAccessAdminPage(ROLES.ADMIN_L2, '/admin'));
    console.log('ADMIN_L2 can access /admin/owner:', canAccessAdminPage(ROLES.ADMIN_L2, '/admin/owner'));
    console.log('ADMIN_L2 can access /admin/l1:', canAccessAdminPage(ROLES.ADMIN_L2, '/admin/l1'));
    
    console.log('\n=== Database User Check ===');
    // Find the user with OWNER role
    const ownerUser = await prisma.user.findFirst({
      where: {
        role: 'OWNER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    
    console.log('OWNER user in database:');
    console.log(ownerUser);
    
    // Find all users with ADMIN_L1 role
    const adminL1Users = await prisma.user.findMany({
      where: {
        role: 'ADMIN_L1'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    
    console.log('\nADMIN_L1 users in database:');
    console.log(adminL1Users);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();