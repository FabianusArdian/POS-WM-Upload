"use client";

import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus} from "lucide-react";
import { recipeAPI, inventoryAPI } from "@/lib/api";
import { InventoryItem } from "@/models/InventoryItems";
import { RecipeData } from "@/models/RecipeData";
// import { ca } from "date-fns/locale";
import Navside from "@/components/navside/navside";
import TableRecipes from "@/components/pos/recipe-components/TableRecipes";
import { useRecipe } from "@/contexts/recipeContext";
import AddDialogRecipes from "@/components/pos/recipe-components/AddDialogRecipes";
import { productsAPI } from "@/lib/api";
import { Product } from "@/models/ProductData";


export default function RecipesPage() {
  // const router = useRouter();

  const { isEditDialogOpen, isDeleteDialogOpen, isAddDialogOpen, setIsAddDialogOpen } = useRecipe();
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  // In a real implementation, this would fetch from the API
  useEffect(() => {
    try {
      recipeAPI.getAll().then((data) => {
        setRecipes(data);
      });
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }

    try {
      inventoryAPI.getAll().then((data) => {
        setInventoryItems(data);
      });
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }

    try {
      productsAPI.getAll().then((data) => {
        setProducts(data);
      });
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
    
  }, [isAddDialogOpen, isEditDialogOpen, isDeleteDialogOpen]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <Navside />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Recipe Management</h1>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Recipe
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipe List</CardTitle>
              <CardDescription>Manage your recipes and their ingredients.</CardDescription>
            </CardHeader>
            <CardContent>
              <TableRecipes recipes={recipes} inventoryItems={inventoryItems}/>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Add Recipe Dialog */}
      <AddDialogRecipes inventoryItems={inventoryItems} products={products} recipes={recipes}/>
      
    </div>
  );
}
