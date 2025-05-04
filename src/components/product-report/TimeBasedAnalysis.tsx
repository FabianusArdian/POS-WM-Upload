import React from "react";
import { Order, OrderItem } from "@/lib/types";

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
  // Group orders by day of week
  const analyzeOrdersByDayOfWeek = () => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayStats = dayNames.map((name) => ({ name, count: 0, revenue: 0 }));

    orders.forEach((order) => {
      const date = new Date(order.created_at);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

      dayStats[dayOfWeek].count += 1;
      dayStats[dayOfWeek].revenue += order.total_amount;
    });

    return dayStats;
  };

  // Group orders by hour of day
  const analyzeOrdersByHourOfDay = () => {
    const hourStats = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0,
      revenue: 0,
    }));

    orders.forEach((order) => {
      const date = new Date(order.created_at);
      const hour = date.getHours();

      hourStats[hour].count += 1;
      hourStats[hour].revenue += order.total_amount;
    });

    return hourStats;
  };

  const dayOfWeekData = analyzeOrdersByDayOfWeek();
  const hourOfDayData = analyzeOrdersByHourOfDay();

  // Find peak hours (top 3)
  const peakHours = [...hourOfDayData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .filter((item) => item.count > 0);

  // Find busiest days (top 3)
  const busiestDays = [...dayOfWeekData]
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
                key={item.name}
                className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
              >
                <span className="font-medium">{item.name}</span>
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
    </div>
  );
}
