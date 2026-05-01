import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ICurrentUser } from '../auth/interfaces/ICurrentUser';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryMeQueryDto } from './dto/story-me-query.dto';
import { SetStoryReactionDto } from './dto/set-reaction.dto';
import { ReplyToStoryDto } from './dto/reply-story.dto';
import { UpsertStoryExclusionDto } from './dto/upsert-exclusion.dto';

@ApiTags('Stories')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, DeletedUserGuard)
@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a story (multipart)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  create(
    @CurrentUser() user: ICurrentUser,
    @Body() dto: CreateStoryDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.storyService.create(user.userId, dto.caption, files);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my stories (active/expired)' })
  getMe(@CurrentUser() user: ICurrentUser, @Query() query: StoryMeQueryDto) {
    return this.storyService.getMe(user.userId, query.status ?? 'active');
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get stories shelf feed' })
  getFeed(@CurrentUser() user: ICurrentUser) {
    return this.storyService.getFeed(user.userId);
  }

  // Exclusions
  @Get('exclusions/list')
  @ApiOperation({ summary: 'List my story exclusions' })
  listExclusions(@CurrentUser() user: ICurrentUser) {
    return this.storyService.listExclusions(user.userId);
  }

  @Post('exclusions')
  @ApiOperation({ summary: 'Add user to my story exclusions' })
  addExclusion(
    @CurrentUser() user: ICurrentUser,
    @Body() dto: UpsertStoryExclusionDto,
  ) {
    return this.storyService.addExclusion(user.userId, dto.excludedUserId);
  }

  @Delete('exclusions/:excludedUserId')
  @ApiOperation({ summary: 'Remove user from my story exclusions' })
  removeExclusion(
    @CurrentUser() user: ICurrentUser,
    @Param('excludedUserId') excludedUserId: string,
  ) {
    return this.storyService.removeExclusion(user.userId, excludedUserId);
  }

  @Get('exclusions/suggestions')
  @ApiOperation({ summary: 'User suggestions for exclusions (mention-like)' })
  suggestions(
    @CurrentUser() user: ICurrentUser,
    @Query('query') query: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit
      ? Math.min(Math.max(parseInt(limit, 10) || 10, 1), 20)
      : 10;
    return this.storyService.exclusionSuggestions(user.userId, query, limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get story by id (enforces visibility)' })
  findOne(@CurrentUser() user: ICurrentUser, @Param('id') id: string) {
    return this.storyService.findOne(user.userId, id);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Mark story as viewed' })
  markViewed(@CurrentUser() user: ICurrentUser, @Param('id') id: string) {
    return this.storyService.markViewed(user.userId, id);
  }

  @Put(':id/reaction')
  @ApiOperation({
    summary: 'Add a story reaction',
    description:
      'Each request appends a reaction. Multiple reactions per user are allowed.',
  })
  setReaction(
    @CurrentUser() user: ICurrentUser,
    @Param('id') id: string,
    @Body() dto: SetStoryReactionDto,
  ) {
    return this.storyService.setReaction(user.userId, id, dto.emoji);
  }

  @Delete(':id/reaction')
  @ApiOperation({
    summary: 'Delete all my reactions for a story',
    description: 'Removes every reaction row you added to this story.',
  })
  deleteReaction(@CurrentUser() user: ICurrentUser, @Param('id') id: string) {
    return this.storyService.deleteReaction(user.userId, id);
  }

  @Get(':id/viewers')
  @ApiOperation({ summary: 'Get viewers list (author only)' })
  getViewers(
    @CurrentUser() user: ICurrentUser,
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? Math.max(parseInt(page, 10) || 1, 1) : 1;
    const limitNum = limit
      ? Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100)
      : 50;
    return this.storyService.getViewers(user.userId, id, pageNum, limitNum);
  }

  @Post(':id/reply')
  @ApiOperation({ summary: 'Reply to a story (creates/sends DM)' })
  reply(
    @CurrentUser() user: ICurrentUser,
    @Param('id') id: string,
    @Body() dto: ReplyToStoryDto,
  ) {
    return this.storyService.replyToStory(user.userId, id, dto.content);
  }

  @Patch(':id/toggle-hidden')
  @ApiOperation({ summary: 'Hide/unhide my story' })
  toggleHidden(@CurrentUser() user: ICurrentUser, @Param('id') id: string) {
    return this.storyService.hideOrUnhide(user.userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete my story' })
  remove(@CurrentUser() user: ICurrentUser, @Param('id') id: string) {
    return this.storyService.remove(user.userId, id);
  }
}
