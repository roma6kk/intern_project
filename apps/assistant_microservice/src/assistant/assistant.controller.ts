import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { TopicSuggestionsRequestDto } from './dto/topic-suggestions-request.dto';
import { DialogSummaryRequestDto } from './dto/dialog-summary-request.dto';
import { ChatQaRequestDto } from './dto/chat-qa-request.dto';
import { ServiceTokenGuard } from '../common/guards/service-token.guard';

@Controller('assistant')
@UseGuards(ServiceTokenGuard)
export class AssistantController {
  constructor(private readonly assistant: AssistantService) {}

  @Post('topic-suggestions')
  topicSuggestions(@Body() body: TopicSuggestionsRequestDto) {
    return this.assistant.topicSuggestions(body);
  }

  @Post('dialog-summary')
  dialogSummary(@Body() body: DialogSummaryRequestDto) {
    return this.assistant.dialogSummary(body);
  }

  @Post('chat-qa')
  chatQa(@Body() body: ChatQaRequestDto) {
    return this.assistant.chatQa(body);
  }
}
