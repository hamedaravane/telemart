import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create a new order
  @Post()
  async createOrder(
    @Body('customerId') customerId: number,
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
  ): Promise<Order> {
    return this.ordersService.createOrder(customerId, productId, quantity);
  }

  // Get all orders
  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.ordersService.getAllOrders();
  }

  // Get orders by customer ID
  @Get('customer/:customerId')
  async getOrdersByCustomer(
    @Param('customerId') customerId: number,
  ): Promise<Order[]> {
    return this.ordersService.getOrdersByCustomer(customerId);
  }

  // Get an order by ID
  @Get(':id')
  async getOrderById(@Param('id') id: number): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }

  // Update order status
  @Patch(':id')
  async updateOrderStatus(
    @Param('id') id: number,
    @Body('status') status: OrderStatus,
  ): Promise<Order> {
    return this.ordersService.updateOrderStatus(id, status);
  }

  // Delete an order
  @Delete(':id')
  async deleteOrder(@Param('id') id: number): Promise<{ message: string }> {
    await this.ordersService.deleteOrder(id);
    return { message: 'Order deleted successfully' };
  }
}
