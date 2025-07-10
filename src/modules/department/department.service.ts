import { inject, injectable } from 'inversify';
import { UserEntity } from '../../database';
import { DepartmentEntity } from '../../database/entities/department.entity';
import { ConflictException } from '../../exceptions';
import logger from '../../logger';
import { NEW_DEPARTMENT_QUEUE } from '../../message-broker/rabbitmq.queues';
import { RabbitMqService } from '../../message-broker/rabbitmq.service';
import { NewDepartmentMessage } from './department.types';
import { CreateDepartmentDto } from './dto';

@injectable()
export class DepartmentService {
  constructor(
    @inject(RabbitMqService)
    private readonly rabbitMqService: RabbitMqService,
  ) {}

  async createDepartment(dto: CreateDepartmentDto, name: UserEntity['name']) {
    logger.info(`Пришел запрос на создание департамента`);

    const department = await DepartmentEntity.findOne({ where: { title: dto.title } });
    if (department) {
      throw new ConflictException('Такой департамент уже существует');
    }

    const newDepartment = await DepartmentEntity.create({ ...dto });

    const message: NewDepartmentMessage = {
      title: newDepartment.title,
      name: name,
    };

    await this.rabbitMqService.channel.sendToQueue(NEW_DEPARTMENT_QUEUE, message);

    return newDepartment;
  }

  async getAllDepartments() {
    logger.info(`Запрос департаментов`);

    return await DepartmentEntity.findAll({
      order: ['id'],
    });
  }

  async deleteDepartment(id: DepartmentEntity['id']) {
    logger.info(`Удаление департамента id = ${id}`);

    await DepartmentEntity.destroy({ where: { id } });

    return { message: 'Департамент удален' };
  }
}
