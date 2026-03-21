import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../schemas/order.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async getDashboard(restaurantId: string) {
    const orders = await this.orderModel.find({ restaurantId }).lean();

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o: any) => o.paymentStatus === 'paid')
      .reduce((sum: number, o: any) => sum + o.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Top selling items
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    orders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = { name: item.name, count: 0, revenue: 0 };
        }
        itemCounts[item.name].count += item.quantity;
        itemCounts[item.name].revenue += item.price * item.quantity;
      });
    });
    const topSellingItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Peak hours
    const hourCounts: Record<number, number> = {};
    orders.forEach((order: any) => {
      const hour = new Date(order.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const peakHours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      orders: hourCounts[i] || 0,
    }));

    // Revenue trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const revenueTrend: Record<string, number> = {};
    orders
      .filter((o: any) => new Date(o.createdAt) > thirtyDaysAgo)
      .forEach((order: any) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        revenueTrend[date] = (revenueTrend[date] || 0) + order.total;
      });
    const revenueTrendArray = Object.entries(revenueTrend)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Customer stats
    const customerPhones = new Set(orders.map((o: any) => o.customerPhone));
    const repeatMap: Record<string, number> = {};
    orders.forEach((o: any) => {
      repeatMap[o.customerPhone] = (repeatMap[o.customerPhone] || 0) + 1;
    });
    const repeatCustomers = Object.values(repeatMap).filter((c) => c > 1).length;

    // Status breakdown
    const ordersByStatus: Record<string, number> = {};
    orders.forEach((o: any) => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    });

    // AI Insights
    const insights = this.generateInsights({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      topSellingItems,
      peakHours,
      repeatCustomers,
    });

    return {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      topSellingItems,
      peakHours,
      revenueTrend: revenueTrendArray,
      repeatCustomers,
      newCustomers: customerPhones.size - repeatCustomers,
      ordersByStatus,
      insights,
    };
  }

  private generateInsights(data: any) {
    const insights: string[] = [];

    if (data.topSellingItems.length > 0) {
      insights.push(`🌟 "${data.topSellingItems[0].name}" is your bestseller with ${data.topSellingItems[0].count} orders`);
    }

    const peakHour = data.peakHours.reduce((max: any, h: any) => h.orders > max.orders ? h : max, { orders: 0, hour: 0 });
    if (peakHour.orders > 0) {
      insights.push(`⏰ Peak ordering time is ${peakHour.hour}:00 with ${peakHour.orders} orders`);
    }

    if (data.repeatCustomers > 0) {
      const repeatRate = Math.round((data.repeatCustomers / (data.repeatCustomers + data.totalOrders)) * 100);
      insights.push(`🔄 ${data.repeatCustomers} repeat customers — consider a loyalty program`);
    }

    if (data.averageOrderValue > 0) {
      insights.push(`💰 Average order value is ₹${Math.round(data.averageOrderValue)} — try bundling items to increase it`);
    }

    if (data.totalOrders > 50) {
      insights.push(`📈 Strong order volume! Consider expanding your menu or operating hours`);
    }

    return insights;
  }
}
