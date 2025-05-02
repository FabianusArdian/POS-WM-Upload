"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowDownUp, Plus, Wallet } from "lucide-react";

// Mock data for cash transactions
const mockTransactions = [
  {
    id: 1,
    date: "2023-05-01",
    type: "income",
    category: "Sales",
    description: "Daily sales",
    amount: 1500000,
  },
  {
    id: 2,
    date: "2023-05-02",
    type: "expense",
    category: "Ingredients",
    description: "Vegetable purchase",
    amount: 250000,
  },
  {
    id: 3,
    date: "2023-05-03",
    type: "income",
    category: "Sales",
    description: "Daily sales",
    amount: 1750000,
  },
  {
    id: 4,
    date: "2023-05-03",
    type: "expense",
    category: "Utilities",
    description: "Electricity bill",
    amount: 350000,
  },
];

export default function CashBalancePage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentTransaction, setCurrentTransaction] = useState({
    id: 0,
    date: new Date().toISOString().split("T")[0],
    type: "income",
    category: "",
    description: "",
    amount: 0,
  });

  // In a real implementation, this would fetch from the API
  useEffect(() => {
    // Fetch transactions from API
    // For now, we're using mock data
  }, []);

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.type === activeTab;
  });

  // Calculate total income, expenses, and balance
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleAddTransaction = () => {
    // In a real implementation, this would call the API
    const newTransaction = {
      ...currentTransaction,
      id: transactions.length + 1,
    };
    setTransactions([...transactions, newTransaction]);
    setCurrentTransaction({
      id: 0,
      date: new Date().toISOString().split("T")[0],
      type: "income",
      category: "",
      description: "",
      amount: 0,
    });
    setIsAddDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Categories based on transaction type
  const getCategories = (type: string) => {
    if (type === "income") {
      return ["Sales", "Investment", "Other Income"];
    } else {
      return ["Ingredients", "Utilities", "Rent", "Salary", "Equipment", "Marketing", "Other"];
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">Food POS</h2>
          <p className="text-sm text-muted-foreground">Restaurant Management</p>
        </div>

        <Button variant="ghost" className="w-full justify-start mb-4" size="lg" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Cash Balance Management</h1>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current Balance</CardTitle>
                <CardDescription>Total available cash</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Income</CardTitle>
                <CardDescription>All time income</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Expenses</CardTitle>
                <CardDescription>All time expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all cash transactions for your business.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
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
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${transaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {transaction.type === "income" ? "Income" : "Expense"}
                            </span>
                          </TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="text-right">
                            <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>{formatCurrency(transaction.amount)}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>Enter the details of the new cash transaction.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right">
                Date
              </label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
                value={currentTransaction.date}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    date: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right">
                Type
              </label>
              <Select
                value={currentTransaction.type}
                onValueChange={(value) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    type: value,
                    category: "", // Reset category when type changes
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right">
                Category
              </label>
              <Select
                value={currentTransaction.category}
                onValueChange={(value) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    category: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getCategories(currentTransaction.type).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Input
                id="description"
                className="col-span-3"
                value={currentTransaction.description}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                className="col-span-3"
                value={currentTransaction.amount}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    amount: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
