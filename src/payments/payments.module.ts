import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { PaymentProcessor } from './payment.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    BullModule.registerQueue({
      name: 'paymentQueue',
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentProcessor],
  exports: [PaymentsService],
})
export class PaymentsModule {}
