import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_restaurant')
  handleJoinRestaurant(client: Socket, restaurantId: string) {
    client.join(`restaurant_${restaurantId}`);
    console.log(`Client ${client.id} joined restaurant ${restaurantId}`);
  }

  @SubscribeMessage('join_order')
  handleJoinOrder(client: Socket, orderId: string) {
    client.join(`order_${orderId}`);
    console.log(`Client ${client.id} joined order ${orderId}`);
  }

  @SubscribeMessage('join_delivery')
  handleJoinDelivery(client: Socket, partnerId: string) {
    client.join(`delivery_${partnerId}`);
    console.log(`Client ${client.id} joined delivery ${partnerId}`);
  }

  // Emit events
  emitNewOrder(restaurantId: string, order: any) {
    this.server.to(`restaurant_${restaurantId}`).emit('new_order', order);
  }

  emitOrderStatusUpdate(orderId: string, status: string, order: any) {
    this.server.to(`order_${orderId}`).emit('order_status_update', { orderId, status, order });
    if (order.restaurantId) {
      this.server.to(`restaurant_${order.restaurantId}`).emit('order_status_update', { orderId, status, order });
    }
  }

  emitDeliveryLocationUpdate(orderId: string, location: { lat: number; lng: number }) {
    this.server.to(`order_${orderId}`).emit('delivery_location_update', { orderId, location });
  }

  emitNewDeliveryAssignment(partnerId: string, order: any) {
    this.server.to(`delivery_${partnerId}`).emit('new_delivery_assignment', order);
  }
}
