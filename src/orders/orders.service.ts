import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { ProductsService } from '../products/products.service';
import { Store } from '../stores/store.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

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

      if (product.stock !== undefined && product.stock !== null) {
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Product ${product.name} does not have enough stock.`,
          );
        }
        const newStock = product.stock - item.quantity;
        await this.productsService.updateProduct(product.id, {
          stock: newStock,
        });
      }

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

    this.logger.log(
      `Creating order for buyer ${buyerId} with total amount ${totalAmount}`,
    );
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

    if (updateOrderDto.items && order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        'Order items can only be updated while the order is pending.',
      );
    }

    if (updateOrderDto.items) {
      let newTotalAmount = 0;
      const newOrderItems: OrderItem[] = [];
      for (const itemDto of updateOrderDto.items) {
        const product = await this.productsService.getProductById(
          itemDto.productId,
        );
        const totalPrice = product.price * itemDto.quantity;
        newTotalAmount += totalPrice;
        const orderItem = this.orderItemsRepository.create({
          product: { id: itemDto.productId },
          quantity: itemDto.quantity,
          totalPrice,
        });
        newOrderItems.push(orderItem);
      }
      order.items = newOrderItems;
      order.totalAmount = newTotalAmount;
    }

    if (updateOrderDto.status) {
      if (!this.validateStatusTransition(order.status, updateOrderDto.status)) {
        throw new BadRequestException(
          `Invalid status transition from ${order.status} to ${updateOrderDto.status}`,
        );
      }
    }

    if (updateOrderDto.shippingAddress !== undefined) {
      order.shippingAddress = updateOrderDto.shippingAddress;
    }

    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['buyer', 'items', 'shipments', 'store'],
    });
  }

  private validateStatusTransition(
    current: OrderStatus,
    next: OrderStatus,
  ): boolean {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    return allowedTransitions[current].includes(next);
  }
}
