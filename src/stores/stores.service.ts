import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { User } from '../users/user.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async createStore(
    owner: User,
    name: string,
    logoUrl?: string,
    description?: string,
    contactNumber?: string,
    address?: string,
  ): Promise<Store> {
    const store = this.storesRepository.create({
      owner,
      name,
      logoUrl,
      description,
      contactNumber,
      address,
    });
    return this.storesRepository.save(store);
  }

  async getAllStores(): Promise<Store[]> {
    return this.storesRepository.find({ relations: ['owner'] });
  }

  async getStoresByOwner(userId: number): Promise<Store[]> {
    return this.storesRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
    });
  }

  async getStoreById(id: number): Promise<Store> {
    const store = await this.storesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async updateStore(id: number, updateData: Partial<Store>): Promise<Store> {
    await this.storesRepository.update(id, updateData);
    return this.getStoreById(id);
  }

  async deleteStore(id: number): Promise<void> {
    const result = await this.storesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
  }
}
