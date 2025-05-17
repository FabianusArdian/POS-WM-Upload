import React from "react";
import { Order, OrderItem } from "@/lib/types";
import { format } from "date-fns";

interface TimeBasedAnalysisProps {
  orders: Order[];
  orderItems: OrderItem[];
}

export default function TimeBasedAnalysis(
  { orders, orderItems }: TimeBasedAnalysisProps = {
    orders: [],
    orderItems: [],
  },
) {
  // Filter orders: only last 1 month from today
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    return orderDate >= oneMonthAgo && orderDate <= today;
  });

  // Group filtered orders by date
  const analyzeOrdersByDate = () => {
    const dateMap: Record<string, { count: number; revenue: number; date: Date }> = {};

    filteredOrders.forEach((order) => {
      const dateObj = new Date(order.created_at);
      const dateKey = format(dateObj, "yyyy-MM-dd");

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = {
          count: 0,
          revenue: 0,
          date: dateObj,
        };
      }

      dateMap[dateKey].count += 1;
      dateMap[dateKey].revenue += order.total_amount;
    });

    return Object.values(dateMap);
  };

  // ✅ Group filtered orders by hour
  const analyzeOrdersByHourOfDay = () => {
    const hourStats = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0,
      revenue: 0,
    }));

    filteredOrders.forEach((order) => {
      const date = new Date(order.created_at);
      const hour = date.getHours();

      hourStats[hour].count += 1;
      hourStats[hour].revenue += order.total_amount;
    });

    return hourStats;
  };

  const dateBasedData = analyzeOrdersByDate();
  const hourOfDayData = analyzeOrdersByHourOfDay();

  const peakHours = [...hourOfDayData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .filter((item) => item.count > 0);

  const busiestDays = [...dateBasedData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .filter((item) => item.count > 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Peak Hours</h3>
        {peakHours.length > 0 ? (
          <div className="space-y-2">
            {peakHours.map((item) => (
              <div
                key={item.hour}
                className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
              >
                <span className="font-medium">
                  {item.hour === 0
                    ? "12 AM"
                    : item.hour < 12
                      ? `${item.hour} AM`
                      : item.hour === 12
                        ? "12 PM"
                        : `${item.hour - 12} PM`}
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                    {item.count} orders
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No data available</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Busiest Days</h3>
        {busiestDays.length > 0 ? (
          <div className="space-y-2">
            {busiestDays.map((item) => (
              <div
                key={item.date.toISOString()}
                className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
              >
                <div>
                  <span className="font-medium">
                    {format(item.date, "EEEE, d MMMM yyyy")}
                  </span>
                </div>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                  {item.count} orders
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No data available</p>
        )}
      </div>
    </div>
  );
}