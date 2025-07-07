import { inject, injectable } from 'inversify';
import { Telegraf } from 'telegraf';
import { redisUserToken } from '../../cache/redis.keys';
import { RedisService } from '../../cache/redis.service';
import { UserEntity } from '../../database';
import logger from '../../logger';

@injectable()
export class TelegramService {
  private readonly bot: Telegraf;

  constructor(
    @inject(RedisService)
    private readonly redis: RedisService,
  ) {
    this.bot = new Telegraf('7800520704:AAFEGPXl67XwGrp_8BHwEz62jWGgZOdXhMs');
    this.initializeBot();
  }

  async initializeBot() {
    if (!this.bot) {
      logger.warn('Telegram token is not set, bot is not started');
      return;
    }
    this.bot.start(async (ctx) => {
      const startPayLoad = ctx.startPayload;

      if (startPayLoad) {
        const redis = await this.redis.get(redisUserToken(startPayLoad));
        if (redis) {
          const exist = await UserEntity.findOne({ where: { id: redis.id } });
          if (exist) {
            await UserEntity.update(
              { telegramId: ctx.chat.id },
              { where: { id: redis.id } },
            );
            await ctx.reply(`Привет ${exist.name}`);
          }
        }
      } else {
        await ctx.reply('Обычный старт');
      }
    });

    this.bot.command('test', (ctx) => ctx.reply('Ответ на команду test!'));
    this.bot.command('help', (ctx) => ctx.reply('Ответ на команду help!'));

    this.bot.launch();
    logger.info('Запуск бота');
  }

  public async sendTelegramMessage(ctx: string) {
    await this.bot.telegram.sendMessage(5609915965, ctx);
  }

  public async sendTelegramLink(token: string) {}
}
