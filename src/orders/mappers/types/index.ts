import { PaymentSummary } from '../../../payments/mappers/types';
import { UserSummary } from '../../../users/mappers/types';
import { ProductPreview } from '../../../products/mappers/types';
import { OrderStatus } from '../../order.entity';
import { StorePreview } from '../../../stores/mappers/types';

export interface OrderItemPreview {
  product: ProductPreview;
  quantity: number;
  totalPrice: number;
}

export interface OrderSummary {
  id: number | string;
  status: OrderStatus;
  totalAmount: number;
  store: StorePreview;
  deliveryDate: Date;
  createdAt: Date;
}

export interface OrderDetail extends OrderSummary {
  items: OrderItemPreview[];
  shipment?: OrderShipment;
  payment?: PaymentSummary;
  buyer: UserSummary;
}

export interface OrderShipment {
  id: number;
  trackingNumber: string;
  carrierTrackingUrl?: string;
  status?: 'created' | 'in_transit' | 'delivered' | 'failed';
  courierService: string;
  deliveryEstimate: Date;
  shippedAt: Date;
}
