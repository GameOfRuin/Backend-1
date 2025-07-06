import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'Login information' })
export class LoginInfoEntity extends Model {
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
  })
  public time: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public ip: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: true,
  })
  public success: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  failReason?: string;
}
