import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@/products/entities/product.entity';
import { Store } from '@/stores/entities/store.entity';
import { ProductVariant } from '@/products/entities/product-variant.entity';
import { ProductImage } from '@/products/entities/product-image.entity';
import {
  InventoryEvent,
  InventoryEventType,
} from '@/products/entities/inventory-event.entity';
import {
  CreateProductDto,
  CreateProductVariantDto,
  UpdateProductDto,
} from '@/products/dto';
import { User } from '@/users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(InventoryEvent)
    private readonly inventoryRepo: Repository<InventoryEvent>,
  ) {}

  async getStoreProducts(storeId: number): Promise<Product[]> {
    return this.productRepo.find({
      where: { store: { id: storeId } },
      relations: ['images'],
    });
  }

  async getProductById(storeId: number, productId: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id: productId, store: { id: storeId } },
      relations: [
        'store',
        'images',
        'attributes',
        'variants',
        'variants.attributeValues',
        'inventoryEvents',
        'reviews',
      ],
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async createProduct(
    user: User,
    storeId: number,
    dto: CreateProductDto,
  ): Promise<Product> {
    const store = await this.storeRepo.findOne({
      where: { id: storeId },
      relations: ['owner'],
    });

    if (!store) throw new NotFoundException('Store not found');
    if (store.owner.id !== user.id)
      throw new ForbiddenException('You do not own this store');

    const product = this.productRepo.create({
      name: dto.name,
      price: dto.price,
      description: dto.description,
      productType: dto.productType,
      downloadLink: dto.downloadLink,
      store,
    });

    if (dto.attributes?.length) {
      product.attributes = dto.attributes.map((attr) =>
        this.attrRepo.create({
          attributeName: attr.attributeName,
          attributeValue: attr.attributeValue,
        }),
      );
    }

    if (dto.variants?.length) {
      product.variants = dto.variants.map((variant: CreateProductVariantDto) =>
        this.variantRepo.create({
          variantName: variant.variantName,
          variantValue: variant.variantValue,
          additionalPrice: variant.additionalPrice,
        }),
      );
    }

    const created = await this.productRepo.save(product);

    if (dto.stock !== undefined && dto.stock !== null) {
      const inventory = this.inventoryRepo.create({
        product: created,
        type: InventoryEventType.INITIAL,
        quantity: dto.stock,
        note: 'Initial stock',
      });
      await this.inventoryRepo.save(inventory);
    }

    return created;
  }

  async updateProduct(
    user: User,
    storeId: number,
    productId: number,
    dto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(storeId, productId);

    if (product.store.owner.id !== user.id)
      throw new ForbiddenException('You do not own this store');

    Object.assign(product, {
      name: dto.name ?? product.name,
      price: dto.price ?? product.price,
      description: dto.description ?? product.description,
      downloadLink: dto.downloadLink ?? product.downloadLink,
    });

    if (dto.attributes) {
      await this.attrRepo.delete({ product: { id: product.id } });
      product.attributes = dto.attributes.map((attr) =>
        this.attrRepo.create({
          attributeName: attr.attributeName,
          attributeValue: attr.attributeValue,
          product,
        }),
      );
    }

    if (dto.variants) {
      await this.variantRepo.delete({ product: { id: product.id } });
      product.variants = dto.variants.map((variant) =>
        this.variantRepo.create({
          variantName: variant.variantName,
          variantValue: variant.variantValue,
          additionalPrice: variant.additionalPrice,
          product,
        }),
      );
    }

    if (dto.stock !== undefined && dto.stock !== null) {
      const currentStock = await this.calculateStock(product.id);
      const delta = dto.stock - currentStock;
      if (delta !== 0) {
        const event = this.inventoryRepo.create({
          product,
          type: InventoryEventType.MANUAL_ADJUSTMENT,
          quantity: delta,
          note: 'Manual stock adjustment via update',
        });
        await this.inventoryRepo.save(event);
      }
    }

    return await this.productRepo.save(product);
  }

  async deleteProduct(user: User, storeId: number, productId: number) {
    const product = await this.getProductById(storeId, productId);

    if (product.store.owner.id !== user.id)
      throw new ForbiddenException('You do not own this store');

    return this.productRepo.remove(product);
  }

  async calculateStock(productId: number): Promise<number> {
    const events = await this.inventoryRepo.find({
      where: { product: { id: productId } },
    });
    return events.reduce((sum, e) => sum + e.quantity, 0);
  }
}
