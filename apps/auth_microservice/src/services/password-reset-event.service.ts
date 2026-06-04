import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqplib from 'amqplib';
import { Channel, ChannelModel } from 'amqplib';

interface PasswordResetEmailEvent {
  email: string;
  code: string;
  username: string;
}

@Injectable()
export class PasswordResetEventService {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private readonly queueName = 'notifications_queue';
  private readonly eventName = 'password_reset_requested';

  constructor(private readonly configService: ConfigService) {}

  private async getChannel(): Promise<Channel> {
    if (this.channel) {
      return this.channel;
    }

    const rabbitMqUrl =
      this.configService.get<string>('RABBITMQ_URL') ??
      'amqp://guest:guest@rabbitmq:5672';
    this.connection = await amqplib.connect(rabbitMqUrl);
    const channel = await this.connection.createChannel();
    this.channel = channel;
    await channel.assertQueue(this.queueName, { durable: false });

    return channel;
  }

  async publishPasswordResetEmail(
    payload: PasswordResetEmailEvent,
  ): Promise<void> {
    const channel = await this.getChannel();
    const message = Buffer.from(
      JSON.stringify({
        pattern: this.eventName,
        data: payload,
      }),
    );

    channel.sendToQueue(this.queueName, message, {
      contentType: 'application/json',
      persistent: false,
    });
  }
}
