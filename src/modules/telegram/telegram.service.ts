import { injectable } from 'inversify';
import { Telegraf } from 'telegraf';
import logger from '../../logger';

@injectable()
export class TelegramService {
  private readonly bot: Telegraf;

  constructor() {
    this.bot = new Telegraf('7800520704:AAFEGPXl67XwGrp_8BHwEz62jWGgZOdXhMs');
    this.initializeBot();
  }

  async initializeBot() {
    if (!this.bot) {
      logger.warn('Telegram token is not set, bot is not started');
      return;
    }
    this.bot.start((ctx) => ctx.reply('Welcome'));

    this.bot.command('test', (ctx) => ctx.reply('Ответ на команду test!'));
    this.bot.command('help', (ctx) => ctx.reply('Ответ на команду help!'));

    this.bot.launch();
    logger.info('Запуск бота');
  }

  public async sendTelegramMessage(ctx: string) {
    await this.bot.telegram.sendMessage(5609915965, ctx);
  }
}
