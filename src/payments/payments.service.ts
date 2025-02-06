import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private ordersService: OrdersService,
  ) {}

  // Process a new payment
  async createPayment(
    orderId: number,
    transactionId: string,
    amount: number,
  ): Promise<Payment> {
    const order = await this.ordersService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (amount !== order.totalPrice) {
      throw new BadRequestException(
        `Invalid payment amount. Expected ${order.totalPrice}`,
      );
    }

    const payment = this.paymentsRepository.create({
      order,
      transactionId,
      amount,
      status: PaymentStatus.PENDING,
    });

    return this.paymentsRepository.save(payment);
  }

  // Confirm payment (after blockchain validation)
  async confirmPayment(transactionId: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { transactionId },
      relations: ['order'],
    });
    if (!payment) {
      throw new NotFoundException(
        `Payment with transaction ID ${transactionId} not found`,
      );
    }

    payment.status = PaymentStatus.SUCCESS;
    await this.paymentsRepository.save(payment);

    // Update order status to CONFIRMED
    await this.ordersService.updateOrderStatus(
      payment.order.id,
      OrderStatus.CONFIRMED,
    );

    return payment;
  }

  // Get all payments
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentsRepository.find({ relations: ['order'] });
  }

  // Get payments by Order ID
  async getPaymentsByOrder(orderId: number): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { order: { id: orderId } },
      relations: ['order'],
    });
  }

  // Get a specific payment
  async getPaymentById(paymentId: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['order'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }
    return payment;
  }
}
