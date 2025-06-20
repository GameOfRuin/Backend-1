import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
}
