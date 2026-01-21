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
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ICurrentUser } from 'src/auth/interfaces/ICurrentUser';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 5))
  create(
    @CurrentUser() user: ICurrentUser,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.postService.create(user.userId, createPostDto, files);
  }

  @Get('feed')
  getFeed(
    @CurrentUser() user: ICurrentUser,
    @Query() pagination: PaginationDto,
  ) {
    return this.postService.getFeed(user.userId, pagination);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.postService.findAll(pagination);
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
  update(
    @CurrentUser() user: ICurrentUser,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, user.userId, updatePostDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: ICurrentUser, @Param('id') id: string) {
    return this.postService.remove(id, user.userId);
  }
}
