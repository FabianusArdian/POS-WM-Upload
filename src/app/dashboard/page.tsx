"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  ChefHat,
  ClipboardList,
  DollarSign,
  FileText,
  LogOut,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";
import SalesInterface from "@/components/pos/SalesInterface";
import { useRole } from "@/contexts/roleContext";
import moment from 'moment';
import { ordersAPI } from '@/lib/api';
import { getCurrentUser, getCurrentUserId } from "@/lib/utils";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface Order {
  id: number;
  order_number: string;
  timestamp: string;
  order_type: string;
  total_amount: number;
  payment_status: string;
  paid_at: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [todaysOrders, setTodaysOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/login");
  };


  const role = useRole();
  const formattedDate = moment().format('YYYY-MM-DD');

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);

    const id = getCurrentUserId();
    setUserId(id);
  }, []);

  useEffect(() => {
    const todayDate = moment().format("YYYY-MM-DD");
  
    ordersAPI.getAll("paid").then((response) => {
      const ordersToday = response.data.filter((order) =>
        moment(order.paid_at).isSame(todayDate, "day")
      );
  
      setTodaysOrders(ordersToday);
      setTotalOrders(ordersToday.length); // total paid hari ini
    });
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="flex h-screen bg-background">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <ClipboardList className="mr-2 h-4 w-4" />
                Today's Orders: {todaysOrders.length}
              </Button>
              <Button variant="outline" size="sm">
              Date: {moment().format('dddd, MMMM D, YYYY')}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="sales" className="w-full">
            <TabsContent value="sales" className="mt-0">
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Sales Interface</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                <SalesInterface userId={userId} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
