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

describe('Posts Controller (e2e)', () => {
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
    validateToken: jest.fn().mockResolvedValue({ 
      userId: 'user-123', 
      username: 'tester', 
      email: 'test@test.com' 
    }),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'user-123',
        deletedAt: null,
      }),
    },
    post: {
      create: jest.fn().mockResolvedValue({
        id: 'post-1',
        description: 'Hello E2E',
        authorId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    follow: { findMany: jest.fn().mockResolvedValue([]) },
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
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/posts (POST) - should create a post', () => {
     return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', 'Bearer fake_token') 
      .send({ description: 'Hello E2E' })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toEqual('post-1');
        expect(res.body.description).toEqual('Hello E2E');
      });
  });

  it('/posts (POST) - should fail when description is not a string', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', 'Bearer fake_token')
      .send({ description: 123 })
      .expect(400);
  });
});