import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../schemas/order.schema';
import { TrackingLog } from '../../schemas/tracking-log.schema';
import { Restaurant } from '../../schemas/restaurant.schema';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(TrackingLog.name) private trackingLogModel: Model<TrackingLog>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    private eventsGateway: EventsGateway,
  ) {}

  async create(dto: any) {
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const order = await this.orderModel.create({ ...dto, orderNumber });

    // Create initial tracking log
    await this.trackingLogModel.create({
      orderId: order._id,
      status: 'pending',
      message: 'Order placed successfully',
    });

    // Increment restaurant order count
    await this.restaurantModel.findByIdAndUpdate(dto.restaurantId, { $inc: { totalOrders: 1 } });

    // Emit realtime event
    this.eventsGateway.emitNewOrder(dto.restaurantId, order);

    return order;
  }

  async findAll(query: any = {}) {
    const filter: any = {};
    if (query.restaurantId) filter.restaurantId = query.restaurantId;
    if (query.status) filter.status = query.status;
    if (query.customerPhone) filter.customerPhone = query.customerPhone;
    return this.orderModel.find(filter).sort({ createdAt: -1 }).limit(100);
  }

  async findById(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.orderModel.findOne({ orderNumber });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: string, message?: string) {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!order) throw new NotFoundException('Order not found');

    // Create tracking log
    await this.trackingLogModel.create({
      orderId: order._id,
      status,
      message: message || `Order status updated to ${status}`,
    });

    // Emit realtime status update
    this.eventsGateway.emitOrderStatusUpdate(id, status, order);

    return order;
  }

  async getTrackingLogs(orderId: string) {
    return this.trackingLogModel.find({ orderId }).sort({ createdAt: 1 });
  }

  async getOrdersByRestaurant(restaurantId: string) {
    return this.orderModel.find({ restaurantId }).sort({ createdAt: -1 }).limit(100);
  }

  async assignDeliveryPartner(orderId: string, deliveryPartnerId: string) {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { deliveryPartnerId, status: 'out_for_delivery' },
      { new: true },
    );
    if (!order) throw new NotFoundException('Order not found');

    await this.trackingLogModel.create({
      orderId: order._id,
      status: 'out_for_delivery',
      message: 'Delivery partner assigned',
    });

    this.eventsGateway.emitOrderStatusUpdate(orderId, 'out_for_delivery', order);
    this.eventsGateway.emitNewDeliveryAssignment(deliveryPartnerId, order);

    return order;
  }
}
