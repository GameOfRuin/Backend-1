import { Sequelize } from 'sequelize-typescript';
import { postgresConfig } from '../config';
import logger from '../logger';
import { TaskEntity } from './entities/task.entity';
import { UserEntity } from './entities/user.entity';

export const connectToPostgresql = async () => {
  const sequelize = new Sequelize({
    ...postgresConfig,
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

  sequelize.addModels([UserEntity, TaskEntity]);

  await sequelize.sync({ alter: true });
};
