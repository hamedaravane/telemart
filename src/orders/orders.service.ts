import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  // Create a new order
  async createOrder(
    customerId: number,
    productId: number,
    quantity: number,
  ): Promise<Order> {
    const customer = await this.usersService.findByTelegramId(
      customerId.toString(),
    );
    if (!customer) {
      throw new NotFoundException(`User with ID ${customerId} not found`);
    }

    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (quantity <= 0) {
      throw new BadRequestException(`Quantity must be greater than 0`);
    }

    const totalPrice = product.price * quantity;

    const order = this.ordersRepository.create({
      customer,
      product,
      quantity,
      totalPrice,
      status: OrderStatus.PENDING,
    });

    return this.ordersRepository.save(order);
  }

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['customer', 'product'] });
  }

  // Get orders by customer ID
  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { customer: { id: customerId } },
      relations: ['customer', 'product'],
    });
  }

  // Get a single order by ID
  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['customer', 'product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }

  // Update order status
  async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
  ): Promise<Order> {
    await this.ordersRepository.update(orderId, { status });
    return this.getOrderById(orderId);
  }

  // Delete an order
  async deleteOrder(orderId: number): Promise<void> {
    const result = await this.ordersRepository.delete(orderId);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  }
}
