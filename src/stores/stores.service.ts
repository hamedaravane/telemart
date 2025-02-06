import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { UsersService } from '../users/users.service';
import { StoreCategory } from './category.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    private usersService: UsersService,
  ) {}

  async createStore(
    ownerId: number,
    name: string,
    category: StoreCategory,
    description?: string,
    contactNumber?: string,
    email?: string,
    address?: string,
  ): Promise<Store> {
    const owner = await this.usersService.findByTelegramId(ownerId.toString());
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }

    if (!Object.values(StoreCategory).includes(category)) {
      throw new BadRequestException(`Invalid store category`);
    }

    const store = this.storesRepository.create({
      owner,
      name,
      description,
      category,
      contactNumber,
      email,
      address,
      admins: [],
    });

    return this.storesRepository.save(store);
  }

  async addAdmin(storeId: number, adminId: number): Promise<Store> {
    const store = await this.getStoreById(storeId);
    const admin = await this.usersService.findByTelegramId(adminId.toString());

    if (store.owner.id === admin.id) {
      throw new BadRequestException(`Owner cannot be an admin`);
    }

    store.admins.push(admin);
    return this.storesRepository.save(store);
  }

  async getStoreById(storeId: number): Promise<Store> {
    const store = await this.storesRepository.findOne({
      where: { id: storeId },
      relations: ['owner', 'admins', 'products', 'orders', 'reviews'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    return store;
  }
}
