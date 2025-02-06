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
import axios from 'axios';

export interface TonTransaction {
  account_id: string;
  lt: string;
  tx_hash: string;
  utime: number;

  data: {
    in_msg: {
      source: string;
      destination: string;
      value: string;
      message?: string;
    };
    out_msgs: Array<{
      source: string;
      destination: string;
      value: string;
      message?: string;
    }>;
  };
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { amount, senderWalletAddress, transactionId } = createPaymentDto;

    const existingPayment = await this.paymentsRepository.findOne({
      where: { transactionId },
    });

    if (existingPayment) {
      throw new BadRequestException(
        `Transaction ID ${transactionId} already exists`,
      );
    }

    const transaction = await this.verifyTransaction(
      transactionId,
      senderWalletAddress,
      amount,
    );

    const payment = this.paymentsRepository.create({
      amount,
      senderWalletAddress,
      transactionId,
      status: PaymentStatus.SUCCESS,
      gatewayResponse: JSON.stringify(transaction),
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

  private async verifyTransaction(
    transactionId: string,
    senderWallet: string,
    expectedAmount: number,
  ): Promise<TonTransaction> {
    try {
      const response = await axios.get(
        `https://tonapi.io/v2/blockchain/transactions/${transactionId}`,
      );
      const transaction = response.data as TonTransaction;

      if (transaction.data.in_msg.source !== senderWallet) {
        throw new BadRequestException('Invalid sender wallet address');
      }

      const receivedAmount = parseFloat(transaction.data.in_msg.value) / 1e9;
      if (receivedAmount < expectedAmount) {
        throw new BadRequestException('Transaction amount does not match');
      }

      return transaction;
    } catch (err) {
      const error = err as Error;
      throw new BadRequestException(
        `Failed to verify transaction: ${error.message}`,
      );
    }
  }
}
