import { Order } from '../order.entity';
import { OrderDetail, OrderSummary } from './types';
import { mapStoreToPreview } from '../../stores/mappers/store.mapper';
import { mapProductToPreview } from '../../products/mappers/product.mapper';
import { mapUserToSummary } from '../../users/mappers/user.mapper';
import { mapPaymentToSummary } from '../../payments/mappers/payment.mapper';

export function mapOrderToSummary(order: Order): OrderSummary {
  return {
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    store: mapStoreToPreview(order.store),
    deliveryDate: order.deliveryDate,
    createdAt: order.createdAt,
  };
}

export function mapOrderToDetail(order: Order): OrderDetail {
  return {
    ...mapOrderToSummary(order),
    items: order.items.map((item) => ({
      product: mapProductToPreview(item.product),
      quantity: item.quantity,
      totalPrice: Number(item.totalPrice),
    })),
    shipment: order.shipments?.[0]
      ? {
          id: order.shipments[0].id,
          trackingNumber: order.shipments[0].trackingNumber,
          courierService: order.shipments[0].courierService,
          deliveryEstimate: order.shipments[0].deliveryEstimate,
          shippedAt: order.shipments[0].shippedAt,
          status: 'in_transit',
        }
      : undefined,
    payment: order.payments?.[0]
      ? mapPaymentToSummary(order.payments[0])
      : undefined,
    buyer: mapUserToSummary(order.buyer),
  };
}
