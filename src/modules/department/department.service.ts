import { injectable } from 'inversify';
import { DepartmentEntity } from '../../database/entities/department.entity';
import { ConflictException, NotFoundException } from '../../exceptions';
import logger from '../../logger';
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

  async getAllDepartments() {
    logger.info(`Запрос депортаментв`);

    const department = await DepartmentEntity.findAll({
      order: ['id'],
    });

    if (!department) {
      throw new NotFoundException('Еще не создано ни одного департамента');
    }

    return department;
  }

  async deleteDepartment(id: DepartmentEntity['id']) {
    logger.info(`Удаление депортамента id = ${id}`);

    await DepartmentEntity.destroy({ where: { id: id } });

    return { massage: 'Депортамент удален' };
  }
}
