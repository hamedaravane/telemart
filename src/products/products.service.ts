import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private storesService: StoresService,
  ) {}

  // Create a new product
  async createProduct(
    storeId: number,
    name: string,
    price: number,
    imageUrl: string,
    description?: string,
    attributes?: any,
  ): Promise<Product> {
    const store = await this.storesService.getStoreById(storeId);
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const product = this.productsRepository.create({
      store,
      name,
      price,
      imageUrl,
      description,
      attributes,
    });

    return this.productsRepository.save(product);
  }

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['store'] });
  }

  // Get all products in a specific store
  async getProductsByStore(storeId: number): Promise<Product[]> {
    return this.productsRepository.find({
      where: { store: { id: storeId } },
      relations: ['store'],
    });
  }

  // Get a product by ID
  async getProductById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['store'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // Update product details
  async updateProduct(
    id: number,
    updateData: Partial<Product>,
  ): Promise<Product> {
    await this.productsRepository.update(id, updateData);
    return this.getProductById(id);
  }

  // Delete a product
  async deleteProduct(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
