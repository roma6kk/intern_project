import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/database/prisma.service';
import { ChatGateway } from '../src/chat/chat.gateway';

jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    zAdd: jest.fn(),
    zRemRangeByScore: jest.fn(),
    zRange: jest.fn().mockResolvedValue([]),
    sAdd: jest.fn(),
    sRem: jest.fn(),
    multi: jest.fn(() => ({
      zAdd: jest.fn(),
      exec: jest.fn(),
    })),
  })),
}));

describe('Reports Controller (e2e)', () => {
  let app: INestApplication;

  const mockChatGateway = {
    sendNotification: jest.fn(),
    sendNewMessageToChat: jest.fn(),
    sendMessageUpdate: jest.fn(),
    sendMessageDelete: jest.fn(),
    onModuleInit: jest.fn(),
    afterInit: jest.fn(),
    handleConnection: jest.fn(),
    handleDisconnect: jest.fn(),
  };

  const mockAuthService = {
    validateToken: jest.fn().mockImplementation((token: string) => {
      if (token === 'moderator_token') {
        return Promise.resolve({
          userId: 'mod-1',
          username: 'moderator',
          role: 'MODERATOR',
          accountState: 'ACTIVE',
        });
      }
      return Promise.resolve({
        userId: 'user-123',
        username: 'tester',
        role: 'USER',
        accountState: 'ACTIVE',
      });
    }),
  };

  const mockPrismaService = {
    account: {
      findUnique: jest.fn().mockResolvedValue({
        state: 'ACTIVE',
      }),
    },
    post: {
      findUnique: jest.fn().mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440000',
      }),
      update: jest.fn(),
      delete: jest.fn(),
    },
    comment: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    report: {
      create: jest.fn().mockResolvedValue({
        id: 'report-1',
        postId: '550e8400-e29b-41d4-a716-446655440000',
        reason: 'Spam content',
        status: 'OPEN',
      }),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(ChatGateway)
      .useValue(mockChatGateway)
      .overrideProvider('NOTIFICATIONS_SERVICE')
      .useValue({
        connect: jest.fn().mockResolvedValue(undefined),
        close: jest.fn().mockResolvedValue(undefined),
        emit: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/reports (POST) - user can create report', () => {
    return request(app.getHttpServer())
      .post('/reports')
      .set('Authorization', 'Bearer user_token')
      .send({
        postId: '550e8400-e29b-41d4-a716-446655440000',
        reason: 'Spam content',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toEqual('report-1');
      });
  });

  it('/reports (GET) - user cannot list reports', () => {
    return request(app.getHttpServer())
      .get('/reports')
      .set('Authorization', 'Bearer user_token')
      .expect(403);
  });

  it('/reports (GET) - moderator can list reports', () => {
    return request(app.getHttpServer())
      .get('/reports')
      .set('Authorization', 'Bearer moderator_token')
      .expect(200);
  });
});
