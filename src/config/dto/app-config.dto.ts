import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { JwtConfigDto } from './jwt-config.dto';
import { PostgresConfigDto } from './postgres-config.dto';

export class AppConfigDto {
  @IsNumber()
  @Type(() => Number)
  port: number;

  @IsString()
  redisUrl: string;

  @IsString()
  rabbitUrl: string;

  @ValidateNested()
  @Transform(({ value }) => plainToInstance(PostgresConfigDto, value))
  postgres: PostgresConfigDto;

  @ValidateNested()
  @Transform(({ value }) => plainToInstance(JwtConfigDto, value))
  jwt: JwtConfigDto;
}
