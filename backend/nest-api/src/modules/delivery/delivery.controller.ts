import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { DeliveryService } from './delivery.service';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly service: DeliveryService) {}

  @Post('partners')
  createPartner(@Body() dto: any) {
    return this.service.createPartner(dto);
  }

  @Get('partners')
  getPartners() {
    return this.service.getPartners();
  }

  @Get('partners/available')
  getAvailablePartners() {
    return this.service.getAvailablePartners();
  }

  @Get('partners/user/:userId')
  getPartnerByUserId(@Param('userId') userId: string) {
    return this.service.getPartnerByUserId(userId);
  }

  @Get('assignments/:partnerId')
  getAssignedOrders(@Param('partnerId') partnerId: string) {
    return this.service.getAssignedOrders(partnerId);
  }

  @Get('history/:partnerId')
  getDeliveryHistory(@Param('partnerId') partnerId: string) {
    return this.service.getDeliveryHistory(partnerId);
  }

  @Patch('partners/:partnerId/location')
  updateLocation(@Param('partnerId') partnerId: string, @Body() dto: { lat: number; lng: number }) {
    return this.service.updateLocation(partnerId, dto);
  }

  @Patch('partners/:partnerId/toggle-availability')
  toggleAvailability(@Param('partnerId') partnerId: string) {
    return this.service.toggleAvailability(partnerId);
  }
}
