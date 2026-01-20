import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ICurrentUser } from '../auth/interfaces/ICurrentUser';

@ApiTags('Likes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('post/:id')
  @ApiOperation({ summary: 'Toggle like on a Post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  async togglePostLike(
    @CurrentUser() user: ICurrentUser,
    @Param('id') postId: string,
  ) {
    return this.likeService.toggleLike(user.userId, postId, 'POST');
  }

  @Post('comment/:id')
  @ApiOperation({ summary: 'Toggle like on a Comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  async toggleCommentLike(
    @CurrentUser() user: ICurrentUser,
    @Param('id') commentId: string,
  ) {
    return this.likeService.toggleLike(user.userId, commentId, 'COMMENT');
  }

  @Get('post/:id')
  @ApiOperation({ summary: 'Get users who liked a Post' })
  async getPostLikes(@Param('id') postId: string) {
    return this.likeService.getLikes(postId, 'POST');
  }

  @Get('comment/:id')
  @ApiOperation({ summary: 'Get users who liked a Comment' })
  async getCommentLikes(@Param('id') commentId: string) {
    return this.likeService.getLikes(commentId, 'COMMENT');
  }
}
