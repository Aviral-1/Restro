import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TrackingLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true, enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'] })
  status: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: { lat: Number, lng: Number } })
  location: { lat: number; lng: number };
}

export const TrackingLogSchema = SchemaFactory.createForClass(TrackingLog);
TrackingLogSchema.index({ orderId: 1 });
