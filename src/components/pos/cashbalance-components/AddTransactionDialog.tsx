"use client"
import React from 'react'

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, setHours, setMinutes, setSeconds } from 'date-fns';
import { getCurrentMonthDateLimits } from '@/lib/utils';

type AddTransactionDialogProps = {
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentTransaction: any;
    setCurrentTransaction: React.Dispatch<React.SetStateAction<any>>;
    handleAddTransaction: () => void;
    handleCancleNewTransaction: () => void;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
    isAddDialogOpen,
    setIsAddDialogOpen,
    currentTransaction,
    setCurrentTransaction,
    handleAddTransaction,
    handleCancleNewTransaction
    
}) => {
    const {min_date, max_date} = getCurrentMonthDateLimits();
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
    <>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                Enter the details of the new cash transaction.
                </DialogDescription>
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
                    value={currentTransaction.date ? currentTransaction.date.split("T")[0] : ""}
                    min={min_date}
                    max={max_date}
                    onChange={e => {
                        const val = e.target.value;
                        if (val) {
                        let dateObj = new Date(val);
                        const now = new Date();
                        dateObj = setHours(dateObj, now.getHours());
                        dateObj = setMinutes(dateObj, now.getMinutes());
                        dateObj = setSeconds(dateObj, now.getSeconds());

                        // Format as ISO datetime string with dynamic time
                        const formattedDate = format(dateObj, "yyyy-MM-dd'T'HH:mm:ss");
                        setCurrentTransaction({
                            ...currentTransaction,
                            date: formattedDate,
                        });
                        } else {
                        setCurrentTransaction({
                            ...currentTransaction,
                            date: "",
                        });
                        }
                    }}
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
                    {getCategories(currentTransaction.type).map(({label, value}) => (
                        <SelectItem key={label} value={value}>
                        {label}
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
                    min={0}                      // disallow negative input from UI
                    className="col-span-3"
                    value={currentTransaction.amount}
                    onChange={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val) || val < 0) val = 0;   // prevent negatives & NaN
                    setCurrentTransaction({
                        ...currentTransaction,
                        amount: val,
                    });
                    }}
                />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => handleCancleNewTransaction()}>
                Cancel
                </Button>
                <Button onClick={handleAddTransaction}>Save</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default AddTransactionDialog