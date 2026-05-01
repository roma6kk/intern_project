import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { PrismaService } from '../database/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ChatType } from '@prisma/client';

describe('ChatService', () => {
  let service: ChatService;

  const mockPrismaService = {
    chat: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    chatParticipant: {
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findPrivateChatBetween', () => {
    it('should return null if no private chat exists between two users', async () => {
      mockPrismaService.chat.findMany.mockResolvedValue([]);

      const result = await service.findPrivateChatBetween('user1', 'user2');

      expect(result).toBeNull();
    });

    it('should return the private chat if it exists between two users', async () => {
      const mockChat = {
        id: 'chat1',
        type: ChatType.PRIVATE,
        participants: [{ userId: 'user1' }, { userId: 'user2' }],
      };
      mockPrismaService.chat.findMany.mockResolvedValue([mockChat]);

      const result = await service.findPrivateChatBetween('user1', 'user2');

      expect(result).toEqual(mockChat);
    });
  });

  describe('create', () => {
    it('should create a private chat when only two members exist', async () => {
      const createChatDto = {
        memberIds: ['user2'],
        type: ChatType.PRIVATE,
      };
      const currentUserId = 'user1';
      const mockChat = {
        id: 'chat1',
        type: ChatType.PRIVATE,
        name: null,
        description: null,
        creatorId: currentUserId,
        creator: {
          id: currentUserId,
          account: { username: 'user1' },
          profile: { firstName: 'User', secondName: null, avatarUrl: null },
        },
        participants: [
          {
            userId: 'user1',
            role: 'ADMIN',
            user: {
              id: 'user1',
              account: { username: 'user1' },
              profile: { firstName: 'User', secondName: null, avatarUrl: null },
            },
          },
          {
            userId: 'user2',
            role: 'MEMBER',
            user: {
              id: 'user2',
              account: { username: 'user2' },
              profile: {
                firstName: 'User2',
                secondName: null,
                avatarUrl: null,
              },
            },
          },
        ],
        messages: [],
      };

      mockPrismaService.chat.findMany.mockResolvedValue([]);
      mockPrismaService.chat.create.mockResolvedValue(mockChat);

      const result = await service.create(currentUserId, createChatDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('chat1');
    });

    it('should throw BadRequestException when group chat has no name', async () => {
      const createChatDto = {
        memberIds: ['user2', 'user3'],
        type: ChatType.GROUP,
        name: '',
      };
      const currentUserId = 'user1';

      await expect(
        service.create(currentUserId, createChatDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when chat does not exist', async () => {
      mockPrismaService.chat.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
