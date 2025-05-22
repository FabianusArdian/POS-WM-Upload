"use client";

import React, { useEffect, useState } from "react";
import { fetchTimeBasedReport } from "@/lib/api";
import { PeakHour, BusiestDay, TimeBasedReport, TimeBasedAnalysisProps } from "@/lib/types";

export default function TimeBasedAnalysis({ startDate, endDate }: TimeBasedAnalysisProps) {
  const [peakHours, setPeakHours] = useState<PeakHour[]>([]);
  const [busiestDays, setBusiestDays] = useState<BusiestDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    const getData = async () => {
      setLoading(true);
      try {
        const data: TimeBasedReport = await fetchTimeBasedReport(startStr, endStr);
        setPeakHours(data.peak_hours || []);
        setBusiestDays(data.busiest_days || []);
      } catch (error) {
        console.error(error);
        setPeakHours([]);
        setBusiestDays([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Peak Hours</h3>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : peakHours.length > 0 ? (
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
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                  {item.order_count} orders
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No data available</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Busiest Days</h3>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : busiestDays.length > 0 ? (
          <div className="space-y-2">
            {busiestDays.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
              >
                <span className="font-medium">{item.day}</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                  {item.order_count} orders
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
