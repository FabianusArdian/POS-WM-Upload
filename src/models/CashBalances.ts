import { Order } from "@/lib/types"
export interface CashBalance {
    total: number
    data: CashBalanceItem[]
}

export interface CashBalanceItem {
    id: number
    date: string
    type: string
    category: string
    descriptions: string
    amount: number
    created_at: string
}

export interface expense {
    total: number
    data: expenseItem[]
}

export interface expenseItem {
    id?: number
    date: string
    type?: string
    category: string
    descriptions: string
    amount: number
}

export interface income {
    total: number
    data: incomeItem[]
}

export interface incomeItem {
    id?: number
    date: string
    type?: string
    category: string
    descriptions: string
    amount: number
}
   
    