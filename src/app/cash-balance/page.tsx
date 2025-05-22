"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowDownUp, Plus, Wallet } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoreVertical } from "lucide-react"

import { cashBalanceAPI } from "@/lib/api";
import { CashBalance, expense, income } from "@/models/CashBalances";
import { format, setHours, setMinutes, setSeconds } from "date-fns";
import { getCurrentMonthRange, getCurrentMonthDateLimits } from "@/lib/utils";
// Re-use the same item shape
type Transaction = {
  id?: number
  date: string
  type?: "income" | "expense"
  category: string
  descriptions: string
  amount: number
}

type TabValue = "all" | "income" | "expense";

import CardSummary from "@/components/pos/cashbalance-components/CardSummary";
import CardTransactionTable from "@/components/pos/cashbalance-components/CardTransactionTable";
import AddTransactionDialog from "@/components/pos/cashbalance-components/AddTransactionDialog";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function CashBalancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  // const dateString = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
  const [currentTransaction, setCurrentTransaction] = useState({
    date: "",
    type: "",
    category: "",
    description: "",
    amount: 0,
  });

  const [cashBalances, setCashBalances] = useState<CashBalance>({ total: 0, data: [] });
  const [expenses, setExpenses] = useState<expense>({ total: 0, data: [] });
  const [incomes, setIncomes] = useState<income>({ total: 0, data: [] });
  const [page, setPage] = useState(1);

  const {current_month_start_date, current_month_end_date} = getCurrentMonthRange();
  const {min_date, max_date} = getCurrentMonthDateLimits();

  const formatted_start_date = format(current_month_start_date, "PPP");
  const formatted_end_date = format(current_month_end_date, "PPP");
  const ExportPopover = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          Export <MoreVertical className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2 mb-2"> {/* ← ini */}
        <div className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start" onClick={handleExportExcel}>
            Export to Excel
          </Button>
          <Button variant="ghost" className="justify-start" onClick={handleExportPDF}>
            Export to PDF
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )

  const handleExportExcel = () => {
  const summary = [
    ["Start Date", formatted_start_date],
    ["End Date", formatted_end_date],
    ["Current Balance", balance],
    ["Total Income", totalIncome],
    ["Total Expenses", totalExpenses],
  ]

  const headers = ["Date", "Type", "Category", "Description", "Amount"]

  const transactionRows = transactions.map((tx) => [
    tx.date ? format(new Date(tx.date), "yyyy-MM-dd") : "-",
    tx.type ?? "-",
    tx.category ?? "-",
    tx.descriptions ?? "-",
    tx.amount ?? 0,
  ])

  const sheetData = [...summary, [], headers, ...transactionRows] // ← tambahkan 1 baris kosong antar bagian

  const ws = XLSX.utils.aoa_to_sheet(sheetData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Cash Balance Report")
  XLSX.writeFile(wb, `cash_balance_${Date.now()}.xlsx`)
  }


  const handleExportPDF = () => {
  const doc = new jsPDF()

  doc.setFontSize(14)
  doc.text("Cash Balance Report", 14, 15)
  doc.setFontSize(10)
  doc.text(`Period: ${formatted_start_date} - ${formatted_end_date}`, 14, 22)
  doc.text(`Current Balance: Rp ${balance.toLocaleString("id-ID")}`, 14, 28)
  doc.text(`Total Income: Rp ${totalIncome.toLocaleString("id-ID")}`, 14, 34)
  doc.text(`Total Expenses: Rp ${totalExpenses.toLocaleString("id-ID")}`, 14, 40)

    autoTable(doc, {
      startY: 50,
      head: [["Date", "Type", "Category", "Description", "Amount"]],
      body: transactions.map(tx => [
        tx.date ? format(new Date(tx.date), "yyyy-MM-dd") : "-",
        tx.type ?? "-",
        tx.category ?? "-",
        tx.descriptions ?? "-",
        `Rp ${tx.amount?.toLocaleString("id-ID") ?? "0"}`
      ])
    })

    doc.save(`cash_balance_${Date.now()}.pdf`)
  }


  // In a real implementation, this would fetch from the API
  useEffect(() => {
    // Fetch transactions from API
    // For now, we're using mock data
    async function fetchAll() {
      try {
          // Fire both requests in parallel
          const [ saleRes, expRes, incRes ] = await Promise.all([
            cashBalanceAPI.getAll({
              start_date: current_month_start_date,
              end_date:   current_month_end_date,
              transaction_type: "sale",
            }),
            cashBalanceAPI.getAllExpenses({
              start_date: current_month_start_date,
              end_date:   current_month_end_date,
            }),
            cashBalanceAPI.getAllIncomes({
              start_date: current_month_start_date,
              end_date:   current_month_end_date,
            })
          ])

          setIncomes(incRes)
          setCashBalances(saleRes)
          setExpenses(expRes)

          // Merge _after_ both complete
          const merged: Transaction[] = [
          // map sales
          ...saleRes.data.map(s => ({
            id:          s.id,
            date:        s.created_at ?? s.date,   // prefer created_at but fallback
            type:        "income" as const,
            category:    s.category,
            descriptions: s.descriptions,
            amount:      s.amount,
          })),
          // map expenses
          ...expRes.data.map(e => ({
            id:          e.id,
            date:        e.date,                        // your expense already has `.date`
            type:        "expense" as const,
            category:    e.category,
            descriptions: e.descriptions,
            amount:      e.amount,
          })),
          ...incRes.data.map(inc => ({
            id:          inc.id,
            date:        inc.date,   // prefer created_at but fallback
            type:        "income" as const,
            category:    inc.category,
            descriptions: inc.descriptions,
            amount:      inc.amount,
          })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          
          setTransactions(merged)
        }
        catch (err: any) {
          console.error(err)
        }
      }
    fetchAll()
    
  }, [activeTab, isAddDialogOpen]);
  
  const cashBalacneAmount = cashBalances
  ? cashBalances.data.reduce((sum, cash) => sum + cash.amount, 0)
  : 0;

  const incomeAmount = incomes
  ? incomes.data.reduce((sum, inc) => sum + inc.amount, 0)
  : 0;
  const totalIncome = cashBalacneAmount + incomeAmount

  // handleActiveTab
  const handleActiveTab = useCallback((tab: string) => {
    // you could narrow `tab` to TabValue here if you like:
    setActiveTab(tab as TabValue);
    setPage(1);
  }, []);

  const filteredTransactions = useMemo(() => {
    if (activeTab === "all") return transactions;
    return transactions.filter(tx => tx.type === activeTab);
  }, [transactions, activeTab]);

  const paginatedData = filteredTransactions.slice((page - 1) * 10, page * 10);
  const totalPages = Math.ceil(filteredTransactions.length / 10);

  const totalExpenses = expenses
  ? expenses.data.reduce((sum, expense) => sum + expense.amount, 0)
  : 0;

  const balance = totalIncome - totalExpenses;

  const handleAddTransaction = () => {
    
    switch (currentTransaction.type) {
      case "income":
        try {
          cashBalanceAPI.createIncome({
            date: currentTransaction.date,
            category: currentTransaction.category,
            descriptions: currentTransaction.description,
            amount: currentTransaction.amount,
          });
        } catch (err: any) {
          console.error(err)
        } finally {
          setCurrentTransaction({
            date: "",
            type: "",
            category: "",
            description: "",
            amount: 0,
          })
          setIsAddDialogOpen(false);
        }
        break;
      case "expense":
        try {
          cashBalanceAPI.createExpense({
            date: currentTransaction.date,
            category: currentTransaction.category,
            descriptions: currentTransaction.description,
            amount: currentTransaction.amount,
          });
        } catch (err: any) {
          console.error(err)
        } finally {
          setCurrentTransaction({
            date: "",
            type: "",
            category: "",
            description: "",
            amount: 0,
          })
          setIsAddDialogOpen(false);
        }
        break;
      default:
        alert("Invalid transaction type");
    }

    console.log("New transaction:", currentTransaction);
    console.log("date", currentTransaction.date)
    // setIsAddDialogOpen(false);
  };

  const handleCancleNewTransaction = () => {
    setCurrentTransaction({
      date: "",
      type: "",
      category: "",
      description: "",
      amount: 0,
    });
    setIsAddDialogOpen(false);
  }

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
    return [
      { label: "Investment", value: "investment" },
      { label: "Other Income", value: "other_income" },
    ];
  } else {
    return [
      { label: "Ingredient", value: "ingredient" },
      { label: "Utilitie", value: "utilitie" },
      { label: "Rent", value: "rent" },
      { label: "Salary", value: "salary" },
      { label: "Equipment", value: "equipment" },
      { label: "Marketing", value: "marketing" },
      { label: "Other", value: "other" },
    ];
  }
};

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <AdminSidebar />

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
            <CardSummary balance={balance} totalExpenses={totalExpenses} totalIncome={totalIncome} />
          </div>

          <div className="flex justify-end mb-2">
            <ExportPopover />
          </div>

          {/* Transactions Table */}
          <CardTransactionTable 
              formatted_start_date={formatted_start_date} 
              formatted_end_date={formatted_end_date} 
              paginatedData={paginatedData} 
              handleActiveTab={handleActiveTab} 
              activeTab={activeTab}
            />
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= Math.ceil(filteredTransactions.length / 10)}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </main>
      </div>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog 
        isAddDialogOpen={isAddDialogOpen} 
        setIsAddDialogOpen={setIsAddDialogOpen} 
        currentTransaction={currentTransaction} 
        setCurrentTransaction={setCurrentTransaction} 
        handleAddTransaction={handleAddTransaction} 
        handleCancleNewTransaction={handleCancleNewTransaction}
      />
      
    </div>
  );
}
