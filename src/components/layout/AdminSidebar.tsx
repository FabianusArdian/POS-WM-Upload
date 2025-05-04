"use client";

import { useRouter } from "next/navigation";
import {
  BarChart3,
  ChefHat,
  ClipboardList,
  FileText,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRole } from "@/contexts/roleContext";
import { getCurrentUser } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function AdminSidebar() {
  const router = useRouter();
  const role = useRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <div>
      <button
        className="lg:hidden md:block sm:block"
        onClick={handleToggleSidebar}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className={`sidebar ${isSidebarOpen ? "block" : "hidden"} lg:block`}>
        <div className="w-64 border-r bg-card p-4 flex flex-col sm:w-24 md:w-32 lg:w-48">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary sm:text-sm md:text-md lg:text-lg">
              Food POS
            </h2>
            <p className="text-sm text-muted-foreground sm:text-sm md:text-md lg:text-lg">
              Restaurant Management
            </p>
          </div>

          <nav className="space-y-2 flex-1">
            <Button
              variant="ghost"
              className="w-full justify-start sm:p-0 md:p-2 lg:p-4"
              size="lg"
              onClick={() => router.push("/")}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Sales
            </Button>
            <Button
              variant="ghost"
              className={`sm:p-0 md:p-0 lg:p-4 ${role === "admin" ? "w-full justify-start" : "hidden"}`}
              size="lg"
              onClick={() => router.push("/inventory")}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Inventory
            </Button>
            <Button
              variant="ghost"
              className={`sm:p-0 md:p-0 lg:p-4 ${role === "admin" ? "w-full justify-start" : "hidden"}`}
              size="lg"
              onClick={() => router.push("/products")}
            >
              <Package className="mr-2 h-5 w-5" />
              Products
            </Button>
            <Button
              variant="ghost"
              className={`sm:p-0 md:p-0 lg:p-4 ${role === "admin" ? "w-full justify-start" : "hidden"}`}
              size="lg"
              onClick={() => router.push("/recipes")}
            >
              <ChefHat className="mr-2 h-5 w-5" />
              Recipes
            </Button>
            <Button
              variant="ghost"
              className={`sm:p-0 md:p-0 lg:p-4 ${role === "admin" ? "w-full justify-start" : "hidden"}`}
              size="lg"
              onClick={() => router.push("/reports")}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Reports
            </Button>
            <Button
              variant="ghost"
              className={`sm:p-0 md:p-0 lg:p-4 ${role === "admin" ? "w-full justify-start" : "hidden"}`}
              size="lg"
              onClick={() => router.push("/product-report")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Product Report
            </Button>
            <Button
              variant="ghost"
              className={`sm:p-0 md:p-0 lg:p-4 ${role === "admin" ? "w-full justify-start" : "hidden"}`}
              size="lg"
              onClick={() => router.push("/cash-balance")}
            >
              <Wallet className="mr-2 h-5 w-5" />
              Cash Balance
            </Button>
            <Button
              variant="ghost"
              className={`sm:p-0 md:p-0 lg:p-4 ${role === "admin" ? "w-full justify-start" : "hidden"}`}
              size="lg"
              onClick={() => router.push("/settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </nav>
        </div>
        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center gap-3 sm:gap-0">
            <Avatar>
              <AvatarImage src={undefined} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.name || "Guest"}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role || "unknown"}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
