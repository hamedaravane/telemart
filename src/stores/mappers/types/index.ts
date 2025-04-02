import { UserSummary } from '../../../users/mappers/types';
import { ProductPreview } from '../../../products/mappers/types';

export interface StorePreview {
  id: number | string;
  name: string;
  slug?: string;
  logo?: Media;
  reputation: number;
  isActive: boolean;
}

export interface StoreSummary extends StorePreview {
  tags?: string[];
  address: Address;
  description?: string;
}

export interface StoreDetail extends StoreSummary {
  owner: UserSummary;
  contactNumber?: string;
  email?: string;
  socialMediaLinks?: Record<string, string>;
  workingHours?: Record<string, WorkingHour>;
  products: ProductPreview[];
  createdAt: Date;
}
