import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private readonly prisma: PrismaService) {}

  private hash(password: string): string {
    return password;
  }

  findAll() {
    return this.prisma.account.findMany();
  }

  async findByUser(userId: string) {
    const account = await this.prisma.account.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!account) {
      this.logger.warn(`Account for user ${userId} not found`);
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async updateByUserId(userId: string, updateAccountDto: UpdateAccountDto) {
    await this.findByUser(userId);

    let newHash: string | undefined = undefined;
    if (updateAccountDto.password) {
      newHash = this.hash(updateAccountDto.password);
    }

    try {
      const updatedAccount = await this.prisma.account.update({
        where: {
          userId: userId,
        },
        data: {
          username: updateAccountDto.username ?? undefined,
          email: updateAccountDto.email ?? undefined,
          phoneNumber: updateAccountDto.phoneNumber ?? undefined,
          passwordHash: newHash,
        },
      });

      this.logger.log(`Account for user ${userId} updated successfully`);
      return updatedAccount;
    } catch (error) {
      this.logger.error(
        `Failed to update account for user ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  async removeByUser(userId: string) {
    await this.findByUser(userId);

    try {
      const deletedAccount = await this.prisma.account.delete({
        where: {
          userId: userId,
        },
      });

      this.logger.log(`Account for user ${userId} removed successfully`);
      return deletedAccount;
    } catch (error) {
      this.logger.error(
        `Failed to remove account for user ${userId}`,
        error.stack,
      );
      throw error;
    }
  }
}
