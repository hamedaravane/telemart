import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { StoresService } from './stores.service';
import { Store } from './store.entity';
import { StoreCategory } from './category.entity';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  async createStore(
    @Body('ownerId') ownerId: number,
    @Body('name') name: string,
    @Body('category') category: StoreCategory,
    @Body('description') description?: string,
    @Body('contactNumber') contactNumber?: string,
    @Body('email') email?: string,
    @Body('address') address?: string,
  ): Promise<Store> {
    return this.storesService.createStore(
      ownerId,
      name,
      category,
      description,
      contactNumber,
      email,
      address,
    );
  }

  @Patch(':storeId/add-admin/:adminId')
  async addAdmin(
    @Param('storeId') storeId: number,
    @Param('adminId') adminId: number,
  ): Promise<Store> {
    return this.storesService.addAdmin(storeId, adminId);
  }

  @Get(':id')
  async getStoreById(@Param('id') id: number): Promise<Store> {
    return this.storesService.getStoreById(id);
  }
}
