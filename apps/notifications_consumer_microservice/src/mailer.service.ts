import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;

    this.logger.log(`SMTP Config: ${host} (${user})`);

    this.transporter = nodemailer.createTransport({
      host: host,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: user,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000, 
      socketTimeout: 10000, 
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      this.logger.log(`Attempting to send email to ${to}...`);
      
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
      });
      
      this.logger.log(`Email sent! Message ID: ${info.messageId}`);
      this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error; 
    }
  }
}