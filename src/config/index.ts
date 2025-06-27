import { config as readEnv } from 'dotenv';
import * as process from 'node:process';
import { validate } from '../validate';
import { AppConfigDto } from './dto';

readEnv();

const rawConfig = {
  port: process.env.PORT,
  redisUrl: process.env.REDIS_URL,
  postgres: {
    host: process.env.POSTGRESQL_HOST,
    database: process.env.POSTGRESQL_DATABASE,
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    port: process.env.POSTGRESQL_PORT,
  },
};

export const appConfig = validate(AppConfigDto, rawConfig);
