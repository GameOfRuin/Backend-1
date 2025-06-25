import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto, SortDirectionEnum } from '../../../shared';

export enum TaskSortByEnum {
  id = 'id',
  title = 'title',
  description = 'description',
  status = 'progress',
}

export class GetTaskListDto extends PaginationDto {
  @IsEnum(TaskSortByEnum)
  @IsOptional()
  sortBy: TaskSortByEnum = TaskSortByEnum.id;

  @IsEnum(SortDirectionEnum)
  @IsOptional()
  sortDirection: SortDirectionEnum = SortDirectionEnum.asc;

  @IsString()
  @IsOptional()
  search?: string;
}
