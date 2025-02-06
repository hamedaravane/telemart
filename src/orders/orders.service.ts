import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { buyerId, items, shippingAddress, status } = createOrderDto;

    if (!items.length) {
      throw new BadRequestException('An order must contain at least one item.');
    }

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const orderItem = this.orderItemsRepository.create({
        product: { id: item.productId },
        quantity: item.quantity,
        totalPrice: 0,
      });

      totalAmount += orderItem.totalPrice;
      orderItems.push(orderItem);
    }

    const order = this.ordersRepository.create({
      buyer: { id: buyerId },
      status: status || OrderStatus.PENDING,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    return this.ordersRepository.save(order);
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['buyer', 'items', 'shipments'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.getOrderById(id);

    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['buyer', 'items', 'shipments'],
    });
  }
}
