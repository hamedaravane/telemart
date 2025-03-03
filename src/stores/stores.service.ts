import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import {
  CreateStoreBasicDto,
  CreateStoreCategoryDto,
  CreateStoreLocationDto,
  CreateStoreWorkingHoursDto,
} from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { User } from '../users/user.entity';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StoresService {
  private s3Client: S3Client;
  private readonly bucketName: string;
  private readonly s3ApiEndpoint: string;
  private readonly logger = new Logger(StoresService.name);

  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>(
      'BUCKET_NAME',
      'telemart-files',
    );
    this.s3ApiEndpoint = this.configService.get<string>(
      'API_ENDPOINT',
      'storage.c2.liara.space',
    );
    this.s3Client = new S3Client({
      region: 'default',
      endpoint: this.s3ApiEndpoint,
    });
  }

  async createStoreBasic(user: User, dto: CreateStoreBasicDto): Promise<Store> {
    const store = this.storeRepository.create({
      ...dto,
      owner: user,
    });
    this.logger.log(`Creating store "${dto.name}" for user ${user.id}`);
    return await this.storeRepository.save(store);
  }

  async findStoreById(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }
    return store;
  }

  async updateStoreLocation(
    user: User,
    id: number,
    dto: CreateStoreLocationDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    Object.assign(store, dto);
    this.logger.log(`Updating location for store ID ${id}`);
    return await this.storeRepository.save(store);
  }

  async updateStoreCategory(
    user: User,
    id: number,
    dto: CreateStoreCategoryDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    store.category = dto.category;
    this.logger.log(`Updating category for store ID ${id} to ${dto.category}`);
    return await this.storeRepository.save(store);
  }

  async updateStoreWorkingHours(
    user: User,
    id: number,
    dto: CreateStoreWorkingHoursDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    if (dto.workingHours) {
      this.validateWorkingHours(dto.workingHours);
    }
    store.workingHours = dto.workingHours;
    this.logger.log(`Updating working hours for store ID ${id}`);
    return await this.storeRepository.save(store);
  }

  async uploadStoreLogo(
    user: User,
    id: number,
    file: Express.Multer.File,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    const fileExtension = file.originalname.split('.').pop();
    const fileKey = `stores/${store.id}/${randomUUID()}.${fileExtension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error('Error uploading file to S3:', error);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }

    store.logoUrl = `https://${this.bucketName}.${this.s3ApiEndpoint}/${fileKey}`;
    this.logger.log(`Uploaded new logo for store ID ${id}`);
    return await this.storeRepository.save(store);
  }

  async updateStore(
    user: User,
    id: number,
    dto: UpdateStoreDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    this.logger.log(
      `Updating store ID ${id} with data: ${JSON.stringify(dto)}`,
    );
    Object.assign(store, dto);
    return await this.storeRepository.save(store);
  }

  private validateWorkingHours(
    workingHours: Record<string, { open: string; close: string }>,
  ): void {
    for (const day in workingHours) {
      const { open, close } = workingHours[day];
      const [openHour, openMin] = open.split(':').map(Number);
      const [closeHour, closeMin] = close.split(':').map(Number);
      const openTotal = openHour * 60 + openMin;
      const closeTotal = closeHour * 60 + closeMin;
      if (openTotal >= closeTotal) {
        throw new BadRequestException(
          `Invalid working hours for ${day}: open time must be before close time.`,
        );
      }
    }
  }
}
