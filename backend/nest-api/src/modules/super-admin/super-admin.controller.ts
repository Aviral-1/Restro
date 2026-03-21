import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';

@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('stats')
  getGlobalStats() {
    return this.superAdminService.getGlobalStats();
  }

  @Get('tenants')
  getTenants() {
    return this.superAdminService.getTenants();
  }

  @Patch('tenants/:id/status')
  updateTenantStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.superAdminService.updateTenantStatus(id, status);
  }

  @Get('revenue-chart')
  getRevenueChart() {
    return this.superAdminService.getRevenueChart();
  }
}
