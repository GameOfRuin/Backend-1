import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserRoleEnum } from '../../modules/user/user.types';

@Table({ tableName: 'users' })
export class UserEntity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  public id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: true,
  })
  public isActive: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: UserRoleEnum.user,
  })
  public role: UserRoleEnum;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public password: string;
}
