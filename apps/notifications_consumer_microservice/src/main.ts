import { join } from 'path';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

const envPath = existsSync(join(process.cwd(), '.env'))
  ? join(process.cwd(), '.env')
  : join(__dirname, '..', '..', '.env');

config({ path: envPath });

async function bootstrap() {
  const logger = new Logger('NotificationsConsumer');
  
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
    logger.log(`Connecting to RabbitMQ at ${rabbitmqUrl}`);
    logger.log(`Listening to queue: notifications_queue`);
    
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [rabbitmqUrl],
          queue: 'notifications_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    );
    
    await app.listen();
    logger.log('Notifications Consumer Microservice is listening for messages...');
  } catch (error) {
    logger.error('Failed to start Notifications Consumer Microservice', (error as Error).stack);
    process.exit(1);
  }
}

bootstrap();