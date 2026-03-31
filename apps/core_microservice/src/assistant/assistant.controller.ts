import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { ICurrentUser } from 'src/auth/interfaces/ICurrentUser';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AssistantService } from './assistant.service';
import { TopicSuggestionsBodyDto } from './dto/topic-suggestions-body.dto';
import { DialogSummaryBodyDto } from './dto/dialog-summary-body.dto';
import { ChatQaBodyDto } from './dto/chat-qa-body.dto';

@ApiTags('Assistant')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, DeletedUserGuard)
@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistant: AssistantService) {}

  @Post('topic-suggestions')
  @ApiOperation({
    summary: 'AI: suggest conversation topics from counterparty profile',
  })
  topicSuggestions(
    @CurrentUser() user: ICurrentUser,
    @Body() body: TopicSuggestionsBodyDto,
  ) {
    return this.assistant.topicSuggestions(
      user.userId,
      body.chatId,
      body.targetUserId,
    );
  }

  @Post('dialog-summary')
  @ApiOperation({ summary: 'AI: summarize recent chat messages' })
  dialogSummary(
    @CurrentUser() user: ICurrentUser,
    @Body() body: DialogSummaryBodyDto,
  ) {
    return this.assistant.dialogSummary(
      user.userId,
      body.chatId,
      body.maxBullets,
    );
  }

  @Post('chat-qa')
  @ApiOperation({ summary: 'AI: answer a question using chat history' })
  chatQa(@CurrentUser() user: ICurrentUser, @Body() body: ChatQaBodyDto) {
    return this.assistant.chatQa(user.userId, body.chatId, body.question);
  }
}
