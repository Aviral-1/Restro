import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class OperatingHours {
  @Prop({ required: true })
  day: string;
  @Prop({ required: true })
  open: string;
  @Prop({ required: true })
  close: string;
  @Prop({ default: false })
  isClosed: boolean;
}

@Schema()
export class Address {
  @Prop({ required: true })
  street: string;
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  state: string;
  @Prop({ required: true })
  zipCode: string;
  @Prop({ default: 'India' })
  country: string;
  @Prop()
  lat: number;
  @Prop()
  lng: number;
}

@Schema()
export class Contact {
  @Prop({ required: true })
  phone: string;
  @Prop()
  email: string;
  @Prop()
  website: string;
}

@Schema({ timestamps: true })
export class Restaurant extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  logo: string;

  @Prop()
  coverImage: string;

  @Prop()
  description: string;

  @Prop({ type: Address })
  address: Address;

  @Prop({ type: Contact })
  contact: Contact;

  @Prop({ type: [String], default: [] })
  cuisineType: string[];

  @Prop({ type: [OperatingHours], default: [] })
  operatingHours: OperatingHours[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  totalOrders: number;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
RestaurantSchema.index({ slug: 1 });
RestaurantSchema.index({ ownerId: 1 });
RestaurantSchema.index({ isActive: 1 });
