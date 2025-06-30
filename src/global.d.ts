import { UserEntity } from './database';

declare global {
  namespace Express {
    interface Locals {
      user: UserEntity;
    }
  }
}
