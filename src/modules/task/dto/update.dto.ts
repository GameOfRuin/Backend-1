import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskImportance, TaskStatus } from './create-task.dto';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;

  @IsEnum(TaskImportance)
  @IsOptional()
  importance: TaskImportance;

  @IsString()
  @MaxLength(256)
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  assigneeId?: number;
}
