import { Order } from '@/orders/order.entity';
import { mapStoreToPreview } from '@/stores/mappers/store.mapper';
import { mapProductToPreview } from '@/products/mappers/product.mapper';
import { mapPaymentToSummary } from '@/payments/mappers/payment.mapper';
import { OrderDetailDto, OrderSummaryDto } from '@/orders/dto';
import { mapUserToSummary } from '@/users/mappers/user.mapper';

export function mapOrderToSummary(order: Order): OrderSummaryDto {
  return {
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    store: mapStoreToPreview(order.store),
    deliveryDate: order.deliveryDate ?? new Date(),
    createdAt: order.createdAt,
  };
}

export function mapOrderToDetail(order: Order): OrderDetailDto {
  return {
    ...mapOrderToSummary(order),
    items: order.items.map((item) => ({
      product: mapProductToPreview(item.product),
      quantity: item.quantity,
      totalPrice: Number(item.totalPrice),
    })),
    shipment: order.shipment
      ? {
          id: order.shipment.id,
          trackingNumber: order.shipment.trackingNumber,
          courierService: order.shipment.courierService,
          deliveryEstimate: order.shipment.deliveryEstimate ?? new Date(),
          shippedAt: order.shipment.shippedAt,
          status: 'in_transit',
          carrierTrackingUrl: '',
        }
      : undefined,
    payment: order.payment ? mapPaymentToSummary(order.payment) : undefined,
    buyer: mapUserToSummary(order.buyer),
  };
}
