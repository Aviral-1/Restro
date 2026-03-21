import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Table extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;

  @Prop({ required: true })
  tableNumber: number;

  @Prop({ default: 4 })
  capacity: number;

  @Prop()
  qrCode: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const TableSchema = SchemaFactory.createForClass(Table);
TableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });
