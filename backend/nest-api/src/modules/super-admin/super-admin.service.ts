import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from '../../schemas/restaurant.schema';
import { Order } from '../../schemas/order.schema';
import { User } from '../../schemas/user.schema';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getGlobalStats() {
    const [restaurants, orders, users] = await Promise.all([
      this.restaurantModel.countDocuments(),
      this.orderModel.aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      this.userModel.countDocuments({ role: 'customer' }),
    ]);

    return {
      totalRestaurants: restaurants,
      totalRevenue: orders[0]?.total || 0,
      totalCustomers: users,
      activeSubscriptions: Math.floor(restaurants * 0.8), // Mock logic for demo
    };
  }

  async getTenants() {
    return this.restaurantModel.find()
      .select('name logo status createdAt')
      .sort({ createdAt: -1 });
  }

  async updateTenantStatus(id: string, status: string) {
    return this.restaurantModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async getRevenueChart() {
    // Mock daily revenue for last 7 days
    return [
      { date: 'Mon', revenue: 45000 },
      { date: 'Tue', revenue: 52000 },
      { date: 'Wed', revenue: 48000 },
      { date: 'Thu', revenue: 61000 },
      { date: 'Fri', revenue: 55000 },
      { date: 'Sat', revenue: 72000 },
      { date: 'Sun', revenue: 85000 },
    ];
  }
}
