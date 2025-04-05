import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import {
  CreateStoreBasicDto,
  CreateStoreTagsDto,
  CreateStoreWorkingHoursDto,
  UpdateStoreDto,
} from './dto';
import { User } from '@/users/user.entity';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Address } from '@/locations/entities/address.entity';
import { AddressDto } from '@/locations/dto';
import { StoreWorkingHour } from '@/stores/entities/working-hour.entity';

@Injectable()
export class StoresService {
  private readonly logger = new Logger(StoresService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly s3Endpoint: string;

  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    private readonly workingHourRepo: Repository<StoreWorkingHour>,
    private readonly config: ConfigService,
  ) {
    this.bucketName = this.config.get<string>('BUCKET_NAME', 'telemart-files');
    this.s3Endpoint = this.config.get<string>(
      'API_ENDPOINT',
      'storage.c2.liara.space',
    );

    this.s3Client = new S3Client({
      region: 'default',
      endpoint: this.s3Endpoint,
    });
  }

  async getMyStores(user: User): Promise<Store[]> {
    return this.storeRepo.find({
      where: { owner: { id: user.id } },
      relations: ['owner', 'addresses', 'socialMediaLinks', 'workingHours'],
      order: { createdAt: 'DESC' },
    });
  }

  async getRecommendedStores(user: User): Promise<Store[]> {
    const tags =
      user.addresses?.flatMap((addr) => addr.city?.postalCode?.split('-')) ??
      [];

    return this.storeRepo
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.owner', 'owner')
      .leftJoinAndSelect('store.addresses', 'addresses')
      .where('store.isActive = true')
      .andWhere('store.tags && ARRAY[:...tags]', { tags })
      .orderBy('store.reputation', 'DESC')
      .limit(10)
      .getMany();
  }

  async getFeaturedStores(): Promise<Store[]> {
    return this.storeRepo.find({
      where: { isActive: true, isFeatured: true },
      relations: ['owner', 'addresses'],
      order: { reputation: 'DESC' },
      take: 12,
    });
  }

  async createStoreBasic(user: User, dto: CreateStoreBasicDto): Promise<Store> {
    const existing = await this.storeRepo.findOne({
      where: { owner: { id: user.id } },
    });
    if (existing) {
      throw new BadRequestException('You can only create one store for now.');
    }

    const store = this.storeRepo.create({
      ...dto,
      owner: user,
    });

    return this.storeRepo.save(store);
  }

  async findStoreById(id: number): Promise<Store> {
    const store = await this.storeRepo.findOne({
      where: { id },
      relations: ['owner', 'addresses', 'products'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found.`);
    }

    return store;
  }

  async createStoreAddress(
    user: User,
    storeId: number,
    dto: AddressDto,
  ): Promise<Store> {
    const store = await this.findStoreById(storeId);

    const address = this.addressRepo.create({
      ...dto,
      store,
    });

    await this.addressRepo.save(address);

    this.logger.log(`Address added to store #${storeId} by user #${user.id}`);

    return this.findStoreById(storeId);
  }

  async createStoreTags(
    storeId: number,
    dto: CreateStoreTagsDto,
  ): Promise<Store> {
    const store = await this.findStoreById(storeId);
    store.tags = dto.tags;
    this.logger.log(`Updated tags for store #${storeId}`);
    return this.storeRepo.save(store);
  }

  async createStoreWorkingHours(
    storeId: number,
    dto: CreateStoreWorkingHoursDto,
  ): Promise<Store> {
    const store = await this.findStoreById(storeId);

    await this.workingHourRepo.delete({ store: { id: store.id } });

    const hours = dto.workingHours?.map((item) =>
      this.workingHourRepo.create({ ...item, store }),
    );

    if (!hours) throw new BadRequestException('No working hours provided');

    for (const { open, close } of hours) {
      const [h1, m1] = open.split(':').map(Number);
      const [h2, m2] = close.split(':').map(Number);
      if (h1 * 60 + m1 >= h2 * 60 + m2) {
        throw new BadRequestException(
          `Opening time must be before closing time`,
        );
      }
    }

    await this.workingHourRepo.save(hours);
    return this.findStoreById(store.id);
  }

  async uploadStoreLogo(
    storeId: number,
    file: Express.Multer.File,
  ): Promise<Store> {
    const store = await this.findStoreById(storeId);

    const ext = file.originalname.split('.').pop();
    const fileKey = `stores/${store.id}/${randomUUID()}.${ext}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );
    } catch (err) {
      this.logger.error('S3 Upload Failed', err);
      throw new InternalServerErrorException('Failed to upload logo');
    }

    store.logoUrl = `https://${this.bucketName}.${this.s3Endpoint}/${fileKey}`;
    this.logger.log(`Uploaded logo for store #${storeId}`);
    return this.storeRepo.save(store);
  }

  async updateStore(storeId: number, dto: UpdateStoreDto): Promise<Store> {
    const store = await this.findStoreById(storeId);
    Object.assign(store, dto);
    this.logger.log(`Updated general info for store #${storeId}`);
    return this.storeRepo.save(store);
  }
}
