import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from '../../schemas/payment.schema';
import { Order } from '../../schemas/order.schema';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async createOrder(dto: { orderId: string; amount: number }) {
    // In production, this would call Razorpay API
    // For demo, we create a mock payment order
    const razorpayOrderId = `order_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;

    const payment = await this.paymentModel.create({
      orderId: dto.orderId,
      razorpayOrderId,
      amount: dto.amount,
      currency: 'INR',
      status: 'created',
    });

    return {
      id: razorpayOrderId,
      amount: dto.amount * 100, // Razorpay uses paise
      currency: 'INR',
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
    };
  }

  async verifyPayment(dto: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) {
    const payment = await this.paymentModel.findOne({ razorpayOrderId: dto.razorpayOrderId });
    if (!payment) throw new BadRequestException('Payment not found');

    // In production, verify signature with Razorpay secret
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    //   .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
    //   .digest('hex');

    // For demo, accept any payment
    payment.razorpayPaymentId = dto.razorpayPaymentId;
    payment.razorpaySignature = dto.razorpaySignature;
    payment.status = 'captured';
    await payment.save();

    // Update order payment status
    await this.orderModel.findByIdAndUpdate(payment.orderId, {
      paymentStatus: 'paid',
      paymentId: payment._id,
      status: 'confirmed',
    });

    return { success: true, message: 'Payment verified', payment };
  }

  async getPaymentByOrderId(orderId: string) {
    return this.paymentModel.findOne({ orderId });
  }
}
