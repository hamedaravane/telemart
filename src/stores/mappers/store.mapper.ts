import { Store } from '../store.entity';
import { StorePreview, StoreSummary, StoreDetail } from './types';
import { mapUserToSummary } from '../../users/mappers/user.mapper';
import { mapProductToPreview } from '../../products/mappers/product.mapper';

export function mapStoreToPreview(store: Store): StorePreview {
  return {
    id: store.id,
    name: store.name,
    slug: undefined,
    logo: store.logoUrl ? [{ url: store.logoUrl }] : [],
    reputation: store.reputation,
    isActive: true,
  };
}

export function mapStoreToSummary(store: Store): StoreSummary {
  return {
    ...mapStoreToPreview(store),
    tags: [],
    address: null,
    description: store.description ?? undefined,
  };
}

export function mapStoreToDetail(store: Store): StoreDetail {
  return {
    ...mapStoreToSummary(store),
    owner: mapUserToSummary(store.owner),
    contactNumber: store.contactNumber ?? undefined,
    email: store.email ?? undefined,
    socialMediaLinks: store.socialMediaLinks ?? undefined,
    workingHours: store.workingHours ?? undefined,
    products: store.products?.map(mapProductToPreview) ?? [],
    createdAt: store.createdAt,
  };
}
