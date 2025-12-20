import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createAssetDto: CreateAssetDto) {
    try {
      const asset = await this.prisma.asset.create({
        data: {
          url: createAssetDto.url,
          type: createAssetDto.type,
          post: createAssetDto.postId
            ? {
                connect: {
                  id: createAssetDto.postId,
                },
              }
            : undefined,
        },
      });

      this.logger.log(`Asset created successfully. ID: ${asset.id}`);
      return asset;
    } catch (error) {
      this.logger.error('Failed to create asset', error.stack);
      throw error;
    }
  }

  findAll() {
    return this.prisma.asset.findMany();
  }

  async findOne(id: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: {
        post: true,
      },
    });

    if (!asset) {
      this.logger.warn(`Asset with ID ${id} not found`);
      throw new NotFoundException('Asset not found');
    }

    return asset;
  }

  async update(id: string, updateAssetDto: UpdateAssetDto) {
    await this.findOne(id);

    try {
      const updatedAsset = await this.prisma.asset.update({
        where: { id },
        data: {
          url: updateAssetDto.url,
          type: updateAssetDto.type,
          post: updateAssetDto.postId
            ? { connect: { id: updateAssetDto.postId } }
            : undefined,
        },
      });

      this.logger.log(`Asset ${id} updated successfully`);
      return updatedAsset;
    } catch (error) {
      this.logger.error(`Failed to update asset ${id}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      const deletedAsset = await this.prisma.asset.delete({
        where: { id },
      });

      this.logger.log(`Asset ${id} removed successfully`);
      return deletedAsset;
    } catch (error) {
      this.logger.error(`Failed to remove asset ${id}`, error.stack);
      throw error;
    }
  }
}
