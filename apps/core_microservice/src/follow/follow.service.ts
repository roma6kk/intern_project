import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FollowService {
  private readonly logger = new Logger(FollowService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createFollowDto: CreateFollowDto) {
    try {
      const follow = await this.prisma.follow.create({
        data: {
          followerId: createFollowDto.followerId,
          followingId: createFollowDto.followingId,
        },
      });

      this.logger.log(
        `Follow created successfully. User ${follow.followerId} is now following ${follow.followingId}`,
      );
      return follow;
    } catch (error) {
      this.logger.error('Failed to create follow', (error as Error).stack);
      throw error;
    }
  }

  async findAll() {
    const follows = await this.prisma.follow.findMany();
    this.logger.log(`Retrieved ${follows.length} follow records`);
    return follows;
  }

  async findOne(id: string) {
    const follow = await this.prisma.follow.findUnique({
      where: { id },
    });

    if (!follow) {
      this.logger.warn(`Follow record with ID ${id} not found`);
      throw new NotFoundException('Follow record not found');
    }

    return follow;
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      const deletedFollow = await this.prisma.follow.delete({
        where: { id },
      });

      this.logger.log(`Follow record ${id} removed successfully`);
      return deletedFollow;
    } catch (error) {
      this.logger.error(
        `Failed to remove follow record ${id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
