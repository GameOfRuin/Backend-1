import { IsString } from 'class-validator';

export class ApproveDto {
  @IsString()
  code: string;
}
