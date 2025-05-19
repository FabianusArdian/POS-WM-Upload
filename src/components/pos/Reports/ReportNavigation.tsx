"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, PieChart, LineChart, BarChart, DollarSign } from "lucide-react"

export default function ReportNavigation() {
  const router = useRouter()

  // Report types for navigation
  const reportTypes = [
    {
      name: "Sales Transactions",
      path: "/reports",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "Popular Products",
      path: "/reports/popular-products",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      name: "Category Breakdown",
      path: "/reports/category-breakdown",
      icon: <PieChart className="h-5 w-5" />,
    },
    {
      name: "Price Range Analysis",
      path: "/reports/price-range-analysis",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Time-Based Analysis",
      path: "/reports/time-based-analysis",
      icon: <LineChart className="h-5 w-5" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {reportTypes.map((report) => (
        <Card
          key={report.path}
          className={`cursor-pointer hover:bg-muted/50 transition-colors ${report.path === "/reports" ? "bg-primary/10" : ""}`}
          onClick={() => router.push(report.path)}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-primary/10 p-3 mb-3">{report.icon}</div>
            <h3 className="font-medium text-center">{report.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
