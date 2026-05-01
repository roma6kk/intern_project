import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../database/prisma.service';
import { FilesService } from '../files/files.service';
import { NotificationService } from '../notification/notification.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('PostService', () => {
  let service: PostService;

  const mockPrismaService = {
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    follow: {
      findMany: jest.fn(),
    },
  };

  const mockFilesService = {
    uploadFile: jest.fn(),
    getReadableUrl: jest.fn(),
  };

  const mockNotificationService = {
    create: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post with description', async () => {
      const userId = 'user1';
      const createPostDto = { description: 'Test post' };
      const mockPost = {
        id: 'post1',
        description: 'Test post',
        authorId: userId,
        assets: [],
        author: {
          id: userId,
          account: { username: 'testuser' },
          profile: { firstName: 'Test', avatarUrl: null },
        },
      };

      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await service.create(userId, createPostDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.post.create).toHaveBeenCalled();
    });

    it('should handle post creation with multiple files', async () => {
      const userId = 'user1';
      const createPostDto = { description: 'Post with images' };
      const files = [
        { filename: 'image1.jpg' },
        { filename: 'image2.jpg' },
      ] as Express.Multer.File[];

      mockFilesService.uploadFile.mockResolvedValue(
        'https://example.com/image.jpg',
      );
      mockPrismaService.post.create.mockResolvedValue({
        id: 'post1',
        description: 'Post with images',
        authorId: userId,
        assets: [
          { url: 'https://example.com/image.jpg', type: 'IMAGE' },
          { url: 'https://example.com/image.jpg', type: 'IMAGE' },
        ],
      });

      const result = await service.create(userId, createPostDto, files);

      expect(result).toBeDefined();
      expect(mockFilesService.uploadFile).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAll', () => {
    it('should return posts with pagination', async () => {
      const mockPosts = [
        {
          id: 'post1',
          description: 'Test post 1',
          createdAt: new Date(),
          assets: [],
          author: {
            id: 'user1',
            account: { username: 'testuser' },
            profile: { firstName: 'Test', avatarUrl: null },
          },
          _count: { likes: 0, comments: 0 },
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);

      const result = await service.findAll({ limit: 10, page: 1 });

      expect(result).toBeDefined();
    });
  });
});
