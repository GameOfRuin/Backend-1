import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'department' })
export class DepartmentEntity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  public id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public title: string;
}
