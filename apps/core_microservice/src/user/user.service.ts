import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(UserService.name);

  private hash(password: string): string {
    return password;
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.account.findFirst({
      where: {
        OR: [
          { phoneNumber: createUserDto.phoneNumber },
          { username: createUserDto.username },
        ],
      },
    });
    if (existingUser) {
      this.logger.warn(
        `Registration failed. User already exists. ${createUserDto.phoneNumber}, ${createUserDto.username}`,
      );
      throw new BadRequestException(
        'Неоторые поля уже заняты другим пользователем',
      );
    }
    try {
      const hashedPass = this.hash(createUserDto.password); // Пока что абстракция
      const newUser = await this.prisma.user.create({
        data: {
          account: {
            create: {
              phoneNumber: createUserDto.phoneNumber,
              email: createUserDto.email ?? undefined,
              username: createUserDto.username,
              passwordHash: hashedPass,
            },
          },
          profile: {
            create: {
              firstName: createUserDto.firstName,
              secondName: createUserDto.secondName ?? undefined,
            },
          },
        },
        include: {
          account: {
            select: {
              username: true,
              email: true,
            },
          },
          profile: true,
        },
      });
      this.logger.log(
        `User ${newUser.account?.username} registered successfully. ID: ${newUser.id}`,
      );
      return newUser;
    } catch (error) {
      this.logger.error(
        `Failed to create new user in DB`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        account: {
          select: {
            username: true,
            phoneNumber: true,
            email: true,
          },
        },
        profile: {
          select: {
            firstName: true,
            secondName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        account: {
          select: {
            username: true,
            phoneNumber: true,
            email: true,
          },
        },
        profile: {
          select: {
            firstName: true,
            secondName: true,
            avatarUrl: true,
          },
        },
      },
    });
    if (!user) {
      this.logger.warn(`User ${id} not found`);
      throw new NotFoundException('User not found');
    }
    this.logger.log(`User ${id} founded`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    let newHash: string | undefined = undefined;
    if (updateUserDto.password) {
      newHash = this.hash(updateUserDto.password);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        account: {
          update: {
            phoneNumber: updateUserDto.phoneNumber,
            email: updateUserDto.email ?? undefined,
            username: updateUserDto.username,
            passwordHash: newHash,
          },
        },
        profile: {
          update: {
            firstName: updateUserDto.firstName,
            secondName: updateUserDto.secondName ?? undefined,
          },
        },
      },
      include: {
        account: {
          select: {
            username: true,
          },
        },
        profile: {
          select: {
            firstName: true,
            secondName: true,
            avatarUrl: true,
            bio: true,
            birthday: true,
          },
        },
      },
    });
    this.logger.log(`User ${updatedUser.id} updated`);
    return updatedUser;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({
      where: { id },
    });
    this.logger.log(`User ${id} deleted.`);
    return { id, deleted: true };
  }
}
