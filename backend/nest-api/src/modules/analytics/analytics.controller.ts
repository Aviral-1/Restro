import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('dashboard/:restaurantId')
  getDashboard(@Param('restaurantId') restaurantId: string) {
    return this.service.getDashboard(restaurantId);
  }
}
