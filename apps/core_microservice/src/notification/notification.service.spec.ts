import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../database/prisma.service';
import { ChatGateway } from '../chat/chat.gateway';
import { FilesService } from '../files/files.service';
import { NotificationType } from '@prisma/client';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockPrismaService = {
    notification: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockChatGateway = {
    sendNotification: jest.fn(),
  };

  const mockFilesService = {
    getReadableUrl: jest.fn(),
  };

  const mockClientProxy = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ChatGateway,
          useValue: mockChatGateway,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: 'NOTIFICATIONS_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should not create notification when actor and recipient are the same (non-SYSTEM)', async () => {
      const dto = {
        actorId: 'user1',
        recipientId: 'user1',
        type: NotificationType.LIKE,
        itemId: 'item1',
        postId: null,
        message: null,
      };

      await service.create(dto);

      expect(mockClientProxy.emit).not.toHaveBeenCalled();
    });

    it('should create SYSTEM notification even when actor and recipient are the same', async () => {
      const dto = {
        actorId: 'user1',
        recipientId: 'user1',
        type: NotificationType.SYSTEM,
        itemId: null,
        postId: null,
        message: 'System notification',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user1',
        account: { username: 'testuser' },
        profile: { avatarUrl: 'avatar.jpg' },
      });

      mockFilesService.getReadableUrl.mockResolvedValue(
        'https://example.com/avatar.jpg',
      );

      await service.create(dto);

      expect(mockClientProxy.emit).toHaveBeenCalledWith(
        'notification_created',
        dto,
      );
    });

    it('should emit notification to client proxy when notification is created', async () => {
      const dto = {
        actorId: 'user1',
        recipientId: 'user2',
        type: NotificationType.LIKE,
        itemId: 'post1',
        postId: null,
        message: null,
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user1',
        account: { username: 'testuser' },
        profile: { avatarUrl: null },
      });

      await service.create(dto);

      expect(mockClientProxy.emit).toHaveBeenCalledWith(
        'notification_created',
        dto,
      );
      expect(mockChatGateway.sendNotification).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all notifications', async () => {
      const mockNotifications = [
        { id: 'notif1', type: NotificationType.LIKE, recipientId: 'user1' },
        { id: 'notif2', type: NotificationType.FOLLOW, recipientId: 'user1' },
      ];

      mockPrismaService.notification.findMany.mockResolvedValue(
        mockNotifications,
      );

      const result = await service.findAll();

      expect(result).toEqual(mockNotifications);
      expect(mockPrismaService.notification.findMany).toHaveBeenCalled();
    });
  });
});
