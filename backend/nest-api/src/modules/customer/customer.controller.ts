import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('profile')
  getProfile(@Request() req: any) {
    // In a real app, req.user.id from JWT
    return this.customerService.getProfile(req.query.userId || req.user?.id);
  }

  @Post('address')
  addAddress(@Body() data: { userId: string; label: string; address: string; lat?: number; lng?: number; isDefault?: boolean }) {
    return this.customerService.addAddress(data.userId, data);
  }

  @Patch('favorites')
  toggleFavorite(@Body() data: { userId: string; itemId: string }) {
    return this.customerService.toggleFavorite(data.userId, data.itemId);
  }

  @Get('orders')
  getOrderHistory(@Request() req: any) {
    return this.customerService.getOrderHistory(req.query.userId || req.user?.id);
  }
}
