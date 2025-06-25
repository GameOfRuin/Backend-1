import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserEntity } from './user.entity';

@Table({ tableName: 'task' })
export class TaskEntity extends Model {
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
  public title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public importance: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public description: string;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  public assigneeId: number;

  @BelongsTo(() => UserEntity, { as: 'assignee', foreignKey: 'assigneeId' })
  public assignee: UserEntity;
}
