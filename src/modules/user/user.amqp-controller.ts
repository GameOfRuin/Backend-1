import { inject, injectable } from 'inversify';
import logger from '../../logger';
import {
  EMAIL_CONFIRMATION_QUEUE,
  NEW_REGISTRATION_QUEUE,
  PASSWORD_RESTORE_QUEUE,
} from '../../message-broker/rabbitmq.queues';
import { RabbitMqService } from '../../message-broker/rabbitmq.service';
import { MailService } from '../mail/mail.service';
import { TelegramService } from '../telegram/telegram.service';
import { UserService } from './user.service';
import {
  MailConfirmationAndPasswordRestoreMessage,
  NewRegistrationMessage,
} from './user.types';

@injectable()
export class UserAmqpController {
  constructor(
    @inject(RabbitMqService)
    private readonly rabbitMqService: RabbitMqService,
    @inject(UserService)
    private readonly userService: UserService,
    @inject(TelegramService)
    private readonly telegramService: TelegramService,
    @inject(MailService)
    private readonly mailService: MailService,
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
    await this.rabbitMqService.channel.consume(
      EMAIL_CONFIRMATION_QUEUE,
      (data) => this.emailConfirmationQueue(JSON.parse(data.content.toString('utf-8'))),
      {
        noAck: true, // Акаем автоматически
        prefetch: 2, // Параллельно обрабатываем макс 2 задачи
      },
    );
    await this.rabbitMqService.channel.consume(
      PASSWORD_RESTORE_QUEUE,
      (data) => this.passwordRestoreQueue(JSON.parse(data.content.toString('utf-8'))),
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

    const allAdmins = await this.userService.getAllAdminsTelegramId();

    for (const admin of allAdmins) {
      await this.telegramService.sendTelegramMessage(admin.telegramId, message);
    }
  }

  async emailConfirmationQueue(data: MailConfirmationAndPasswordRestoreMessage) {
    const { code, email } = data;
    const text = `Ваш код подтверждения ${code}`;
    const to = `${email}`;
    const subject = 'Подтверждение почты';
    logger.info(text);

    const options = { text, subject, to };

    await this.mailService.sendMail(options);
  }

  async passwordRestoreQueue(data: MailConfirmationAndPasswordRestoreMessage) {
    const { code, email } = data;
    const text = `Ваш код для восстановления пароля ${code}`;
    const to = `${email}`;
    const subject = 'Восстановление пароля';
    logger.info(text);

    const options = { text, subject, to };

    await this.mailService.sendMail(options);
  }
}
