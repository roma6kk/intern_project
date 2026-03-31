import { HttpService } from '@nestjs/axios';
import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { AssistantService } from './assistant.service';
import { ChatService } from '../chat/chat.service';
import { PrismaService } from '../database/prisma.service';

describe('AssistantService', () => {
  let service: AssistantService;
  let http: { post: jest.Mock };

  beforeEach(async () => {
    process.env.ASSISTANT_MICROSERVICE_URL = 'http://localhost:3003';
    process.env.ASSISTANT_SERVICE_SECRET = 'test-secret';

    http = { post: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AssistantService,
        { provide: HttpService, useValue: http },
        {
          provide: ChatService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              type: 'PRIVATE',
              members: [{ id: 'u1' }, { id: 'u2' }],
              messages: [
                {
                  id: 'm1',
                  senderId: 'u2',
                  content: 'hello',
                  createdAt: new Date('2025-01-01T00:00:00.000Z'),
                  deletedAt: null,
                },
              ],
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue({
                id: 'u2',
                account: { username: 'bob', role: 'USER' },
                profile: {
                  firstName: 'Bob',
                  secondName: null,
                  bio: 'loves music',
                },
              }),
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(AssistantService);
  });

  afterEach(() => {
    delete process.env.ASSISTANT_MICROSERVICE_URL;
    delete process.env.ASSISTANT_SERVICE_SECRET;
  });

  it('throws when assistant URL is not configured', async () => {
    delete process.env.ASSISTANT_MICROSERVICE_URL;
    await expect(
      service.topicSuggestions('u1', 'chat-1'),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('proxies topic-suggestions to assistant', async () => {
    http.post.mockReturnValue(
      of({
        data: {
          success: true,
          data: { suggestions: ['a'], tone: 'casual', confidence: 0.9 },
        },
      }),
    );
    const res = await service.topicSuggestions('u1', 'chat-1');
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.suggestions).toEqual(['a']);
    }
    expect(http.post).toHaveBeenCalledTimes(1);
    const [url, body, config] = http.post.mock.calls[0] as [
      string,
      unknown,
      unknown,
    ];

    expect(url).toBe('http://localhost:3003/assistant/topic-suggestions');

    expect(body).toEqual(
      expect.objectContaining({
        chatId: 'chat-1',
        requesterId: 'u1',
        targetUserId: 'u2',
      }),
    );
    expect(body).toEqual(
      expect.objectContaining({
        targetUserProfile: expect.objectContaining({ userId: 'u2' }),
      }),
    );

    expect(config).toEqual(
      expect.objectContaining({
        timeout: 25000,
      }),
    );
    expect(config).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Assistant-Service-Token': 'test-secret',
        }),
      }),
    );
  });

  it('maps ServiceUnavailable on HTTP failure', async () => {
    http.post.mockReturnValue(throwError(() => new Error('network')));
    await expect(service.dialogSummary('u1', 'chat-1')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
