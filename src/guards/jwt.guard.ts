import { NextFunction, Request, Response } from 'express';
import { UserEntity } from '../database';
import { JwtService } from '../modules/jwt/jwt.service';

export const JwtGuard =
  (jwtService: JwtService) => async (req: Request, res: Response, next: NextFunction) => {
    // Get 'Authorization' header
    const authorization = req.headers['authorization'];
    if (!authorization) {
      throw new Error('Unauthorized');
    }

    // Extract schema and token from header
    const [schema, token] = authorization.split(' ');
    if (schema !== 'Bearer' || !token) {
      throw new Error('Unauthorized');
    }

    // Verify token
    const valid = jwtService.verify(token, 'access');
    if (!valid) {
      throw new Error('Unauthorized');
    }

    // Decode token
    const payload = jwtService.decode(token);

    // Find user by credentials from token
    const user = await UserEntity.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new Error('Unauthorized');
    }

    res.locals.user = user;

    next();
  };
