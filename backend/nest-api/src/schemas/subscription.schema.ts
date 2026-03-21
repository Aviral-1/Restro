import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Subscription extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'SubscriptionPlan', required: true })
  planId: string;

  @Prop({ required: true, enum: ['active', 'past_due', 'canceled', 'trialing'], default: 'trialing' })
  status: string;

  @Prop({ required: true })
  currentPeriodStart: Date;

  @Prop({ required: true })
  currentPeriodEnd: Date;

  @Prop({ default: false })
  cancelAtPeriodEnd: boolean;

  @Prop()
  razorpaySubscriptionId?: string;

  @Prop()
  paymentMethodId?: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
