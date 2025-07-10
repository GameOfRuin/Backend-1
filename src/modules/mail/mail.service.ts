import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { appConfig } from '../../config';

@injectable()
export class MailService {
  private readonly transporter = nodemailer.createTransport({
    service: 'yandex',
    host: 'smtp.yandex.ru',
    port: 587,
    secure: false,
    auth: { user: appConfig.smtp.user, pass: appConfig.smtp.pass },
  });

  public async sendMail(options: Omit<Mail.Options, 'from'>) {
    return this.transporter.sendMail({
      ...options,
      from: `${appConfig.smtp.user}@yandex.ru`,
    });
  }
}
