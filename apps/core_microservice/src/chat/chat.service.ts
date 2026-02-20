import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from '../database/prisma.service';
import { ChatType } from '@prisma/client';

const participantInclude = {
  select: {
    userId: true,
    role: true,
    user: {
      select: {
        id: true,
        account: { select: { username: true } },
        profile: {
          select: { firstName: true, secondName: true, avatarUrl: true },
        },
      },
    },
  },
};

const participantIncludeShort = {
  select: {
    userId: true,
    role: true,
    user: {
      select: {
        id: true,
        account: { select: { username: true } },
        profile: { select: { firstName: true, avatarUrl: true } },
      },
    },
  },
};

/** Map participants to members-like shape for API response (id, role, account, profile) */
function toMembersWithRole(
  participants: Array<{ userId: string; role: string; user: unknown }>,
) {
  return participants.map((p) => ({
    ...(p.user as Record<string, unknown>),
    role: p.role,
  }));
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findPrivateChatBetween(userId1: string, userId2: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        type: ChatType.PRIVATE,
        AND: [
          { participants: { some: { userId: userId1 } } },
          { participants: { some: { userId: userId2 } } },
        ],
      },
      include: {
        participants: { select: { userId: true } },
      },
    });
    const withExactlyTwo = chats.find((c) => c.participants.length === 2);
    return withExactlyTwo ?? null;
  }

  async create(currentUserId: string, createChatDto: CreateChatDto) {
    const uniqueMemberIds = new Set([
      ...createChatDto.memberIds,
      currentUserId,
    ]);
    let type = createChatDto.type ?? ChatType.PRIVATE;

    if (uniqueMemberIds.size > 2) {
      type = ChatType.GROUP;
    }

    if (type === ChatType.GROUP) {
      if (!createChatDto.name?.trim()) {
        throw new BadRequestException('Group chat must have a name');
      }
    }

    if (type === ChatType.PRIVATE && uniqueMemberIds.size === 2) {
      const otherUserId = Array.from(uniqueMemberIds).find(
        (id) => id !== currentUserId,
      );
      if (otherUserId) {
        const existing = await this.findPrivateChatBetween(
          currentUserId,
          otherUserId,
        );
        if (existing) {
          return this.findOne(existing.id);
        }
      }
    }

    const participantsData = Array.from(uniqueMemberIds).map((userId) => ({
      userId,
      role: userId === currentUserId ? ('ADMIN' as const) : ('MEMBER' as const),
    }));

    const chat = await this.prisma.chat.create({
      data: {
        type,
        name: createChatDto.name?.trim() || null,
        description: createChatDto.description?.trim() || null,
        creatorId: currentUserId,
        participants: {
          create: participantsData,
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: {
              select: { firstName: true, secondName: true, avatarUrl: true },
            },
          },
        },
        participants: participantInclude,
      },
    });

    this.logger.log(`Chat "${chat.id}" created by ${currentUserId}`);
    return {
      ...chat,
      members: toMembersWithRole(chat.participants),
    };
  }

  async findAllByUser(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            account: { select: { username: true } },
          },
        },
        participants: participantIncludeShort,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            content: true,
            createdAt: true,
            isRead: true,
            sender: {
              select: {
                id: true,
                profile: { select: { firstName: true } },
              },
            },
          },
        },
      },
    });
    return chats.map((c) => ({
      ...c,
      members: toMembersWithRole(c.participants),
    }));
  }

  async findOne(id: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: {
              select: { firstName: true, secondName: true, avatarUrl: true },
            },
          },
        },
        participants: participantInclude,
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50,
          include: {
            sender: {
              select: {
                id: true,
                profile: {
                  select: { firstName: true, avatarUrl: true },
                },
                account: { select: { username: true } },
              },
            },
            assets: true,
            replyTo: {
              select: {
                id: true,
                content: true,
                deletedAt: true,
                senderId: true,
                sender: {
                  select: {
                    id: true,
                    profile: {
                      select: { firstName: true, avatarUrl: true },
                    },
                    account: { select: { username: true } },
                  },
                },
                assets: true,
              },
            },
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const messages = (chat.messages as Array<Record<string, unknown>>).map(
      (msg) => {
        const replyTo = msg.replyTo as Record<string, unknown> | null;
        if (replyTo && replyTo.deletedAt != null) {
          return {
            ...msg,
            replyTo: {
              ...replyTo,
              content: null,
              assets: [],
            },
          };
        }
        return msg;
      },
    );

    return {
      ...chat,
      messages,
      members: toMembersWithRole(chat.participants),
    };
  }

  async update(
    id: string,
    currentUserId: string,
    updateChatDto: UpdateChatDto,
  ) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        participants: {
          select: { userId: true, role: true },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const currentParticipant = chat.participants.find(
      (p) => p.userId === currentUserId,
    );
    if (!currentParticipant) {
      throw new ForbiddenException('You are not a participant of this chat');
    }

    const isAdmin = currentParticipant.role === 'ADMIN';
    const participantCount = chat.participants.length;

    // Leave chat
    if (updateChatDto.leaveChat) {
      const otherAdmins = chat.participants.filter(
        (p) => p.userId !== currentUserId && p.role === 'ADMIN',
      );
      const isLastAdmin = isAdmin && otherAdmins.length === 0;

      if (isLastAdmin) {
        if (!updateChatDto.newAdminId?.trim()) {
          throw new BadRequestException(
            'You must select a participant to transfer ADMIN role to before leaving',
          );
        }
        const target = chat.participants.find(
          (p) => p.userId === updateChatDto.newAdminId,
        );
        if (!target || target.userId === currentUserId) {
          throw new BadRequestException(
            'newAdminId must be another participant',
          );
        }

        await this.prisma.$transaction([
          this.prisma.chatParticipant.updateMany({
            where: { chatId: id, userId: updateChatDto.newAdminId },
            data: { role: 'ADMIN' },
          }),
          this.prisma.chatParticipant.deleteMany({
            where: { chatId: id, userId: currentUserId },
          }),
        ]);
      } else {
        await this.prisma.chatParticipant.deleteMany({
          where: { chatId: id, userId: currentUserId },
        });
      }

      this.logger.log(`User ${currentUserId} left chat ${id}`);
      return this.findOne(id);
    }

    // Name/description — only ADMIN
    if (
      updateChatDto.name !== undefined ||
      updateChatDto.description !== undefined
    ) {
      if (!isAdmin) {
        throw new ForbiddenException(
          'Only admins can edit chat title and description',
        );
      }
      if (
        chat.type === ChatType.GROUP &&
        updateChatDto.name !== undefined &&
        !updateChatDto.name?.trim()
      ) {
        throw new BadRequestException('Group chat name cannot be empty');
      }
      await this.prisma.chat.update({
        where: { id },
        data: {
          ...(updateChatDto.name !== undefined && {
            name: updateChatDto.name?.trim() || null,
          }),
          ...(updateChatDto.description !== undefined && {
            description: updateChatDto.description?.trim() || null,
          }),
        },
      });
    }

    // Add members — only ADMIN, GROUP, and only when participants > 2
    if (updateChatDto.addMemberIds?.length) {
      if (!isAdmin) {
        throw new ForbiddenException('Only admins can add participants');
      }
      if (chat.type !== ChatType.GROUP) {
        throw new BadRequestException('Can only add members to group chats');
      }
      if (participantCount <= 2) {
        throw new BadRequestException(
          'Cannot add members: group must have more than 2 participants first',
        );
      }
      const existingUserIds = new Set(chat.participants.map((p) => p.userId));
      const toAdd = updateChatDto.addMemberIds.filter(
        (id) => !existingUserIds.has(id),
      );
      if (toAdd.length) {
        await this.prisma.chatParticipant.createMany({
          data: toAdd.map((userId) => ({
            chatId: id,
            userId,
            role: 'MEMBER' as const,
          })),
        });
      }
    }

    // Remove members — only ADMIN, cannot remove self
    if (updateChatDto.removeMemberIds?.length) {
      if (!isAdmin) {
        throw new ForbiddenException('Only admins can remove participants');
      }
      if (updateChatDto.removeMemberIds.includes(currentUserId)) {
        throw new BadRequestException('Use leaveChat to leave the chat');
      }
      await this.prisma.chatParticipant.deleteMany({
        where: {
          chatId: id,
          userId: { in: updateChatDto.removeMemberIds },
        },
      });
    }

    // Promote participant to ADMIN — only ADMIN can do this
    if (updateChatDto.promoteToAdminId) {
      if (!isAdmin) {
        throw new ForbiddenException(
          'Only admins can promote members to admin',
        );
      }
      const target = chat.participants.find(
        (p) => p.userId === updateChatDto.promoteToAdminId,
      );
      if (!target) {
        throw new BadRequestException('User is not a participant of this chat');
      }
      if (target.userId === currentUserId) {
        throw new BadRequestException('You already are an admin');
      }
      if (target.role === 'ADMIN') {
        throw new BadRequestException('User is already an admin');
      }
      await this.prisma.chatParticipant.updateMany({
        where: { chatId: id, userId: updateChatDto.promoteToAdminId },
        data: { role: 'ADMIN' },
      });
    }

    this.logger.log(`Chat ${id} updated successfully`);
    return this.findOne(id);
  }

  async remove(id: string, currentUserId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        participants: {
          select: { userId: true, role: true },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const currentParticipant = chat.participants.find(
      (p) => p.userId === currentUserId,
    );
    if (!currentParticipant) {
      throw new ForbiddenException('You are not a participant of this chat');
    }

    if (chat.type === ChatType.GROUP && currentParticipant.role !== 'ADMIN') {
      throw new ForbiddenException('Only an admin can delete the group chat');
    }

    await this.prisma.chat.delete({
      where: { id },
    });

    this.logger.log(`Chat ${id} removed successfully`);
    return { id, deleted: true };
  }
}
