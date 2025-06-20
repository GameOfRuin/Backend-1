import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class IdNumberDto {
  @IsNumber()
  @Type(() => Number)
  id: number;
}
export class PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit: number = 10;

  @IsNumber()
  @Type(() => Number)
  offset: number = 10;
}
