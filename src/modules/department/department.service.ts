import { injectable } from 'inversify';
import { DepartmentEntity } from '../../database/entities/department.entity';
import { ConflictException } from '../../exceptions';
import logger from '../../logger';
import { PaginationDto } from '../../shared';
import { CreateDepartmentDto } from './dto';

@injectable()
export class DepartmentService {
  async createDepartment(dto: CreateDepartmentDto) {
    logger.info(`Пришел запрос на создание депортамента`);

    const department = await DepartmentEntity.findOne({ where: { title: dto.title } });
    if (department) {
      throw new ConflictException('Такой депортамент уже существует');
    }

    return await DepartmentEntity.create({ ...dto });
  }

  fetchComplexScript(dto: PaginationDto) {
    logger.info(`Пришел запрос на чтение сложных скриптов`);

    return { limit: `${dto.limit}` };
  }

  getScriptById(id: number) {
    logger.info(`Чтение скрипта по номеру=${id}`);

    return { message: `Вы пытаетесь получить скрипт номеру=${id}` };
  }
  getComplexScriptById(id: number) {
    logger.info(`Чтение сложного скрипта по номеру=${id}`);

    return { message: `Вы пытаетесь получить сложный скрипт по номеру=${id}` };
  }
}
