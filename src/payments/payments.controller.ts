import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from '@/payments/dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    type: Payment,
  })
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return await this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all payments' })
  @ApiResponse({
    status: 200,
    description: 'List of all payments',
    type: [Payment],
  })
  async findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID', example: '1234-abcd' })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully',
    type: Payment,
  })
  async findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing payment' })
  @ApiParam({ name: 'id', description: 'Payment ID', example: '1234-abcd' })
  @ApiResponse({
    status: 200,
    description: 'Payment updated successfully',
    type: Payment,
  })
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    try {
      return await this.paymentsService.update(id, updatePaymentDto);
    } catch (err) {
      const error = err as Error;
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
