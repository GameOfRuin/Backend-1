import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validation = <T extends object, D>(ValidationRules: new () => T, data: D) => {
  const dto: T = plainToInstance(ValidationRules, data);
  const errors = validateSync(dto);

  if (errors.length) {
    const [{ constraints }] = errors;

    if (constraints) {
      throw new Error(constraints[Object.keys(constraints)[0]]);
    }
    throw new Error('Unknown validation error');
  }
  return dto;
};
