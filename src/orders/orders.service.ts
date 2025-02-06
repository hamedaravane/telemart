import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderShipment } from './order-shipment.entity';
import { Product } from '../products/product.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(OrderShipment)
    private orderShipmentsRepository: Repository<OrderShipment>,
    private usersService: UsersService,
  ) {}

  async placeOrder(
    buyerId: number,
    items: { productId: number; quantity: number }[],
    shippingAddress?: string,
  ): Promise<Order> {
    const buyer = await this.usersService.findByTelegramId(buyerId.toString());
    if (!buyer)
      throw new NotFoundException(`User with ID ${buyerId} not found`);

    if (items.length === 0)
      throw new BadRequestException('An order must contain at least one item.');

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.ordersRepository.manager.findOne(Product, {
        where: { id: item.productId },
      });

      if (!product)
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );

      const orderItem = this.orderItemsRepository.create({
        product,
        quantity: item.quantity,
        totalPrice: product.price * item.quantity,
      });

      totalAmount += orderItem.totalPrice;
      orderItems.push(orderItem);
    }

    const order = this.ordersRepository.create({
      buyer,
      status: OrderStatus.PENDING,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    return this.ordersRepository.save(order);
  }
}
