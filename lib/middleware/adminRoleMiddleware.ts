// FILE: lib/middleware/adminRoleMiddleware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { ROLES, hasPermission } from '@/lib/auth/roleUtils';

export const withAdminL1Protection = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!hasPermission(session.user.role, ROLES.ADMIN_L1)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    return handler(req, res);
  };
};

export const withOwnerProtection = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!hasPermission(session.user.role, ROLES.OWNER)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    return handler(req, res);
  };
};