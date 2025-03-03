import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { PaymentsService } from './payments.service';
import { Logger } from '@nestjs/common';

@Processor('paymentQueue')
export class PaymentProcessor {
  private readonly logger = new Logger(PaymentProcessor.name);

  constructor(private paymentsService: PaymentsService) {}

  @Process()
  async handlePayment(job: Job) {
    const { txHash, from, to, amount } = job.data;
    this.logger.log(`🔄 Processing payment: ${txHash}`);

    try {
      await this.paymentsService.confirmPayment(txHash, from, to, amount);
      this.logger.log(`✅ Payment confirmed: ${txHash}`);
    } catch (error) {
      this.logger.error(`❌ Payment processing failed: ${error.message}`);
    }
  }
}
