import { DepartmentEntity, UserEntity } from '../../database';

export type NewDepartmentMessage = {
  name: UserEntity['name'];
  title: DepartmentEntity['title'];
};
