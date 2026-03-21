import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['admin', 'restaurant_owner', 'delivery_partner', 'customer'] })
  role: string;

  @Prop()
  phone: string;

  @Prop()
  avatar: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop([{
    label: String,
    address: String,
    lat: Number,
    lng: Number,
    isDefault: { type: Boolean, default: false }
  }])
  addresses: any[];

  @Prop([{ type: String }]) // References to Restaurant or MenuItem IDs
  favorites: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
