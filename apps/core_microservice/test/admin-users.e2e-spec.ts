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

describe('Admin Users Controller (e2e)', () => {
  let app: INestApplication;

  const ADMIN_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const USER_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

  const warnings: Array<{ id: string; userId: string; reason: string; createdAt: Date }> = [];
  const sanctions: Array<{ id: string; userId: string; reason: string; isActive: boolean; createdAt: Date }> = [];
  const logs: Array<{ id: string; targetUserId: string; actionType: string; createdAt: Date }> = [];

  const accounts = new Map<string, any>([
    [
      ADMIN_ID,
      {
        userId: ADMIN_ID,
        username: 'admin',
        role: 'ADMIN',
        state: 'ACTIVE',
        escalationLevel: 0,
        suspendedUntil: null,
      },
    ],
    [
      USER_ID,
      {
        userId: USER_ID,
        username: 'user1',
        role: 'USER',
        state: 'ACTIVE',
        escalationLevel: 0,
        suspendedUntil: null,
      },
    ],
  ]);

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
      if (token === 'admin_token') {
        return Promise.resolve({
          userId: ADMIN_ID,
          username: 'admin',
          role: 'ADMIN',
          accountState: 'ACTIVE',
        });
      }
      return Promise.resolve({
        userId: USER_ID,
        username: 'user1',
        role: 'USER',
        accountState: 'ACTIVE',
      });
    }),
  };

  const actorStub = { id: ADMIN_ID, account: { username: 'admin' } };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn().mockImplementation(({ where }: any) => {
        if (where.id === ADMIN_ID || where.id === USER_ID) return { id: where.id };
        return null;
      }),
    },
    account: {
      findUnique: jest.fn().mockImplementation(({ where }: any) => {
        const value = accounts.get(where.userId);
        if (!value) return null;
        return { ...value };
      }),
      findMany: jest.fn().mockImplementation(() => Array.from(accounts.values())),
      count: jest.fn().mockImplementation(() => accounts.size),
      update: jest.fn().mockImplementation(({ where, data }: any) => {
        const prev = accounts.get(where.userId);
        const next = { ...prev, ...data };
        accounts.set(where.userId, next);
        return next;
      }),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    userWarning: {
      create: jest.fn().mockImplementation(({ data }: any) => {
        const warning = {
          id: `w-${warnings.length + 1}`,
          userId: data.userId,
          reason: data.reason,
          createdAt: new Date(),
        };
        warnings.push(warning);
        return warning;
      }),
      count: jest.fn().mockImplementation(({ where }: any) => {
        return warnings.filter((w) => w.userId === where.userId).length;
      }),
      findMany: jest.fn().mockImplementation(({ where }: any) => {
        return warnings
          .filter((w) => w.userId === where.userId)
          .map((w) => ({ ...w, actor: actorStub }));
      }),
    },
    userSanction: {
      create: jest.fn().mockImplementation(({ data }: any) => {
        const sanction = {
          id: `s-${sanctions.length + 1}`,
          userId: data.userId,
          reason: data.reason,
          isActive: true,
          until: data.until,
          createdAt: new Date(),
        };
        sanctions.push(sanction);
        return sanction;
      }),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      findMany: jest.fn().mockImplementation(({ where }: any) => {
        return sanctions
          .filter((s) => s.userId === where.userId)
          .map((s) => ({ ...s, actor: actorStub }));
      }),
    },
    moderationLog: {
      create: jest.fn().mockImplementation(({ data }: any) => {
        const log = {
          id: `l-${logs.length + 1}`,
          targetUserId: data.targetUserId,
          actionType: data.actionType,
          reason: data.reason,
          createdAt: new Date(),
        };
        logs.push(log);
        return log;
      }),
      findMany: jest.fn().mockImplementation(({ where }: any) => {
        return logs
          .filter((l) => l.targetUserId === where.targetUserId)
          .map((l) => ({ ...l, actor: actorStub }));
      }),
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
    if (app) await app.close();
  });

  it('forbids non-admin user access', () => {
    return request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', 'Bearer user_token')
      .expect(403);
  });

  it('allows admin to list users', () => {
    return request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', 'Bearer admin_token')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('forbids non-admin bulk', () => {
    return request(app.getHttpServer())
      .post('/admin/users/bulk')
      .set('Authorization', 'Bearer user_token')
      .send({
        userIds: [USER_ID],
        action: 'WARN',
        warn: { reason: 'nope' },
      })
      .expect(403);
  });

  it('allows admin bulk warn', () => {
    return request(app.getHttpServer())
      .post('/admin/users/bulk')
      .set('Authorization', 'Bearer admin_token')
      .send({
        userIds: [USER_ID],
        action: 'WARN',
        warn: { reason: 'bulk warn' },
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.succeeded).toEqual([USER_ID]);
        expect(res.body.failed).toEqual([]);
        expect(res.body.total).toBe(1);
      });
  });

  it('returns merged timeline on history', async () => {
    await request(app.getHttpServer())
      .post(`/admin/users/${USER_ID}/warnings`)
      .set('Authorization', 'Bearer admin_token')
      .send({ reason: 'for timeline' })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/admin/users/${USER_ID}/history`)
      .set('Authorization', 'Bearer admin_token')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.timeline)).toBe(true);
        expect(res.body.timeline.length).toBeGreaterThan(0);
        expect(res.body.timeline[0].kind).toBeDefined();
      });
  });

  it('escalates to suspension after 3 warnings', async () => {
    await request(app.getHttpServer())
      .post(`/admin/users/${USER_ID}/warnings`)
      .set('Authorization', 'Bearer admin_token')
      .send({ reason: 'warning 1' })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/admin/users/${USER_ID}/warnings`)
      .set('Authorization', 'Bearer admin_token')
      .send({ reason: 'warning 2' })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/admin/users/${USER_ID}/warnings`)
      .set('Authorization', 'Bearer admin_token')
      .send({ reason: 'warning 3' })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/admin/users/${USER_ID}/history`)
      .set('Authorization', 'Bearer admin_token')
      .expect(200)
      .expect((res) => {
        expect((res.body.warnings || []).length).toBeGreaterThanOrEqual(3);
        expect((res.body.sanctions || []).length).toBeGreaterThanOrEqual(1);
      });
  });
});
