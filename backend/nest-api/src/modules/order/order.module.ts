import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from '../../schemas/order.schema';
import { TrackingLog, TrackingLogSchema } from '../../schemas/tracking-log.schema';
import { Restaurant, RestaurantSchema } from '../../schemas/restaurant.schema';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: TrackingLog.name, schema: TrackingLogSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    EventsModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
