import { Injectable, Logger } from '@nestjs/common';
import { StoresService } from '../stores/stores.service';
import { ProductsService } from '../products/products.service';
import { mapStorePreview, Store } from '../stores/store.entity';
import {
  mapProductPreview,
  Product,
  ProductType,
} from '../products/product.entity';
import { MarketPageResponse } from './market.entity';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private stores = new Array<Store>();
  private products = new Array<Product>();
  constructor(
    private readonly storeService: StoresService,
    private readonly productService: ProductsService,
  ) {}

  private async fillStores() {
    this.logger.log('Getting stores');
    this.stores = await this.storeService.getStores();
  }

  private async fillProducts() {
    this.logger.log('Getting products');
    this.products = await this.productService.getProducts();
  }

  private getApprovedProducts(): Product[] {
    return this.products.filter((product) => product.isApproved);
  }

  private getSortedProducts() {
    return this.getApprovedProducts().sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  private getRecentProducts() {
    return this.getSortedProducts().slice(0, 8).map(mapProductPreview);
  }

  private getFeaturedProducts() {
    return this.getSortedProducts().slice(0, 8).map(mapProductPreview);
  }

  private getTopRatedStores() {
    return this.stores
      .sort((a, b) => b.reputation - a.reputation)
      .slice(0, 10)
      .map(mapStorePreview);
  }

  private getCategoryProducts() {
    const approvedProducts = this.getApprovedProducts();
    return {
      digital: approvedProducts
        .filter((p) => p.productType === ProductType.DIGITAL)
        .slice(0, 4)
        .map(mapProductPreview),
      physical: approvedProducts
        .filter((p) => p.productType === ProductType.PHYSICAL)
        .slice(0, 4)
        .map(mapProductPreview),
      service: approvedProducts
        .filter((p) => p.productType === ProductType.DIGITAL)
        .slice(0, 4)
        .map(mapProductPreview),
    };
  }

  async getMarketData(): Promise<MarketPageResponse> {
    await this.fillStores();
    await this.fillProducts();
    return {
      categoryProducts: this.getCategoryProducts(),
      featuredProducts: this.getFeaturedProducts(),
      topRatedStores: this.getTopRatedStores(),
      recentProducts: this.getRecentProducts(),
    };
  }
}
