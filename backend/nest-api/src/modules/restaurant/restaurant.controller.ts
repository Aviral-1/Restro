import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly service: RestaurantService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: any, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post(':id/tables')
  createTable(@Param('id') id: string, @Body() dto: any) {
    return this.service.createTable(id, dto);
  }

  @Get(':id/tables')
  getTables(@Param('id') id: string) {
    return this.service.getTables(id);
  }

  @Get(':id/tables/:tableNumber/qr')
  getTableQR(@Param('id') id: string, @Param('tableNumber') tableNumber: string) {
    return this.service.getTableQR(id, parseInt(tableNumber));
  }
}
