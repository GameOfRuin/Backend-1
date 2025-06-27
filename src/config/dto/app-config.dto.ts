import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { PostgresConfigDto } from './postgres-config.dto';

export class AppConfigDto {
  @IsNumber()
  @Type(() => Number)
  port: number;

  @IsString()
  redisUrl: string;

  @ValidateNested()
  @Transform(({ value }) => plainToInstance(PostgresConfigDto, value))
  postgres: PostgresConfigDto;
}
