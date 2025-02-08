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
import { ProductsService } from '../products/products.service';
import { Store } from '../stores/store.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { buyerId, items, shippingAddress, status } = createOrderDto;

    if (!items.length) {
      throw new BadRequestException('An order must contain at least one item.');
    }

    let totalAmount = 0;
    let orderStore: Store | null = null;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productsService.getProductById(item.productId);
      if (!orderStore) {
        orderStore = product.store;
      } else if (orderStore.id !== product.store.id) {
        throw new BadRequestException('All items must be from the same store.');
      }
      const totalPrice = product.price * item.quantity;
      const orderItem = this.orderItemsRepository.create({
        product: { id: item.productId },
        quantity: item.quantity,
        totalPrice,
      });
      totalAmount += totalPrice;
      orderItems.push(orderItem);
    }

    if (!orderStore) {
      throw new BadRequestException('Order store could not be determined.');
    }

    const order = this.ordersRepository.create({
      buyer: { id: buyerId },
      store: orderStore,
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
      relations: ['buyer', 'items', 'shipments', 'store'],
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
      relations: ['buyer', 'items', 'shipments', 'store'],
    });
  }
}
