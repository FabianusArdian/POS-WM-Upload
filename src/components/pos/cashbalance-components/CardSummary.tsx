import React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardSummaryProps = {
    balance: number,
    totalExpenses: number,
    totalIncome: number
}

const CardSummary: React.FC<CardSummaryProps> = ({balance, totalExpenses, totalIncome}) => {
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
            <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Balance</CardTitle>
            <CardDescription>Total available cash</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
                {formatCurrency(balance)}
            </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Income</CardTitle>
            <CardDescription>All time income</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
            </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expenses</CardTitle>
            <CardDescription>All time expenses</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
            </div>
            </CardContent>
        </Card>
    </>
  )
}

export default CardSummary