import { config as readEnv } from 'dotenv';
import * as process from 'node:process';
import { validate } from '../validate';
import { AppConfigDto } from './dto';

readEnv();

const rawConfig = {
  port: process.env.PORT,
  redisUrl: process.env.REDIS_URL,
  rabbitUrl: process.env.RABBIT_URL,
  telegramToken: process.env.TELEGRAM_TOKEN,
  postgres: {
    host: process.env.POSTGRESQL_HOST,
    database: process.env.POSTGRESQL_DATABASE,
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    port: process.env.POSTGRESQL_PORT,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
};

export const appConfig = validate(AppConfigDto, rawConfig);
