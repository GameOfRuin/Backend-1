import { UserEntity } from '../../database';

export enum UserRoleEnum {
  user = 'user',
  admin = 'admin',
}

export type NewRegistrationMessage = {
  id: UserEntity['id'];
  email: UserEntity['email'];
  name: UserEntity['name'];
};
export type MailConfirmation = {
  code: string;
  email: UserEntity['email'];
};
