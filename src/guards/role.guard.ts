import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../modules/user/user.types';

export const RoleGuard =
  (requiredRole: UserRole) => (req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.user.role;

    if (userRole !== UserRole.admin && requiredRole === UserRole.admin) {
      throw new Error();
    }

    next();
  };
