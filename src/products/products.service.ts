import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductType } from './product.entity';
import { ProductAttribute } from './product-attribute.entity';
import { ProductVariant } from './product-variant.entity';
import { Store } from '../stores/store.entity';
import { StoresService } from '../stores/stores.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private productVariantsRepository: Repository<ProductVariant>,
    @InjectRepository(ProductAttribute)
    private productAttributesRepository: Repository<ProductAttribute>,
    private storesService: StoresService,
    private usersService: UsersService,
  ) {}

  async createProduct(
    ownerId: number,
    storeId: number,
    name: string,
    price: number,
    productType: ProductType,
    description: string = '',
    imageUrl: string,
    stock?: number,
    downloadLink?: string,
    attributes?: { name: string; value: string }[],
    variants?: { name: string; value: string; additionalPrice?: number }[],
  ): Promise<Product> {
    const store: Store = await this.storesService.getStoreById(storeId);
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const owner = await this.usersService.findByTelegramId(ownerId.toString());
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }

    if (
      store.owner.id !== owner.id &&
      !store.admins.some((admin) => admin.id === owner.id)
    ) {
      throw new ForbiddenException(
        'You are not authorized to add products to this store.',
      );
    }

    if (productType === ProductType.PHYSICAL && stock === undefined) {
      throw new BadRequestException('Stock is required for physical products.');
    }
    if (productType === ProductType.DIGITAL && !downloadLink) {
      throw new BadRequestException(
        'Download link is required for digital products.',
      );
    }

    const product: Product = this.productsRepository.create({
      store,
      name,
      price,
      productType,
      description,
      imageUrl,
      stock: productType === ProductType.PHYSICAL ? stock : null,
      downloadLink: productType === ProductType.DIGITAL ? downloadLink : null,
    });

    if (attributes && attributes.length > 0) {
      product.attributes = attributes.map((attr) => {
        const attribute = new ProductAttribute();
        attribute.attributeName = attr.name;
        attribute.attributeValue = attr.value;
        return attribute;
      });
    }

    if (variants && variants.length > 0) {
      product.variants = variants.map((variant) => {
        const variantEntity = new ProductVariant();
        variantEntity.variantName = variant.name;
        variantEntity.variantValue = variant.value;
        variantEntity.additionalPrice = variant.additionalPrice ?? 0;
        return variantEntity;
      });
    }

    const savedProduct = await this.productsRepository.save(product);
    return this.getProductById(savedProduct.id);
  }

  async getProductById(productId: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['store'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return product;
  }
}
