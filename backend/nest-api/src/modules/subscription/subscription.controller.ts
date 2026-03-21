import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Add later

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Post('subscribe')
  // @UseGuards(JwtAuthGuard)
  subscribe(@Body() data: { restaurantId: string; planId: string }) {
    return this.subscriptionService.subscribe(data.restaurantId, data.planId);
  }

  @Get('current')
  // @UseGuards(JwtAuthGuard)
  getCurrent(@Request() req: any) {
    // Assuming restaurantId is in the token or passed as query
    return this.subscriptionService.getSubscription(req.query.restaurantId);
  }
}
