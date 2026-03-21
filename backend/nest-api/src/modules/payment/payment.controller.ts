import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post('create-order')
  createOrder(@Body() dto: { orderId: string; amount: number }) {
    return this.service.createOrder(dto);
  }

  @Post('verify')
  verifyPayment(@Body() dto: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) {
    return this.service.verifyPayment(dto);
  }

  @Get('order/:orderId')
  getPaymentByOrderId(@Param('orderId') orderId: string) {
    return this.service.getPaymentByOrderId(orderId);
  }
}
