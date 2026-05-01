import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { FilesService } from '../files/files.service';
import { Prisma } from '@prisma/client';
import { ChatService } from '../chat/chat.service';
import { MessageService } from '../message/message.service';
import { ALLOWED_STORY_REACTION_SET } from './story-reaction.constants';

const STORY_TTL_MS = 24 * 60 * 60 * 1000;
const STORY_REPLY_PREFIX = '[story-reply]';

type StoryWithRelations = Prisma.StoryGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        deletedAt: true;
        account: { select: { username: true } };
        profile: { select: { firstName: true; avatarUrl: true; isPrivate: true } };
      };
    };
    assets: true;
  };
}>;

@Injectable()
export class StoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  private now() {
    return new Date();
  }

  private expiresAtFrom(now: Date) {
    return new Date(now.getTime() + STORY_TTL_MS);
  }

  private async isAcceptedFollower(viewerId: string, authorId: string) {
    if (viewerId === authorId) return true;
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: viewerId,
          followingId: authorId,
        },
      },
      select: { status: true },
    });
    return follow?.status === 'ACCEPTED';
  }

  private async isExcluded(viewerId: string, authorId: string) {
    const row = await this.prisma.storyExclusion.findUnique({
      where: {
        authorId_excludedUserId: {
          authorId,
          excludedUserId: viewerId,
        },
      },
      select: { id: true },
    });
    return !!row;
  }

  private async assertCanViewStory(viewerId: string, story: StoryWithRelations) {
    if (story.author.deletedAt) {
      throw new NotFoundException('Story not found');
    }
    const isOwner = viewerId === story.authorId;
    // Hidden stories are invisible to everyone except the author (manage / unhide).
    if (story.isHidden && !isOwner) {
      throw new NotFoundException('Story not found');
    }
    const isExpired = story.expiresAt <= this.now();
    if (isExpired && !isOwner) {
      throw new NotFoundException('Story not found');
    }

    if (await this.isExcluded(viewerId, story.authorId)) {
      throw new ForbiddenException('You are not allowed to view these stories');
    }

    const isPrivate = story.author.profile?.isPrivate ?? false;
    if (!isPrivate) {
      return;
    }
    const ok = await this.isAcceptedFollower(viewerId, story.authorId);
    if (!ok) {
      throw new ForbiddenException('This profile is private');
    }
  }

  async create(
    authorId: string,
    caption: string | undefined,
    files: Array<Express.Multer.File> | undefined,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Story must have at least one file');
    }
    if (files.length > 1) {
      throw new BadRequestException('Maximum 1 file per story');
    }

    const now = this.now();
    const expiresAt = this.expiresAtFrom(now);

    const uploaded = await Promise.all(
      files.map(async (f) => ({
        url: await this.filesService.uploadFile(f),
        type: f.mimetype.startsWith('video/') ? ('VIDEO' as const) : ('IMAGE' as const),
      })),
    );

    const story = await this.prisma.story.create({
      data: {
        authorId,
        caption: caption?.trim() || null,
        expiresAt,
        assets: {
          create: uploaded.map((a) => ({ url: a.url, type: a.type })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            deletedAt: true,
            account: { select: { username: true } },
            profile: { select: { firstName: true, avatarUrl: true, isPrivate: true } },
          },
        },
        assets: true,
      },
    });

    return this.withReadableAssetUrls(story);
  }

  async getMe(userId: string, status: 'active' | 'expired' = 'active') {
    const now = this.now();
    const where: Prisma.StoryWhereInput = {
      authorId: userId,
      author: { deletedAt: null },
    };
    if (status === 'active') {
      where.expiresAt = { gt: now };
      // Owner sees both visible and hidden active stories (feed still filters isHidden for others).
    } else {
      where.expiresAt = { lte: now };
    }

    const list = await this.prisma.story.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        author: {
          select: {
            id: true,
            deletedAt: true,
            account: { select: { username: true } },
            profile: { select: { firstName: true, avatarUrl: true, isPrivate: true } },
          },
        },
        assets: true,
        _count: { select: { views: true, reactions: true } },
      },
    });

    return this.withReadableAssetUrls(list);
  }

  async getFeed(viewerId: string) {
    const now = this.now();
    const acceptedFollowing = await this.prisma.follow.findMany({
      where: { followerId: viewerId, status: 'ACCEPTED' },
      select: { followingId: true },
    });
    const followedAuthorIds = acceptedFollowing.map((f) => f.followingId);

    const stories = await this.prisma.story.findMany({
      where: {
        expiresAt: { gt: now },
        isHidden: false,
        authorId: { in: followedAuthorIds },
        author: {
          deletedAt: null,
          storyExclusionsAuthored: {
            none: { excludedUserId: viewerId },
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        author: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: { select: { firstName: true, avatarUrl: true, isPrivate: true } },
          },
        },
        assets: true,
        views: {
          where: { viewerId },
          select: { id: true },
        },
      },
    });

    type FeedStory = {
      id: string;
      createdAt: Date;
      expiresAt: Date;
      caption: string | null;
      assets: Array<{ id: string; url: string; type: 'IMAGE' | 'VIDEO' }>;
      seen: boolean;
    };
    type FeedGroup = {
      author: {
        id: string;
        username: string;
        profile: {
          firstName: string | null;
          avatarUrl: string | null;
          isPrivate: boolean;
        };
      };
      stories: FeedStory[];
      hasUnseen: boolean;
      latestCreatedAt: Date;
    };

    const byAuthor = new Map<string, FeedGroup>();

    for (const s of stories) {
      const authorId = s.authorId;
      const author = s.author;
      const username =
        author?.account?.username ||
        author?.profile?.firstName ||
        'Unknown';

      const entry: FeedGroup =
        byAuthor.get(authorId) ??
        {
          author: {
            id: authorId,
            username,
            profile: {
              firstName: author?.profile?.firstName ?? null,
              avatarUrl: author?.profile?.avatarUrl ?? null,
              isPrivate: author?.profile?.isPrivate ?? false,
            },
          },
          stories: [],
          hasUnseen: false,
          latestCreatedAt: s.createdAt,
        };

      const seen = Array.isArray((s as unknown as { views?: unknown[] }).views) && (s as unknown as { views: unknown[] }).views.length > 0;

      const item: FeedStory = {
        id: s.id,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        caption: s.caption,
        assets: s.assets as Array<{ id: string; url: string; type: 'IMAGE' | 'VIDEO' }>,
        seen,
      };
      entry.stories.push(item);
      if (!seen) entry.hasUnseen = true;
      if (s.createdAt > entry.latestCreatedAt) entry.latestCreatedAt = s.createdAt;

      byAuthor.set(authorId, entry);
    }

    const grouped = [...byAuthor.values()].sort(
      (a, b) => b.latestCreatedAt.getTime() - a.latestCreatedAt.getTime(),
    );

    return this.withReadableAssetUrls(grouped);
  }

  async findOne(viewerId: string, storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: {
        author: {
          select: {
            id: true,
            deletedAt: true,
            account: { select: { username: true } },
            profile: { select: { firstName: true, avatarUrl: true, isPrivate: true } },
          },
        },
        assets: true,
      },
    });
    if (!story) throw new NotFoundException('Story not found');
    await this.assertCanViewStory(viewerId, story as StoryWithRelations);
    return this.withReadableAssetUrls(story);
  }

  async markViewed(viewerId: string, storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: {
        author: {
          select: {
            id: true,
            deletedAt: true,
            account: { select: { username: true } },
            profile: { select: { firstName: true, avatarUrl: true, isPrivate: true } },
          },
        },
        assets: true,
      },
    });
    if (!story) throw new NotFoundException('Story not found');
    await this.assertCanViewStory(viewerId, story as StoryWithRelations);
    if (story.expiresAt <= this.now()) {
      return { viewed: false, reason: 'expired' };
    }

    await this.prisma.storyView.upsert({
      where: { storyId_viewerId: { storyId, viewerId } },
      create: { storyId, viewerId },
      update: {},
    });
    return { viewed: true };
  }

  async setReaction(userId: string, storyId: string, emoji: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: {
        author: {
          select: {
            id: true,
            deletedAt: true,
            account: { select: { username: true } },
            profile: { select: { firstName: true, avatarUrl: true, isPrivate: true } },
          },
        },
        assets: true,
      },
    });
    if (!story) throw new NotFoundException('Story not found');
    await this.assertCanViewStory(userId, story as StoryWithRelations);
    if (story.expiresAt <= this.now()) {
      throw new BadRequestException('Cannot react to an expired story');
    }
    if (story.authorId === userId) {
      throw new BadRequestException('Cannot react to your own story');
    }

    const normalized = emoji.trim();
    if (!ALLOWED_STORY_REACTION_SET.has(normalized)) {
      throw new BadRequestException('Unsupported reaction');
    }

    const row = await this.prisma.storyReaction.create({
      data: { storyId, userId, emoji: normalized },
    });

    // Send reaction to DM with story author (like Instagram).
    const chat = await this.chatService.create(userId, {
      memberIds: [story.authorId],
      type: 'PRIVATE',
    });
    const firstAsset = (story.assets ?? [])[0];
    const assetUrl = firstAsset?.url
      ? await this.filesService.getReadableUrl(firstAsset.url)
      : '';
    const assetType = firstAsset?.type ?? 'IMAGE';
    const ref = `[story-reaction] storyId=${storyId} emoji=${normalized} assetUrl=${assetUrl} assetType=${assetType}`;
    await this.messageService.create(userId, {
      chatId: (chat as { id: string }).id,
      content: ref,
    });

    return row;
  }

  async deleteReaction(userId: string, storyId: string) {
    await this.prisma.storyReaction.deleteMany({
      where: { storyId, userId },
    });
    return { deleted: true };
  }

  async getViewers(authorId: string, storyId: string, page = 1, limit = 50) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, authorId: true },
    });
    if (!story) throw new NotFoundException('Story not found');
    if (story.authorId !== authorId) {
      throw new ForbiddenException('Only the author can view story viewers');
    }

    const take = Math.min(Math.max(limit, 1), 100);
    const skip = Math.max(page - 1, 0) * take;
    const [rows, total] = await Promise.all([
      this.prisma.storyView.findMany({
        where: { storyId },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip,
        take,
        include: {
          viewer: {
            select: {
              id: true,
              account: { select: { username: true } },
              profile: { select: { firstName: true, avatarUrl: true } },
            },
          },
        },
      }),
      this.prisma.storyView.count({ where: { storyId } }),
    ]);

    return {
      data: await this.withReadableAssetUrls(rows),
      meta: {
        total,
        page,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async hideOrUnhide(authorId: string, storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, authorId: true, isHidden: true },
    });
    if (!story) throw new NotFoundException('Story not found');
    if (story.authorId !== authorId) {
      throw new ForbiddenException('You can only manage your own stories');
    }
    const updated = await this.prisma.story.update({
      where: { id: storyId },
      data: { isHidden: !story.isHidden },
    });
    return updated;
  }

  async remove(authorId: string, storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, authorId: true },
    });
    if (!story) throw new NotFoundException('Story not found');
    if (story.authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own stories');
    }
    await this.prisma.story.delete({ where: { id: storyId } });
    return { id: storyId, deleted: true };
  }

  async replyToStory(viewerId: string, storyId: string, content?: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: {
        author: {
          select: {
            id: true,
            deletedAt: true,
            account: { select: { username: true } },
            profile: { select: { firstName: true, avatarUrl: true, isPrivate: true } },
          },
        },
        assets: true,
      },
    });
    if (!story) throw new NotFoundException('Story not found');
    await this.assertCanViewStory(viewerId, story as StoryWithRelations);
    if (story.expiresAt <= this.now()) {
      throw new BadRequestException('Cannot reply to an expired story');
    }
    if (viewerId === story.authorId) {
      throw new BadRequestException('Cannot reply to your own story');
    }

    const chat = await this.chatService.create(viewerId, {
      memberIds: [story.authorId],
      type: 'PRIVATE',
    });

    const firstAsset = (story.assets ?? [])[0];
    const assetUrl = firstAsset?.url
      ? await this.filesService.getReadableUrl(firstAsset.url)
      : '';
    const assetType = firstAsset?.type ?? 'IMAGE';
    const ref = `${STORY_REPLY_PREFIX} storyId=${storyId} assetUrl=${assetUrl} assetType=${assetType}`;
    const messageText = [ref, (content ?? '').trim()].filter(Boolean).join('\n');

    const message = await this.messageService.create(viewerId, {
      chatId: (chat as { id: string }).id,
      content: messageText,
    });

    return { chatId: (chat as { id: string }).id, message };
  }

  // Exclusions
  async listExclusions(authorId: string) {
    const rows = await this.prisma.storyExclusion.findMany({
      where: { authorId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        excludedUser: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: { select: { firstName: true, avatarUrl: true } },
          },
        },
      },
    });
    return this.withReadableAssetUrls(rows);
  }

  async addExclusion(authorId: string, excludedUserId: string) {
    if (authorId === excludedUserId) {
      throw new BadRequestException('Cannot exclude yourself');
    }
    const row = await this.prisma.storyExclusion.upsert({
      where: { authorId_excludedUserId: { authorId, excludedUserId } },
      create: { authorId, excludedUserId },
      update: {},
    });
    return row;
  }

  async removeExclusion(authorId: string, excludedUserId: string) {
    await this.prisma.storyExclusion.deleteMany({
      where: { authorId, excludedUserId },
    });
    return { deleted: true };
  }

  async exclusionSuggestions(authorId: string, query: string, limit = 10) {
    const q = query?.trim();
    if (!q) return [];

    const take = Math.min(Math.max(limit, 1), 20);
    const existing = await this.prisma.storyExclusion.findMany({
      where: { authorId },
      select: { excludedUserId: true },
    });
    const excludedIds = new Set(existing.map((e) => e.excludedUserId));
    excludedIds.add(authorId);

    const accounts = await this.prisma.account.findMany({
      where: {
        userId: { notIn: [...excludedIds] },
        username: { contains: q, mode: 'insensitive' },
        user: { deletedAt: null },
      },
      take,
      orderBy: { username: 'asc' },
      select: {
        userId: true,
        username: true,
        user: {
          select: {
            profile: { select: { firstName: true, avatarUrl: true } },
          },
        },
      },
    });

    const list = accounts.map((a) => ({
      userId: a.userId,
      username: a.username,
      firstName: a.user?.profile?.firstName ?? null,
      avatarUrl: a.user?.profile?.avatarUrl ?? null,
    }));

    return this.withReadableAssetUrls(list);
  }

  private async withReadableAssetUrls<T>(data: T): Promise<T> {
    const memo = new Map<string, string>();
    const mapAny = async (value: unknown): Promise<unknown> => {
      if (!value || typeof value !== 'object') return value;
      if (Array.isArray(value)) {
        return Promise.all(value.map((v) => mapAny(v)));
      }
      const obj = value as Record<string, unknown>;
      if (Array.isArray(obj.assets)) {
        obj.assets = await Promise.all(
          (obj.assets as Array<Record<string, unknown>>).map(async (asset) => {
            if (typeof asset.url === 'string') {
              asset.url = await this.filesService.getReadableUrl(asset.url);
            }
            return asset;
          }),
        );
      }
      if (typeof obj.avatarUrl === 'string') {
        const original = obj.avatarUrl;
        if (!memo.has(original)) {
          memo.set(original, await this.filesService.getReadableUrl(original));
        }
        obj.avatarUrl = memo.get(original) ?? obj.avatarUrl;
      }
      for (const [k, v] of Object.entries(obj)) {
        if (k === 'assets' || k === 'avatarUrl') continue;
        obj[k] = await mapAny(v);
      }
      return obj;
    };

    return (await mapAny(data)) as T;
  }
}

