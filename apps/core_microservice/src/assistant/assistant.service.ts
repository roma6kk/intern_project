import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { ChatService } from '../chat/chat.service';
import { PrismaService } from '../database/prisma.service';
import type {
  AssistantEnvelope,
  ChatQaData,
  DialogSummaryData,
  TopicSuggestionsData,
} from './assistant.types';

interface ChatWithMembers {
  type: string;
  members?: Array<{ id: string }>;
  messages?: Array<{
    id: string;
    senderId: string;
    content: string | null;
    createdAt: Date;
    deletedAt?: Date | null;
  }>;
}

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(
    private readonly http: HttpService,
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

  private getBaseUrl(): string {
    const base = process.env.ASSISTANT_MICROSERVICE_URL?.trim();
    if (!base) {
      throw new ServiceUnavailableException(
        'Assistant service is not configured (ASSISTANT_MICROSERVICE_URL)',
      );
    }
    return base.replace(/\/$/, '');
  }

  private getToken(): string {
    const token = process.env.ASSISTANT_SERVICE_SECRET?.trim();
    if (!token) {
      throw new ServiceUnavailableException(
        'Assistant service secret is not configured (ASSISTANT_SERVICE_SECRET)',
      );
    }
    return token;
  }

  private async postAssistant<T>(params: {
    path: string;
    body: unknown;
    op: string;
    chatId?: string;
    requesterId?: string;
    contextMessages?: number;
    targetUserId?: string;
  }): Promise<T> {
    const url = `${this.getBaseUrl()}${params.path}`;
    const started = Date.now();
    this.logger.debug(
      [
        `assistant.op.start op=${params.op}`,
        params.chatId ? `chatId=${params.chatId}` : '',
        params.requesterId ? `requesterId=${params.requesterId}` : '',
        params.targetUserId ? `targetUserId=${params.targetUserId}` : '',
        params.contextMessages != null
          ? `contextMessages=${params.contextMessages}`
          : '',
        `url=${url}`,
      ]
        .filter(Boolean)
        .join(' '),
    );
    try {
      const { data } = await firstValueFrom(
        this.http.post<T>(url, params.body, {
          headers: {
            'X-Assistant-Service-Token': this.getToken(),
            'Content-Type': 'application/json',
          },
          timeout: 25_000,
        }),
      );
      const ms = Date.now() - started;
      const envelope = data as unknown as
        | { success?: boolean; meta?: { source?: string; llmError?: string } }
        | undefined;
      this.logger.debug(
        [
          `assistant.op.done op=${params.op}`,
          params.chatId ? `chatId=${params.chatId}` : '',
          `ms=${ms}`,
          envelope?.success != null
            ? `success=${String(envelope.success)}`
            : '',
          envelope?.meta?.source ? `source=${envelope.meta.source}` : '',
        ]
          .filter(Boolean)
          .join(' '),
      );
      if (envelope?.success === true && envelope?.meta?.source === 'fallback') {
        const reason = envelope?.meta?.llmError ?? 'UNKNOWN';
        this.logger.warn(
          [
            `assistant.op.fallback op=${params.op}`,
            params.chatId ? `chatId=${params.chatId}` : '',
            params.requesterId ? `requesterId=${params.requesterId}` : '',
            `reason=${reason}`,
          ]
            .filter(Boolean)
            .join(' '),
        );
      }
      return data;
    } catch (e) {
      const err = e as AxiosError<{ message?: string }>;
      const ms = Date.now() - started;
      this.logger.warn(
        [
          `assistant.op.fail op=${params.op}`,
          params.chatId ? `chatId=${params.chatId}` : '',
          `ms=${ms}`,
          `status=${err.response?.status ?? 'n/a'}`,
          `err=${err.message}`,
        ]
          .filter(Boolean)
          .join(' '),
      );
      throw new ServiceUnavailableException(
        err.response?.data?.message ?? 'Assistant service unavailable',
      );
    }
  }

  private assertMember(chat: ChatWithMembers, userId: string) {
    const ok = chat.members?.some((m) => m.id === userId);
    if (!ok) {
      throw new ForbiddenException('You are not a participant of this chat');
    }
  }

  private resolveTargetUserId(
    chat: ChatWithMembers,
    requesterId: string,
    targetUserId?: string,
  ): string {
    if (chat.type === 'PRIVATE') {
      const other = chat.members?.find((m) => m.id !== requesterId);
      if (!other) {
        throw new BadRequestException('Could not resolve counterparty');
      }
      return other.id;
    }
    if (targetUserId) {
      const inChat = chat.members?.some((m) => m.id === targetUserId);
      if (!inChat) {
        throw new ForbiddenException('Target user is not in this chat');
      }
      if (targetUserId === requesterId) {
        throw new BadRequestException('targetUserId must be another member');
      }
      return targetUserId;
    }
    const others = chat.members?.filter((m) => m.id !== requesterId) ?? [];
    if (others.length === 1) {
      return others[0].id;
    }
    throw new BadRequestException(
      'targetUserId is required for group chats with more than one other member',
    );
  }

  private mapRecentMessages(chat: ChatWithMembers) {
    const list = chat.messages ?? [];
    return list.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      content: m.deletedAt != null ? null : m.content,
      createdAt:
        m.createdAt instanceof Date
          ? m.createdAt.toISOString()
          : String(m.createdAt),
    }));
  }

  private async loadTargetProfile(targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        account: { select: { username: true, role: true } },
        profile: {
          select: { firstName: true, secondName: true, bio: true },
        },
      },
    });
    if (!user) {
      throw new BadRequestException('Target user not found');
    }
    return {
      userId: user.id,
      username: user.account?.username,
      firstName: user.profile?.firstName,
      secondName: user.profile?.secondName ?? undefined,
      bio: user.profile?.bio ?? undefined,
      platformRole: user.account?.role,
    };
  }

  async topicSuggestions(
    requesterId: string,
    chatId: string,
    targetUserId?: string,
  ): Promise<AssistantEnvelope<TopicSuggestionsData>> {
    this.logger.log(
      `assistant.topicSuggestions requesterId=${requesterId} chatId=${chatId}`,
    );
    const chat = (await this.chatService.findOne(
      chatId,
    )) as unknown as ChatWithMembers;
    this.assertMember(chat, requesterId);
    const resolvedTarget = this.resolveTargetUserId(
      chat,
      requesterId,
      targetUserId,
    );
    this.logger.debug(
      [
        'assistant.topicSuggestions.target',
        `chatId=${chatId}`,
        `requesterId=${requesterId}`,
        `resolvedTarget=${resolvedTarget}`,
        `chatType=${chat.type}`,
        `members=${chat.members?.length ?? 0}`,
      ].join(' '),
    );
    const targetUserProfile = await this.loadTargetProfile(resolvedTarget);
    const recentMessages = this.mapRecentMessages(chat);
    return this.postAssistant<AssistantEnvelope<TopicSuggestionsData>>({
      op: 'topicSuggestions',
      path: '/assistant/topic-suggestions',
      chatId,
      requesterId,
      targetUserId: resolvedTarget,
      contextMessages: recentMessages.length,
      body: {
        chatId,
        requesterId,
        targetUserProfile,
        recentMessages,
        targetUserId: resolvedTarget,
      },
    });
  }

  async dialogSummary(
    requesterId: string,
    chatId: string,
    maxBullets?: number,
  ): Promise<AssistantEnvelope<DialogSummaryData>> {
    this.logger.log(
      `assistant.dialogSummary requesterId=${requesterId} chatId=${chatId}`,
    );
    const chat = (await this.chatService.findOne(
      chatId,
    )) as unknown as ChatWithMembers;
    this.assertMember(chat, requesterId);
    const recentMessages = this.mapRecentMessages(chat);
    return this.postAssistant<AssistantEnvelope<DialogSummaryData>>({
      op: 'dialogSummary',
      path: '/assistant/dialog-summary',
      chatId,
      requesterId,
      contextMessages: recentMessages.length,
      body: {
        chatId,
        requesterId,
        recentMessages,
        maxBullets,
      },
    });
  }

  async chatQa(
    requesterId: string,
    chatId: string,
    question: string,
  ): Promise<AssistantEnvelope<ChatQaData>> {
    this.logger.log(
      `assistant.chatQa requesterId=${requesterId} chatId=${chatId}`,
    );
    const chat = (await this.chatService.findOne(
      chatId,
    )) as unknown as ChatWithMembers;
    this.assertMember(chat, requesterId);
    const recentMessages = this.mapRecentMessages(chat);
    return this.postAssistant<AssistantEnvelope<ChatQaData>>({
      op: 'chatQa',
      path: '/assistant/chat-qa',
      chatId,
      requesterId,
      contextMessages: recentMessages.length,
      body: {
        chatId,
        requesterId,
        question,
        recentMessages,
      },
    });
  }
}
