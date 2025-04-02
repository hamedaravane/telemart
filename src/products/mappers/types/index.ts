import { ReviewPreview } from '../../../reviews/mappers/types';
import { StorePreview } from '../../../stores/mappers/types';
import { ProductType } from '../../product.entity';
import { Media } from '../../../common/mappers/types';

export interface ProductPreview {
  id: number | string;
  name: string;
  slug?: string;
  price: number;
  image: Media[];
  storeId: number | string;
}

export interface ProductSummary extends ProductPreview {
  productType: ProductType;
  store: StorePreview;
}

export interface ProductDetail extends ProductSummary {
  description?: string;
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
  categoryId: number;
  categoryPath?: ProductCategoryPath;
  stock?: number;
  downloadLink?: string;
  reviews?: ReviewPreview[];
  createdAt: Date;
}

export interface ProductAttribute {
  id: number;
  attributeName: string;
  attributeValue: string;
}

export interface ProductVariant {
  id: number;
  variantName: string;
  variantValue: string;
  additionalPrice?: number;
}
