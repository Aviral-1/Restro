import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from '../../schemas/restaurant.schema';
import { Table } from '../../schemas/table.schema';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
  ) {}

  async create(dto: any, user?: any) {
    if (user) {
      dto.ownerId = user.sub;
    }
    
    if (!dto.slug && dto.name) {
      dto.slug = dto.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
    }

    // Default address structure if only a string is provided
    if (typeof dto.address === 'string') {
      dto.address = {
        street: dto.address,
        city: 'City',
        state: 'State',
        zipCode: '000000'
      };
    }

    const restaurant = await this.restaurantModel.create(dto);
    return restaurant;
  }

  async findAll(query: any = {}) {
    const filter: any = { isActive: true };
    if (query.cuisine) filter.cuisineType = { $in: [query.cuisine] };
    return this.restaurantModel.find(filter).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async findBySlug(slug: string) {
    const restaurant = await this.restaurantModel.findOne({ slug });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async update(id: string, dto: any) {
    const restaurant = await this.restaurantModel.findByIdAndUpdate(id, dto, { new: true });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async delete(id: string) {
    await this.restaurantModel.findByIdAndUpdate(id, { isActive: false });
    return { message: 'Restaurant deactivated' };
  }

  // Tables
  async createTable(restaurantId: string, dto: any) {
    return this.tableModel.create({ ...dto, restaurantId });
  }

  async getTables(restaurantId: string) {
    return this.tableModel.find({ restaurantId, isActive: true });
  }

  async getTableQR(restaurantId: string, tableNumber: number) {
    const baseUrl = process.env.CUSTOMER_APP_URL || 'http://localhost:3000';
    return {
      url: `${baseUrl}/menu?restaurantId=${restaurantId}&table=${tableNumber}`,
      restaurantId,
      tableNumber,
    };
  }
}
