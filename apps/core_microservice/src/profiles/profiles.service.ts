import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../database/prisma.service';
import { FilesService } from '../files/files.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Prisma } from '@prisma/client';

type ProfileWithRelations = Prisma.ProfileGetPayload<{
  include: {
    user: {
      include: {
        account: { select: { username: true } };
      };
    };
  };
}>;

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async resolveAvatarUrl(
    avatarUrl: string | null,
  ): Promise<string | null> {
    if (!avatarUrl) return avatarUrl;
    return this.filesService.getReadableUrl(avatarUrl);
  }

  async getMyProfile(userId: string): Promise<ProfileWithRelations> {
    const cacheKey = `profile:${userId}`;

    const cachedProfile =
      await this.cacheManager.get<ProfileWithRelations>(cacheKey);
    if (cachedProfile) {
      const resolved = await this.resolveAvatarUrl(cachedProfile.avatarUrl);
      return {
        ...cachedProfile,
        avatarUrl: resolved,
      };
    }

    try {
      const profile: ProfileWithRelations | null =
        await this.prisma.profile.findUnique({
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

      await this.cacheManager.set(cacheKey, profile, 3600);
      this.logger.log(`Profile for user ${userId} cached`);
      const resolved = await this.resolveAvatarUrl(profile.avatarUrl);
      return {
        ...profile,
        avatarUrl: resolved,
      };
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

      const resolved = await this.resolveAvatarUrl(profile.avatarUrl);
      return {
        ...profile,
        avatarUrl: resolved,
      };
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
    const result = shuffled.slice(0, limit);
    // Convert avatarUrl to readable (signed) URL if needed
    return Promise.all(
      result.map(async (p) => ({
        ...p,
        avatarUrl: await this.resolveAvatarUrl(p.avatarUrl),
      })),
    );
  }

  async searchProfiles(query: string) {
    const profiles = await this.prisma.profile.findMany({
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
    return Promise.all(
      profiles.map(async (p) => ({
        ...p,
        avatarUrl: await this.resolveAvatarUrl(p.avatarUrl ?? null),
      })),
    );
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const exists = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Profile not found');

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

      await this.cacheManager.del(`profile:${userId}`);
      this.logger.log(`Cache invalidated for profile ${userId}`);
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
