import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ICurrentUser } from 'src/auth/interfaces/ICurrentUser';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, DeletedUserGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  create(
    @CurrentUser() user: ICurrentUser,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.postService.create(user.userId, createPostDto, files);
  }

  @Get('feed')
  @UseGuards(JwtAuthGuard, DeletedUserGuard)
  @ApiBearerAuth('JWT-auth')
  getFeed(
    @CurrentUser() user: ICurrentUser,
    @Query() pagination: PaginationDto,
  ) {
    return this.postService.getFeed(user.userId, pagination);
  }

  @Get('search')
  search(
    @Query() pagination: PaginationDto,
    @CurrentUser() user?: ICurrentUser,
  ) {
    return this.postService.findAll(pagination, user?.userId);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @CurrentUser() user?: ICurrentUser,
  ) {
    return this.postService.findAll(pagination, user?.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string, @CurrentUser() user: ICurrentUser) {
    return this.postService.archive(id, user.userId);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  update(
    @CurrentUser() user: ICurrentUser,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    // Handle array from FormData - can come as string[] or single string
    let deleteAssetIds: string[] = [];
    if (updatePostDto.deleteAssetIds) {
      if (Array.isArray(updatePostDto.deleteAssetIds)) {
        deleteAssetIds = updatePostDto.deleteAssetIds;
      } else if (typeof updatePostDto.deleteAssetIds === 'string') {
        deleteAssetIds = [updatePostDto.deleteAssetIds];
      }
    }

    return this.postService.update(
      id,
      user.userId,
      {
        ...updatePostDto,
        deleteAssetIds,
      },
      files,
    );
  }

  @Delete(':id')
  remove(@CurrentUser() user: ICurrentUser, @Param('id') id: string) {
    return this.postService.remove(id, user.userId);
  }
}
