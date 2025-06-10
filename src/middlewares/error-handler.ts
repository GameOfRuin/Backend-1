import { NextFunction, Request, Response } from 'express';
import logger from '../logger';

export const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err);

  const isCustomError = Boolean(err.code);

  res.status(isCustomError ? err.code : 500).json({
    status: 'error',
    message: isCustomError ? err.message : 'Internal Server Error',
  });
};
