import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class MenuItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MenuCategory', required: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  discountPrice: number;

  @Prop()
  image: string;

  @Prop({ default: true })
  isVeg: boolean;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: 15 })
  preparationTime: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 0 })
  sortOrder: number;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
MenuItemSchema.index({ restaurantId: 1, categoryId: 1 });
MenuItemSchema.index({ restaurantId: 1, isAvailable: 1 });
