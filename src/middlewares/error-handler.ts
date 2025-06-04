import { NextFunction, Request, Response } from 'express';
import logger from '../logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  res.status(500).json({ status: 'error', message: err.message });
};
