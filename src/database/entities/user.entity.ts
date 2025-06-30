import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserRole } from '../../modules/user/user.types';

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
    defaultValue: UserRole.user,
  })
  public role: UserRole;

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
