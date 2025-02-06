import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { Store } from './store.entity';
import { UsersService } from '../users/users.service';

@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly usersService: UsersService,
  ) {}

  // Create a new store
  @Post()
  async createStore(
    @Body('ownerId') ownerId: number,
    @Body('name') name: string,
    @Body('logoUrl') logoUrl?: string,
    @Body('description') description?: string,
    @Body('contactNumber') contactNumber?: string,
    @Body('address') address?: string,
  ): Promise<Store> {
    const owner = await this.usersService.findByTelegramId(ownerId.toString());
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }

    return this.storesService.createStore(
      owner,
      name,
      logoUrl,
      description,
      contactNumber,
      address,
    );
  }

  // Get all stores
  @Get()
  async getAllStores(): Promise<Store[]> {
    return this.storesService.getAllStores();
  }

  // Get a store by ID
  @Get(':id')
  async getStoreById(@Param('id') id: number): Promise<Store> {
    return this.storesService.getStoreById(id);
  }

  // Get stores owned by a specific user
  @Get('owner/:ownerId')
  async getStoresByOwner(@Param('ownerId') ownerId: number): Promise<Store[]> {
    return this.storesService.getStoresByOwner(ownerId);
  }

  // Update a store
  @Patch(':id')
  async updateStore(
    @Param('id') id: number,
    @Body() updateData: Partial<Store>,
  ): Promise<Store> {
    return this.storesService.updateStore(id, updateData);
  }

  // Delete a store
  @Delete(':id')
  async deleteStore(@Param('id') id: number): Promise<{ message: string }> {
    await this.storesService.deleteStore(id);
    return { message: 'Store deleted successfully' };
  }
}
