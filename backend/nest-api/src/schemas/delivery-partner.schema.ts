import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DeliveryPartner extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ enum: ['bike', 'scooter', 'car'], default: 'bike' })
  vehicleType: string;

  @Prop()
  vehicleNumber: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: { lat: Number, lng: Number } })
  currentLocation: { lat: number; lng: number };

  @Prop({ default: 0 })
  totalDeliveries: number;

  @Prop({ default: 5.0 })
  rating: number;
}

export const DeliveryPartnerSchema = SchemaFactory.createForClass(DeliveryPartner);
DeliveryPartnerSchema.index({ userId: 1 });
DeliveryPartnerSchema.index({ isAvailable: 1 });
