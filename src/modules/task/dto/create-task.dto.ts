import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

enum TaskStatus {
  progress = 'progress',
  waiting = 'waiting',
  cancelled = 'cancelled',
}

enum TaskImportance {
  high = 'high',
  middle = 'middle',
  low = 'low',
}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsEnum(TaskStatus)
  status: string;

  @IsEnum(TaskImportance)
  importance: string;

  @IsString()
  @MaxLength(256)
  description: string;

  @IsNumber()
  @IsOptional()
  assigneeId?: number;
}
