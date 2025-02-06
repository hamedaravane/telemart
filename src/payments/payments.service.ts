import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { amount, transactionId, method } = createPaymentDto;

    const existingPayment = await this.paymentsRepository.findOne({
      where: { transactionId },
    });

    if (existingPayment) {
      throw new BadRequestException(
        `Transaction ID ${transactionId} already exists`,
      );
    }

    const payment = this.paymentsRepository.create({
      amount,
      transactionId,
      method,
      status: PaymentStatus.PENDING,
    });

    return this.paymentsRepository.save(payment);
  }

  async getPaymentById(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async updatePayment(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.getPaymentById(id);

    Object.assign(payment, updatePaymentDto);
    return this.paymentsRepository.save(payment);
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentsRepository.find();
  }
}
