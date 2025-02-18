import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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

  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>(
      'LIARA_BUCKET_ID',
      'telemart-files',
    );
    this.s3ApiEndpoint = this.configService.get<string>(
      'LIARA_S3_API_ENDPOINT',
      'storage.c2.liara.space',
    );
    this.s3Client = new S3Client({
      region: 'default',
      endpoint: this.s3ApiEndpoint,
    });
  }

  /**
   * Create a store with basic information.
   * The current user is assigned as the owner.
   */
  async createStoreBasic(user: User, dto: CreateStoreBasicDto): Promise<Store> {
    const store = this.storeRepository.create({
      ...dto,
      owner: user,
    });
    return await this.storeRepository.save(store);
  }

  /**
   * Find a store by its ID. Loads the owner relation.
   */
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

  /**
   * Utility method to ensure that the current user is the owner of the store.
   */
  checkOwner(user: User, store: Store) {
    if (store.owner.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this store',
      );
    }
  }

  /**
   * Update the store's location info.
   */
  async updateStoreLocation(
    user: User,
    id: number,
    dto: CreateStoreLocationDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    this.checkOwner(user, store);
    Object.assign(store, dto);
    return await this.storeRepository.save(store);
  }

  /**
   * Update the store's category.
   */
  async updateStoreCategory(
    user: User,
    id: number,
    dto: CreateStoreCategoryDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    this.checkOwner(user, store);
    store.category = dto.category;
    return await this.storeRepository.save(store);
  }

  /**
   * Update the store's working hours.
   */
  async updateStoreWorkingHours(
    user: User,
    id: number,
    dto: CreateStoreWorkingHoursDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    this.checkOwner(user, store);
    store.workingHours = dto.workingHours;
    return await this.storeRepository.save(store);
  }

  /**
   * Upload a store logo using AWS S3.
   *
   * The controller validates the file (type, size, etc.) before calling this method.
   * The file is then uploaded to S3 and its public URL is saved on the store entity.
   */
  async uploadStoreLogo(
    user: User,
    id: number,
    file: Express.Multer.File,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    this.checkOwner(user, store);

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
      console.error('Error uploading file to S3:', error);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }

    store.logoUrl = `https://${this.bucketName}.${this.s3ApiEndpoint}/${fileKey}`;
    return await this.storeRepository.save(store);
  }

  /**
   * General update endpoint for the store.
   */
  async updateStore(
    user: User,
    id: number,
    dto: UpdateStoreDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    this.checkOwner(user, store);
    Object.assign(store, dto);
    return await this.storeRepository.save(store);
  }
}
