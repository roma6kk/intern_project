import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    try {
      const profile = await this.prisma.profile.create({
        data: {
          userId: createProfileDto.userId,
          firstName: createProfileDto.firstName,
          secondName: createProfileDto.secondName,
          bio: createProfileDto.bio,
          avatarUrl: createProfileDto.avatarUrl,
          birthday: createProfileDto.birthday,
        },
      });

      this.logger.log(
        `Profile for user ${createProfileDto.userId} created successfully.`,
      );
      return profile;
    } catch (error) {
      this.logger.error(`Failed to create profile`, (error as Error).stack);
      throw error;
    }
  }

  async findAll() {
    const profiles = await this.prisma.profile.findMany({
      include: {
        user: {
          include: { account: { select: { username: true } } },
        },
      },
    });
    this.logger.log(`Retrieved ${profiles.length} profiles`);
    return profiles;
  }

  async findByUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    if (!user || !user.profile) {
      this.logger.warn(`Profile for user ${userId} not found`);
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    return {
      ...user.profile,
      metrics: user._count,
    };
  }

  async updateByUser(userId: string, updateProfileDto: UpdateProfileDto) {
    this.logger.log(`Attempting to update profile for user: ${userId}`);
    await this.findByUser(userId);

    try {
      const updatedProfile = await this.prisma.profile.update({
        where: {
          userId: userId,
        },
        data: {
          firstName: updateProfileDto.firstName,
          secondName: updateProfileDto.secondName,
          bio: updateProfileDto.bio,
          avatarUrl: updateProfileDto.avatarUrl,
          birthday: updateProfileDto.birthday,
        },
      });

      this.logger.log(`Profile for user ${userId} updated successfully`);
      return updatedProfile;
    } catch (error) {
      this.logger.error(
        `Failed to update profile for user ${userId}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async removeByUser(userId: string) {
    this.logger.log(`Attempting to remove profile for user: ${userId}`);
    await this.findByUser(userId);

    try {
      const deletedProfile = await this.prisma.profile.delete({
        where: {
          userId: userId,
        },
      });

      this.logger.log(`Profile for user ${userId} removed successfully`);
      return deletedProfile;
    } catch (error) {
      this.logger.error(
        `Failed to remove profile for user ${userId}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
