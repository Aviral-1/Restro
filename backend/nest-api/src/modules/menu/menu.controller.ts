import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly service: MenuService) {}

  // Categories
  @Post('categories')
  createCategory(@Body() dto: any) {
    return this.service.createCategory(dto);
  }

  @Get('categories/:restaurantId')
  getCategories(@Param('restaurantId') restaurantId: string) {
    return this.service.getCategories(restaurantId);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: any) {
    return this.service.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.service.deleteCategory(id);
  }

  // Menu Items
  @Post('items')
  createItem(@Body() dto: any) {
    return this.service.createItem(dto);
  }

  @Get('items/:restaurantId')
  getItems(@Param('restaurantId') restaurantId: string, @Query('categoryId') categoryId?: string) {
    return this.service.getItems(restaurantId, categoryId);
  }

  @Get('item/:id')
  getItemById(@Param('id') id: string) {
    return this.service.getItemById(id);
  }

  @Put('items/:id')
  updateItem(@Param('id') id: string, @Body() dto: any) {
    return this.service.updateItem(id, dto);
  }

  @Delete('items/:id')
  deleteItem(@Param('id') id: string) {
    return this.service.deleteItem(id);
  }

  // Full menu (categories + items)
  @Get('full/:restaurantId')
  getFullMenu(@Param('restaurantId') restaurantId: string) {
    return this.service.getFullMenu(restaurantId);
  }
}
