import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Create a new payment
  @Post()
  async createPayment(
    @Body('orderId') orderId: number,
    @Body('transactionId') transactionId: string,
    @Body('amount') amount: number,
  ): Promise<Payment> {
    return this.paymentsService.createPayment(orderId, transactionId, amount);
  }

  // Confirm payment (after blockchain validation)
  @Patch('confirm/:transactionId')
  async confirmPayment(
    @Param('transactionId') transactionId: string,
  ): Promise<Payment> {
    return this.paymentsService.confirmPayment(transactionId);
  }

  // Get all payments
  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentsService.getAllPayments();
  }

  // Get payments by Order ID
  @Get('order/:orderId')
  async getPaymentsByOrder(
    @Param('orderId') orderId: number,
  ): Promise<Payment[]> {
    return this.paymentsService.getPaymentsByOrder(orderId);
  }

  // Get a payment by ID
  @Get(':id')
  async getPaymentById(@Param('id') id: number): Promise<Payment> {
    return this.paymentsService.getPaymentById(id);
  }
}
