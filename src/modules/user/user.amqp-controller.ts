import { inject, injectable } from 'inversify';
import logger from '../../logger';
import { NEW_REGISTRATION_QUEUE } from '../../message-broker/rabbitmq.queues';
import { RabbitMqService } from '../../message-broker/rabbitmq.service';
import { TelegramService } from '../telegram/telegram.service';
import { UserService } from './user.service';
import { NewRegistrationMessage } from './user.types';

@injectable()
export class UserAmqpController {
  constructor(
    @inject(RabbitMqService)
    private readonly rabbitMqService: RabbitMqService,
    @inject(UserService)
    private readonly userService: UserService,
    @inject(TelegramService)
    private readonly telegramService: TelegramService,
  ) {
    this.assertHandler();
  }

  async assertHandler() {
    await this.rabbitMqService.channel.waitForConnect();
    await this.rabbitMqService.channel.consume(
      NEW_REGISTRATION_QUEUE,
      (data) =>
        this.handleNewRegistrationQueue(JSON.parse(data.content.toString('utf-8'))),
      {
        noAck: true, // Акаем автоматически
        prefetch: 2, // Параллельно обрабатываем макс 2 задачи
      },
    );
  }

  async handleNewRegistrationQueue(data: NewRegistrationMessage) {
    const { id, name, email } = data;
    const message = `Новая регистрация id=${id} name=${name} email=${email}`;
    logger.info(message);

    await this.telegramService.sendTelegramMessage(message);
  }
}
