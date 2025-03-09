import { ProductPreview, ProductType } from '../products/product.entity';
import { StorePreview } from '../stores/store.entity';
import { ApiProperty } from '@nestjs/swagger';

export class MarketPageResponse {
  @ApiProperty({
    type: [ProductPreview],
    description: 'List of featured products',
  })
  featuredProducts: ProductPreview[];

  @ApiProperty({
    properties: {
      [ProductType.SERVICE]: {
        type: [ProductPreview],
        description: 'List of services',
      },
      [ProductType.PHYSICAL]: {
        type: [ProductPreview],
        description: 'List of physical products',
      },
      [ProductType.DIGITAL]: {
        type: [ProductPreview],
        description: 'List of digital products',
      },
    },
    description: 'Products categorized by type',
  })
  categoryProducts: {
    [ProductType.SERVICE]: ProductPreview[];
    [ProductType.PHYSICAL]: ProductPreview[];
    [ProductType.DIGITAL]: ProductPreview[];
  };

  @ApiProperty({
    type: [StorePreview],
    description: 'List of top-rated stores',
  })
  topRatedStores: StorePreview[];

  @ApiProperty({
    type: [ProductPreview],
    description: 'List of recent products',
  })
  recentProducts: ProductPreview[];
}
