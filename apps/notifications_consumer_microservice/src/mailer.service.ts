import { Injectable, Logger } from '@nestjs/common'; // Используем Logger NestJS
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;

    this.logger.log(`Configuring SMTP: Host=${host}, User=${user}`);

    if (!host || !user) {
      this.logger.error('SMTP config is missing! Check .env file.');
    }

    this.transporter = nodemailer.createTransport({
      host: host, 
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: user,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Innogram" <no-reply@innogram.com>',
        to,
        subject,
        text,
      });
      this.logger.log(`Email sent: ${info.messageId}`);
      this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }
}