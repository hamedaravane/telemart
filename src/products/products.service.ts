import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductType } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getProducts() {
    return this.productsRepository.find({ cache: true });
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const {
      name,
      price,
      productType,
      imageUrl,
      description,
      downloadLink,
      attributes,
      variants,
    } = createProductDto;
    let stock = createProductDto.stock;

    if (
      productType === ProductType.DIGITAL ||
      productType === ProductType.SERVICE
    ) {
      stock = undefined;
      if (productType === ProductType.DIGITAL && !downloadLink) {
        throw new BadRequestException(
          'Digital products must provide a download link.',
        );
      }
    } else if (productType === ProductType.PHYSICAL) {
      if (stock === undefined) {
        stock = 0;
      }
    }

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

    this.logger.log(`Creating product "${name}" of type ${productType}`);
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

    if (Object.prototype.hasOwnProperty.call(updateProductDto, 'productType')) {
      throw new BadRequestException('Changing product type is not allowed.');
    }

    if (
      (product.productType === ProductType.DIGITAL ||
        product.productType === ProductType.SERVICE) &&
      updateProductDto.stock !== undefined
    ) {
      throw new BadRequestException(
        'Stock is not applicable for digital or service products.',
      );
    }

    if (
      product.productType === ProductType.PHYSICAL &&
      updateProductDto.stock !== undefined
    ) {
      if (updateProductDto.stock < 0) {
        throw new BadRequestException('Stock cannot be negative.');
      }
    }

    Object.assign(product, updateProductDto);
    this.logger.log(`Updating product ID ${id}`);
    return this.productsRepository.save(product);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['attributes', 'variants', 'store'],
    });
  }
}
