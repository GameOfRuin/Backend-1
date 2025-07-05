import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '../exceptions';
import { UserRoleEnum } from '../modules/user/user.types';

export const RoleGuard =
  (requiredRole: UserRoleEnum) => (req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.user.role;

    if (userRole !== UserRoleEnum.admin && requiredRole === UserRoleEnum.admin) {
      throw new ForbiddenException('Пользователь не имеет прав');
    }

    next();
  };
