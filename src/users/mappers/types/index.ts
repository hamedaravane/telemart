import { UserRole } from '../../user.entity';
import { StorePreview } from '../../../stores/mappers/types';
import { OrderSummary } from '../../../orders/mappers/types';
import { Address } from '../../../locations/mappers/types';
import { Media } from '../../../common/mappers/types';

export interface UserPublicPreview {
  id: number | string;
  username?: string;
  handle?: string;
  photo?: Media;
}

export interface UserSummary extends UserPublicPreview {
  firstName: string;
  lastName?: string;
  role: UserRole;
  address: Address;
}

export interface UserPrivateProfile extends UserSummary {
  telegramId: string;
  phoneNumber?: string;
  email?: string;
  walletAddress?: string;
  stores?: StorePreview[];
  orders?: OrderSummary[];
}
