import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { v4 as uuidv4 } from 'uuid';
import { Queue } from 'bullmq';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @Inject('PAYMENT_QUEUE') private paymentQueue: Queue,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      paymentId: uuidv4(),
      status: PaymentStatus.PENDING,
    });

    this.logger.log(`Created new payment request: ${payment.paymentId}`);
    return this.paymentsRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({ where: { id } });
    if (!payment)
      throw new NotFoundException(`Payment with id ${id} not found`);
    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);

    if (updatePaymentDto.status) {
      if (!this.isValidTransition(payment.status, updatePaymentDto.status)) {
        throw new BadRequestException(
          `Invalid state transition from ${payment.status} to ${updatePaymentDto.status}`,
        );
      }
    }

    Object.assign(payment, updatePaymentDto);
    this.logger.log(
      `Updating payment ${payment.paymentId} to status ${payment.status}`,
    );
    return this.paymentsRepository.save(payment);
  }

  async confirmPayment(
    txHash: string,
    from: string,
    to: string,
    amount: string,
  ) {
    const existingPayment = await this.paymentsRepository.findOne({
      where: { transactionHash: txHash },
    });

    if (existingPayment) {
      this.logger.warn(`Duplicate transaction detected: ${txHash}`);
      return;
    }

    const payment = await this.paymentsRepository.findOne({
      where: {
        toWalletAddress: to,
        amount,
        status: PaymentStatus.PENDING,
      },
    });

    if (!payment)
      throw new NotFoundException('No matching payment request found');

    payment.status = PaymentStatus.COMPLETED;
    payment.transactionHash = txHash;

    this.logger.log(`Payment confirmed: ${txHash}`);
    await this.paymentsRepository.save(payment);
  }

  private isValidTransition(
    current: PaymentStatus,
    next: PaymentStatus,
  ): boolean {
    const transitions: Record<PaymentStatus, PaymentStatus[]> = {
      [PaymentStatus.PENDING]: [PaymentStatus.PROCESSING, PaymentStatus.FAILED],
      [PaymentStatus.PROCESSING]: [
        PaymentStatus.COMPLETED,
        PaymentStatus.FAILED,
      ],
      [PaymentStatus.COMPLETED]: [],
      [PaymentStatus.FAILED]: [PaymentStatus.REFUNDED],
      [PaymentStatus.REFUNDED]: [],
    };

    return transitions[current].includes(next);
  }
}
