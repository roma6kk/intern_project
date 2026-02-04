import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { existsSync } from 'fs';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MailerService } from './mailer.service';
import { PrismaService } from './prisma.service';

const envPath = existsSync(join(process.cwd(), '.env'))
  ? join(process.cwd(), '.env')
  : join(__dirname, '..', '..', '.env');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, MailerService, PrismaService],
})
export class AppModule {}