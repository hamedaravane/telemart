import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const {
      name,
      price,
      productType,
      imageUrl,
      description,
      downloadLink,
      stock,
      attributes,
      variants,
    } = createProductDto;

    const product = this.productsRepository.create({
      name,
      price,
      productType,
      imageUrl,
      description,
      downloadLink,
      stock,
      attributes,
      variants,
    });

    return this.productsRepository.save(product);
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['attributes', 'variants', 'store'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['attributes', 'variants', 'store'],
    });
  }
}
