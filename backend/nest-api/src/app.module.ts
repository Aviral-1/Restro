import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { EventsModule } from './modules/events/events.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { CustomerModule } from './modules/customer/customer.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL || 'mongodb://localhost:27017/restro-qr',
        serverSelectionTimeoutMS: 5000,
        connectionFactory: (connection) => {
          connection.on('error', (err: any) => {
            console.error('❌ MongoDB Connection Error:', err.message);
          });
          return connection;
        },
      }),
    }),
    AuthModule,
    RestaurantModule,
    MenuModule,
    OrderModule,
    PaymentModule,
    DeliveryModule,
    // TrackingModule,
    CustomerModule,
    SuperAdminModule,
    AnalyticsModule,
    EventsModule,
    SubscriptionModule,
  ],
})
export class AppModule {}
