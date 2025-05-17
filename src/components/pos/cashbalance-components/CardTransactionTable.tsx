import React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";

import { format, setHours, setMinutes, setSeconds } from "date-fns";

type CardTransactionTableProps = {

    formatted_start_date: string;
    formatted_end_date: string;
    paginatedData: any[];
    handleActiveTab: (value: string) => void;
    activeTab: string;
    


}
const CardTransactionTable: React.FC<CardTransactionTableProps> = (
    {   formatted_start_date, 
        formatted_end_date, 
        paginatedData, 
        handleActiveTab, 
        activeTab
    }
) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };
  return (
    <>
        <Card>
            <CardHeader>
              <CardTitle>Transaction History for {formatted_start_date} - {formatted_end_date}</CardTitle>
              <CardDescription>
                View all cash transactions for your business.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={handleActiveTab}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Transactions</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expense">Expenses</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map(tx => (
                        <TableRow key={`${tx.type}-${tx.date}-${tx.amount}-${tx.id}`}>
                          <TableCell>
                            {format(new Date(tx.date), "yyyy-MM-dd")}
                          </TableCell>
                          <TableCell>
                            <span
                              className={[
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                tx.type === "income"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100   text-red-800",
                              ].join(" ")}
                            >
                              {tx.type === "income" ? "Income" : "Expense"}
                            </span>
                          </TableCell>
                          <TableCell>{tx.category}</TableCell>
                          <TableCell>{tx.descriptions}</TableCell>
                          <TableCell className="text-right">
                            <span className={tx.type === "income" ? "text-green-600" : "text-red-600"}>
                              {formatCurrency(tx.amount)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No data found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
    
    </>
  )
}

export default CardTransactionTable