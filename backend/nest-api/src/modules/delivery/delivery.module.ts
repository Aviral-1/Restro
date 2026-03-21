import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliveryPartner, DeliveryPartnerSchema } from '../../schemas/delivery-partner.schema';
import { Order, OrderSchema } from '../../schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliveryPartner.name, schema: DeliveryPartnerSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
