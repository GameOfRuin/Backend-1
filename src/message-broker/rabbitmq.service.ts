import { connect } from 'amqp-connection-manager';
import { appConfig } from '../config';
import logger from '../logger';
import { RABBIT_MQ_QUEUES } from './rabbitmq.queues';

export class RabbitMqService {
  private readonly connection = connect(appConfig.rabbitUrl);
  public readonly channel = this.connection.createChannel({ json: true });

  constructor() {
    this.init();
  }

  async init() {
    try {
      await this.connection.connect({ timeout: 3000 });
      await this.channel.waitForConnect();

      for (const rabbitmqqueue of RABBIT_MQ_QUEUES) {
        await this.channel.assertQueue(rabbitmqqueue, { durable: true });
      }
    } catch (error) {
      logger.error('Rabbitmq connection error', error);
      throw error;
    }

    logger.info('Rabbitmq connection ready');
  }
}
