import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SubscriptionPlanType } from '@restro/types';

@Schema({ timestamps: true })
export class SubscriptionPlan extends Document {
  @Prop({ required: true, enum: ['basic', 'pro', 'enterprise'] })
  type: SubscriptionPlanType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: ['month', 'year'] })
  interval: string;

  @Prop([String])
  features: string[];

  @Prop({ type: Object, required: true })
  limits: {
    maxItems: number;
    maxOrders: number;
    maxTables: number;
    hasAnalytics: boolean;
    hasCustomBranding: boolean;
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);
