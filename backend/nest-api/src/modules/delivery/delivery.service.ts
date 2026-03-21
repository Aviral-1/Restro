import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeliveryPartner } from '../../schemas/delivery-partner.schema';
import { Order } from '../../schemas/order.schema';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(DeliveryPartner.name) private deliveryPartnerModel: Model<DeliveryPartner>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async createPartner(dto: any) {
    return this.deliveryPartnerModel.create(dto);
  }

  async getPartners() {
    return this.deliveryPartnerModel.find();
  }

  async getAvailablePartners() {
    return this.deliveryPartnerModel.find({ isAvailable: true });
  }

  async getPartnerByUserId(userId: string) {
    const partner = await this.deliveryPartnerModel.findOne({ userId });
    if (!partner) throw new NotFoundException('Delivery partner not found');
    return partner;
  }

  async getAssignedOrders(partnerId: string) {
    return this.orderModel.find({
      deliveryPartnerId: partnerId,
      status: { $in: ['out_for_delivery', 'ready'] },
    }).sort({ createdAt: -1 });
  }

  async getDeliveryHistory(partnerId: string) {
    return this.orderModel.find({
      deliveryPartnerId: partnerId,
      status: 'delivered',
    }).sort({ createdAt: -1 }).limit(50);
  }

  async updateLocation(partnerId: string, location: { lat: number; lng: number }) {
    return this.deliveryPartnerModel.findByIdAndUpdate(
      partnerId,
      { currentLocation: location },
      { new: true },
    );
  }

  async toggleAvailability(partnerId: string) {
    const partner = await this.deliveryPartnerModel.findById(partnerId);
    if (!partner) throw new NotFoundException('Delivery partner not found');
    partner.isAvailable = !partner.isAvailable;
    await partner.save();
    return partner;
  }
}
