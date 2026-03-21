import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { Order } from '../../schemas/order.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async addAddress(userId: string, addressData: any) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    if (addressData.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }
    
    user.addresses.push(addressData);
    return user.save();
  }

  async toggleFavorite(userId: string, itemId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    const index = user.favorites.indexOf(itemId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(itemId);
    }
    
    return user.save();
  }

  async getOrderHistory(userId: string) {
    return this.orderModel.find({ customerId: userId })
      .sort({ createdAt: -1 })
      .populate('restaurantId', 'name logo');
  }
}
