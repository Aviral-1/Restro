import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  razorpayOrderId: string;

  @Prop()
  razorpayPaymentId: string;

  @Prop()
  razorpaySignature: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({
    required: true,
    enum: ['created', 'captured', 'failed', 'refunded'],
    default: 'created',
  })
  status: string;

  @Prop()
  method: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ razorpayOrderId: 1 });
