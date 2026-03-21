import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuCategory } from '../../schemas/menu-category.schema';
import { MenuItem } from '../../schemas/menu-item.schema';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuCategory.name) private categoryModel: Model<MenuCategory>,
    @InjectModel(MenuItem.name) private itemModel: Model<MenuItem>,
  ) {}

  // Categories
  async createCategory(dto: any) {
    return this.categoryModel.create(dto);
  }

  async getCategories(restaurantId: string) {
    return this.categoryModel
      .find({ restaurantId, isActive: true })
      .sort({ sortOrder: 1 });
  }

  async updateCategory(id: string, dto: any) {
    const category = await this.categoryModel.findByIdAndUpdate(id, dto, { new: true });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async deleteCategory(id: string) {
    await this.categoryModel.findByIdAndUpdate(id, { isActive: false });
    return { message: 'Category deleted' };
  }

  // Menu Items
  async createItem(dto: any) {
    return this.itemModel.create(dto);
  }

  async getItems(restaurantId: string, categoryId?: string) {
    const filter: any = { restaurantId, isAvailable: true };
    if (categoryId) filter.categoryId = categoryId;
    return this.itemModel.find(filter).sort({ sortOrder: 1 });
  }

  async getItemById(id: string) {
    const item = await this.itemModel.findById(id);
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async updateItem(id: string, dto: any) {
    const item = await this.itemModel.findByIdAndUpdate(id, dto, { new: true });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async deleteItem(id: string) {
    await this.itemModel.findByIdAndUpdate(id, { isAvailable: false });
    return { message: 'Item deleted' };
  }

  async getFullMenu(restaurantId: string) {
    const categories = await this.categoryModel
      .find({ restaurantId, isActive: true })
      .sort({ sortOrder: 1 })
      .lean();

    const items = await this.itemModel
      .find({ restaurantId, isAvailable: true })
      .sort({ sortOrder: 1 })
      .lean();

    return categories.map((cat: any) => ({
      ...cat,
      items: items.filter((item: any) => item.categoryId.toString() === cat._id.toString()),
    }));
  }
}
