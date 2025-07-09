import { inject, injectable } from 'inversify';
import { NEW_DEPARTMENT_QUEUE } from '../../message-broker/rabbitmq.queues';
import { RabbitMqService } from '../../message-broker/rabbitmq.service';
import { TelegramService } from '../telegram/telegram.service';
import { UserService } from '../user/user.service';
import { NewDepartmentMessage } from './department.types';

@injectable()
export class DepartmentAmqpController {
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
      NEW_DEPARTMENT_QUEUE,
      (data) => this.sendNewDepartamintQueue(JSON.parse(data.content.toString('utf-8'))),
      {
        noAck: true, // Акаем автоматически
        prefetch: 2, // Параллельно обрабатываем макс 2 задачи
      },
    );
  }

  async sendNewDepartamintQueue(data: NewDepartmentMessage) {
    const { name, title } = data;
    const message = `Пользователь ${name} создал новый департамент ${title}`;

    const allAdmins = await this.userService.getAllAdminsTelegramId();

    for (const admin of allAdmins) {
      await this.telegramService.sendTelegramMessage(admin.telegramId, message);
    }
  }
}
