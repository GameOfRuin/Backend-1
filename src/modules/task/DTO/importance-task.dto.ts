import { IsEnum } from 'class-validator';

enum StatusTask {
  progress = 'progress',
  waiting = 'waiting',
  cancelled = 'cancelled',
}

enum ImportanceTask {
  High = 'high',
  Middle = 'middle',
  Low = 'low',
}

export class IsEnumStatusDto {
  @IsEnum(StatusTask)
  status: string;

  @IsEnum(ImportanceTask)
  importance: string;
}
