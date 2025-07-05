import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export enum TaskStatus {
  progress = 'progress',
  waiting = 'waiting',
  cancelled = 'cancelled',
}

export enum TaskImportance {
  high = 'high',
  middle = 'middle',
  low = 'low',
}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsEnum(TaskImportance)
  importance: TaskImportance;

  @IsString()
  @MaxLength(256)
  description: string;

  @IsNumber()
  authoredId: number;

  @IsNumber()
  @IsOptional()
  assigneeId?: number;
}
