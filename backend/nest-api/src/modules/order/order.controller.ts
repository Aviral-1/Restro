import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('number/:orderNumber')
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.service.findByOrderNumber(orderNumber);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: { status: string; message?: string }) {
    return this.service.updateStatus(id, dto.status, dto.message);
  }

  @Get(':id/tracking')
  getTrackingLogs(@Param('id') id: string) {
    return this.service.getTrackingLogs(id);
  }

  @Get('restaurant/:restaurantId')
  getOrdersByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.service.getOrdersByRestaurant(restaurantId);
  }

  @Patch(':id/assign-delivery')
  assignDeliveryPartner(@Param('id') id: string, @Body() dto: { deliveryPartnerId: string }) {
    return this.service.assignDeliveryPartner(id, dto.deliveryPartnerId);
  }
}
