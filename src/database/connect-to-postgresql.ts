import { Sequelize } from 'sequelize-typescript';
import { appConfig } from '../config';
import logger from '../logger';
import { DepartmentEntity } from './entities/department.entity';
import { TaskEntity } from './entities/task.entity';
import { UserEntity } from './entities/user.entity';

export const connectToPostgresql = async () => {
  const sequelize = new Sequelize({
    ...appConfig.postgres,
    dialect: 'postgres',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    logger.info('Successfully connected to PostgreSQL');
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL:');
    logger.error(error);
    throw error;
  }

  sequelize.addModels([UserEntity, TaskEntity, DepartmentEntity]);

  await sequelize.sync({ alter: true });
};
