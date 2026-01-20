import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { userId },
        include: {
          user: {
            include: {
              account: { select: { username: true } },
            },
          },
        },
      });

      if (!profile) {
        this.logger.warn(`Profile for user ${userId} not found`);
        throw new NotFoundException('Profile not found');
      }

      return profile;
    } catch (error) {
      this.logger.error(
        `Error fetching profile for user ${userId}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.getMyProfile(userId);

    try {
      const updatedProfile = await this.prisma.profile.update({
        where: { userId },
        data: {
          firstName: dto.firstName,
          secondName: dto.secondName,
          bio: dto.bio,
          avatarUrl: dto.avatarUrl,
          isPrivate: dto.isPrivate,
        },
      });

      this.logger.log(`Profile for user ${userId} updated successfully`);
      return updatedProfile;
    } catch (error) {
      this.logger.error(
        `Error updating profile for user ${userId}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
