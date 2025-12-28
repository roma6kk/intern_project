import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCurrentUser(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          account: {
            select: {
              email: true,
              username: true,
              phoneNumber: true,
            },
          },
          profile: true,
        },
      });

      if (!user) {
        this.logger.warn(`User with ID ${userId} not found`);
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Error fetching user ${userId}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
