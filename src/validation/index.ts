import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { BadRequestException } from '../exceptions';

export const validate = <T extends object, D>(ValidationRules: new () => T, data: D) => {
  const dto: T = plainToInstance(ValidationRules, data);
  const errors = validateSync(dto);

  if (errors.length) {
    const [{ constraints }] = errors;

    if (constraints) {
      throw new BadRequestException(constraints[Object.keys(constraints)[0]]);
    }
    throw new BadRequestException('Unknown validation error');
  }
  return dto;
};
