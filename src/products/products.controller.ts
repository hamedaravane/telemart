import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product, ProductType } from './product.entity';
import { StoresService } from '../stores/stores.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly storesService: StoresService,
  ) {}

  @Post()
  async createProduct(
    @Body('storeId') storeId: number,
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('productType') productType: ProductType,
    @Body('description') description?: string,
    @Body('imageUrl') imageUrl?: string,
    @Body('stock') stock?: number,
    @Body('downloadLink') downloadLink?: string,
    @Body('attributes') attributes?: { name: string; value: string }[],
  ): Promise<Product> {
    return this.productsService.createProduct(
      storeId,
      name,
      price,
      productType,
      description,
      imageUrl,
      stock,
      downloadLink,
      attributes,
    );
  }

  // Get all products
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  // Get products by store ID
  @Get('store/:storeId')
  async getProductsByStore(
    @Param('storeId') storeId: number,
  ): Promise<Product[]> {
    return this.productsService.getProductsByStore(storeId);
  }

  // Get a product by ID
  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  // Update a product
  @Patch(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() updateData: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateData);
  }

  // Delete a product
  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<{ message: string }> {
    await this.productsService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }
}
