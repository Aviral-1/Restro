import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingLog, TrackingLogSchema } from '../../schemas/tracking-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TrackingLog.name, schema: TrackingLogSchema }]),
  ],
  exports: [MongooseModule],
})
export class TrackingModule {}
