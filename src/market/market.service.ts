import { Injectable, Logger } from '@nestjs/common';
import { StoresService } from '../stores/stores.service';
import { ProductsService } from '../products/products.service';
import { mapStorePreview, Store } from '../stores/entities/store.entity';
import {
  mapProductPreview,
  Product,
  ProductType,
} from '../products/entities/product.entity';
import { MarketPageResponse } from './market.entity';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  constructor(
    private readonly storeService: StoresService,
    private readonly productService: ProductsService,
  ) {}

  /**
   * Fetch stores and products concurrently.
   */
  private async fetchMarketData(): Promise<{
    stores: Store[];
    products: Product[];
  }> {
    this.logger.log('Fetching market data');
    const [stores, products] = await Promise.all([
      this.storeService.getStores(),
      this.productService.getProducts(),
    ]);
    return { stores, products };
  }

  /**
   * Filters and returns only approved products.
   */
  private getApprovedProducts(products: Product[]): Product[] {
    return products.filter((product) => product.isApproved);
  }

  /**
   * Sorts approved products by creation date (newest first).
   */
  private getSortedProducts(products: Product[]): Product[] {
    return this.getApprovedProducts(products).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  /**
   * Returns the most recent products.
   */
  private getRecentProducts(products: Product[]) {
    return this.getSortedProducts(products).slice(0, 8).map(mapProductPreview);
  }

  /**
   * Returns the featured products.
   */
  private getFeaturedProducts(products: Product[]) {
    return this.getSortedProducts(products).slice(0, 8).map(mapProductPreview);
  }

  /**
   * Returns the top-rated stores.
   */
  private getTopRatedStores(stores: Store[]) {
    return stores
      .sort((a, b) => b.reputation - a.reputation)
      .slice(0, 10)
      .map(mapStorePreview);
  }

  /**
   * Returns categorized products by type.
   */
  private getCategoryProducts(products: Product[]) {
    const approvedProducts = this.getApprovedProducts(products);
    return {
      [ProductType.DIGITAL]: approvedProducts
        .filter((p) => p.productType === ProductType.DIGITAL)
        .slice(0, 4)
        .map(mapProductPreview),
      [ProductType.PHYSICAL]: approvedProducts
        .filter((p) => p.productType === ProductType.PHYSICAL)
        .slice(0, 4)
        .map(mapProductPreview),
      [ProductType.SERVICE]: approvedProducts
        .filter((p) => p.productType === ProductType.SERVICE)
        .slice(0, 4)
        .map(mapProductPreview),
    };
  }

  /**
   * Fetches market data and returns a structured response.
   */
  async getMarketData(): Promise<MarketPageResponse> {
    const { stores, products } = await this.fetchMarketData();

    return {
      featuredProducts: this.getFeaturedProducts(products),
      categoryProducts: this.getCategoryProducts(products),
      topRatedStores: this.getTopRatedStores(stores),
      recentProducts: this.getRecentProducts(products),
    };
  }
}
