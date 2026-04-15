import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'MenuItem', required: true })
  menuItemId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ default: true })
  isVeg: boolean;
}

@Schema()
export class DeliveryAddress {
  @Prop({ required: true })
  street: string;
  @Prop({ required: true })
  city: string;
  @Prop()
  state: string;
  @Prop({ required: true })
  zipCode: string;
  @Prop()
  lat: number;
  @Prop()
  lng: number;
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Restauranthfjyflf lkufkuf fhgdf hdfhdfhdfhdfh rtsrtsrtsrts ertsrtsdftg dftgsd gsdgsd  wtgwetg wsg dfghd fhdfhdfhd zdfsad fgsfdgdrfhgdfhdfhdfhdfhfdhfd dfhdjfjkdfsdghd fhdhdhdhdhdhdfg dsdhdfhdfhdfhdfh kjglkfui il fgysdf hsfhdfhdfhdf hdfghdf hdfhdfdfgbf sddhshedfhdf gfhdgh dh gchdcghdg jhdg fdghdfg sdfg djh', required: true })
  restaurantId: Types.ObjectId;

  @Prop()
  customerId: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop()
  customerEmail: string;

  @Prop({ type: DeliveryAddress })
  deliveryAddress: DeliveryAddress;

  @Prop()
  tableNumber: number;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  tax: number;

  @Prop({ default: 0 })
  deliveryFee: number;

  @Prop({ required: true })
  total: number;

  @Prop({
    required: true,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop()
  paymentId: string;

  @Prop({
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  })
  paymentStatus: string;

  @Prop({ type: Types.ObjectId, ref: 'DeliveryPartner' })
  deliveryPartnerId: Types.ObjectId;

  @Prop()
  estimatedDeliveryTime: Date;

  @Prop()
  notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ restaurantId: 1, status: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerPhone: 1 });
OrderSchema.index({ createdAt: -1 });
