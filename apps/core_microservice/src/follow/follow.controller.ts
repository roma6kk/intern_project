import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ICurrentUser } from '../auth/interfaces/ICurrentUser';

@ApiTags('Follows')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':id')
  @ApiOperation({ summary: 'Follow a user' })
  follow(@CurrentUser() user: ICurrentUser, @Param('id') targetId: string) {
    return this.followService.follow(user.userId, targetId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Unfollow a user' })
  unfollow(@CurrentUser() user: ICurrentUser, @Param('id') targetId: string) {
    return this.followService.unfollow(user.userId, targetId);
  }

  @Get('followers/me')
  @ApiOperation({ summary: 'Get my followers' })
  getMyFollowers(@CurrentUser() user: ICurrentUser) {
    return this.followService.getFollowers(user.userId);
  }

  @Get('following/me')
  @ApiOperation({ summary: 'Get who I follow' })
  getMyFollowing(@CurrentUser() user: ICurrentUser) {
    return this.followService.getFollowing(user.userId);
  }

  @Get('requests/me')
  @ApiOperation({ summary: 'Get pending follow requests' })
  getRequests(@CurrentUser() user: ICurrentUser) {
    return this.followService.getPendingRequests(user.userId);
  }

  @Patch('requests/:id/accept')
  @ApiOperation({ summary: 'Accept follow request' })
  acceptRequest(
    @CurrentUser() user: ICurrentUser,
    @Param('id') followerId: string,
  ) {
    return this.followService.acceptRequest(user.userId, followerId);
  }

  @Patch('requests/:id/decline')
  @ApiOperation({ summary: 'Decline follow request' })
  declineRequest(
    @CurrentUser() user: ICurrentUser,
    @Param('id') followerId: string,
  ) {
    return this.followService.removeFollower(user.userId, followerId);
  }
}
