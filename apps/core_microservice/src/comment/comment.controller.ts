import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ICurrentUser } from 'src/auth/interfaces/ICurrentUser';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Comments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a comment or reply' })
  create(
    @CurrentUser() user: ICurrentUser,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(user.userId, createCommentDto);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get root comments for a post' })
  findByPost(
    @Param('postId') postId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.commentService.findByPostId(postId, pagination);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get replies for a specific comment' })
  findReplies(@Param('id') id: string) {
    return this.commentService.findReplies(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: ICurrentUser,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, user.userId, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  remove(@Param('id') id: string, @CurrentUser() user: ICurrentUser) {
    return this.commentService.remove(id, user.userId);
  }
}
