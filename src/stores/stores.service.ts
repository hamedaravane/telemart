import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const {
      name,
      category,
      contactNumber,
      email,
      address,
      logoUrl,
      description,
      socialMediaLinks,
      bankAccountDetails,
      reputation,
      workingHours,
    } = createStoreDto;

    const existingStore = await this.storesRepository.findOne({
      where: { name },
    });

    if (existingStore) {
      throw new BadRequestException(`Store with name "${name}" already exists`);
    }

    const store = this.storesRepository.create({
      name,
      category,
      contactNumber,
      email,
      address,
      logoUrl,
      description,
      socialMediaLinks,
      bankAccountDetails,
      reputation,
      workingHours,
    });

    return this.storesRepository.save(store);
  }

  async findById(id: number): Promise<Store> {
    const store = await this.storesRepository.findOne({
      where: { id },
      relations: ['owner', 'products', 'orders', 'reviews'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return store;
  }

  async updateStore(
    id: number,
    updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    const store = await this.findById(id);

    Object.assign(store, updateStoreDto);
    return this.storesRepository.save(store);
  }

  async getAllStores(): Promise<Store[]> {
    return this.storesRepository.find({
      relations: ['owner', 'products', 'orders', 'reviews'],
    });
  }
}
