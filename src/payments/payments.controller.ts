import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: number): Promise<Payment> {
    return this.paymentsService.getPaymentById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updatePayment(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }

  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentsService.getAllPayments();
  }
}
