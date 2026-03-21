import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from '../../schemas/subscription.schema';
import { SubscriptionPlan } from '../../schemas/subscription-plan.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    @InjectModel(SubscriptionPlan.name) private planModel: Model<SubscriptionPlan>,
  ) {}

  async createPlan(data: any) {
    return this.planModel.create(data);
  }

  async getPlans() {
    return this.planModel.find({ isActive: true });
  }

  async subscribe(restaurantId: string, planId: string) {
    const plan = await this.planModel.findById(planId);
    if (!plan) throw new Error('Plan not found');

    const startDate = new Date();
    const endDate = new Date();
    if (plan.interval === 'month') endDate.setMonth(endDate.getMonth() + 1);
    else endDate.setFullYear(endDate.getFullYear() + 1);

    return this.subscriptionModel.create({
      restaurantId,
      planId,
      status: 'active',
      currentPeriodStart: startDate,
      currentPeriodEnd: endDate,
    });
  }

  async getSubscription(restaurantId: string) {
    return this.subscriptionModel.findOne({ restaurantId }).populate('planId');
  }
}
