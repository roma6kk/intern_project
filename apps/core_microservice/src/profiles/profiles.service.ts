import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { FilesService } from '../files/files.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

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

  async getProfileByUsername(username: string) {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: {
          user: {
            deletedAt: null,
            account: {
              username,
            },
          },
        },
        include: {
          user: {
            include: {
              account: { select: { username: true } },
            },
          },
        },
      });

      if (!profile) {
        this.logger.warn(`Profile for username ${username} not found`);
        throw new NotFoundException('Profile not found');
      }

      return profile;
    } catch (error) {
      this.logger.error(
        `Error fetching profile for username ${username}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async getSuggestions(userId: string, limit: number = 10) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId, status: 'ACCEPTED' },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);
    const excludeIds = [...followingIds, userId];

    const profiles = await this.prisma.profile.findMany({
      where: {
        userId: { notIn: excludeIds },
        user: { deletedAt: null },
      },
      take: limit * 2,
      include: {
        user: {
          include: {
            account: { select: { username: true } },
          },
        },
      },
    });

    const shuffled = profiles.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

  async searchProfiles(query: string) {
    return this.prisma.profile.findMany({
      where: {
        AND: [
          { user: { deletedAt: null } },
          {
            OR: [
              {
                user: {
                  account: {
                    username: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                firstName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      take: 5,
      include: {
        user: {
          include: {
            account: { select: { username: true } },
          },
        },
      },
    });
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
          birthday: dto.birthday ? new Date(dto.birthday) : undefined,
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

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only images are allowed',
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size too large. Maximum 5MB allowed');
    }

    try {
      await this.getMyProfile(userId);

      const avatarUrl = await this.filesService.uploadFile(file);

      const updatedProfile = await this.prisma.profile.update({
        where: { userId },
        data: {
          avatarUrl,
        },
      });

      this.logger.log(`Avatar for user ${userId} uploaded successfully`);
      return updatedProfile;
    } catch (error) {
      this.logger.error(
        `Error uploading avatar for user ${userId}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
