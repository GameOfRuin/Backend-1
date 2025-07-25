import { NextFunction, Request, Response } from 'express';
import { UserEntity } from '../database';
import { UnauthorizedException } from '../exceptions';
import { JwtService } from '../modules/jwt/jwt.service';

export const JwtGuard =
  (jwtService: JwtService) => async (req: Request, res: Response, next: NextFunction) => {
    // Get 'Authorization' header
    const authorization = req.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Extract schema and token from header
    const [schema, token] = authorization.split(' ');
    if (schema !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Verify token
    const valid = jwtService.verify(token, 'access');
    if (!valid) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Decode token
    const payload = jwtService.decode(token);

    // Find user by credentials from token
    const user = await UserEntity.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    res.locals.user = user;

    next();
  };
