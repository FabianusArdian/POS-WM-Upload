"use client"

import React, { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRecipe } from "@/contexts/recipeContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2 } from 'lucide-react';

import { ingredients, RecipeData } from '@/models/RecipeData';
import { InventoryItem } from '@/models/InventoryItems';

import { recipeAPI } from '@/lib/api';
import { Product } from '@/models/ProductData';

interface AddDialogRecipesProps {
    inventoryItems: InventoryItem[]
    products: Product[]
    recipes: RecipeData[]
}

const AddDialogRecipes: React.FC<AddDialogRecipesProps> = ({products, inventoryItems, recipes}) => {
    const { isAddDialogOpen, setIsAddDialogOpen } = useRecipe();

    const uniqueCategories = useMemo(
        
        () => Array.from(new Set(products.map((p) => p.category))),
        [products]
      );

    const availableProducts = useMemo(() => {
    const usedIds = new Set(recipes.map((r) => r.id /* or r.product_id */));
    return products.filter((p) => !usedIds.has(p.id));
    }, [products, recipes]);
    

    const [newIngredient, setNewIngredient] = useState<ingredients>({
        id: 0,
        name: "",
        quantity: 0,
        unit: "",
      });
    
    const [newRecipe, setNewRecipe] = useState<RecipeData>({
        id: 0,
        recipe_id: 0,
        name: "",
        description: "",
        category: "",
        ingredients: [],
    });
    const handleAddRecipe = () => {
        try {
          recipeAPI.createRecipe(newRecipe);
        } catch (error) {
          console.error("Error adding recipe:", error);
        } finally {
          resetForm();
          setIsAddDialogOpen(false);
        }
      };
    
    const handleAddIngredient = () => {
        // find your selected inventory item
        const selectedItem = inventoryItems.find(
          (item) => item.name === newIngredient.name
        );
        if (!selectedItem) return;
      
        const ingredientToAdd = {
          ...newIngredient,
          id: Date.now(),        // temp ID
          unit: selectedItem.unit,
        };
      
        // 1) Functional updater + inline log
        setNewRecipe((prev) => {
          const updated = {
            ...prev,
            ingredients: [...prev.ingredients, ingredientToAdd],
          };
          console.log("New recipe state:", updated);
          return updated;
        });
      
        // 2) reset your form
        setNewIngredient({ id: 0, name: "", quantity: 0, unit: "" });
      };
    
      const handleRemoveIngredient = (ingredientId: number) => {
        setNewRecipe({
          ...newRecipe,
          ingredients: newRecipe.ingredients.filter((ingredient) => ingredient.id !== ingredientId),
        });
      };
    
      const resetForm = () => {
        setNewRecipe({
          id: 0,
          recipe_id: 0,
          name: "",
          description: "",
          category: "",
          ingredients: [],
        });
        setNewIngredient({
          id: 0,
          name: "",
          quantity: 0,
          unit: "",
        });
      };
    
  return (
    <div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                <DialogTitle>Add New Recipe</DialogTitle>
                <DialogDescription>Create a new recipe with ingredients.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">
                    Name
                    </label>
                    <Select
                        value={newRecipe.name}                            
                        onValueChange={(selectedName) => {
                            const prod = availableProducts.find(p => p.name === selectedName);
                            if (!prod) return;

                            // update both id and name (and you could pull in category/description/etc here too)
                            setNewRecipe(prev => ({
                            ...prev,
                            id: prod.id,
                            name: prod.name,
                            category: prod.category,
                            }));
                        }}
                        >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select product" />
                        </SelectTrigger>

                        <SelectContent>
                            {availableProducts.map(prod => (
                            // use the name as the value so SelectValue will render it
                            <SelectItem key={prod.id} value={prod.name}>
                                {prod.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="category" className="text-right">
                    Category
                    </label>
                    <Select value={newRecipe.category} onValueChange={(value) => setNewRecipe({ ...newRecipe, category: value })}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {uniqueCategories.map((category) => (
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
                    value={newRecipe.description}
                    onChange={(e) =>
                        setNewRecipe({
                        ...newRecipe,
                        description: e.target.value,
                        })
                    }
                    />
                </div>
    
                <div className="border-t pt-4 mt-2">
                    <h4 className="font-medium mb-2">Ingredients</h4>
                    <div className="space-y-4">
                    {newRecipe.ingredients.length > 0 ? (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Ingredient</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {newRecipe.ingredients.map((ingredient) => (
                            <TableRow key={ingredient.id}>
                                <TableCell>{ingredient.name}</TableCell>
                                <TableCell>{ingredient.quantity}</TableCell>
                                <TableCell>{ingredient.unit}</TableCell>
                                <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveIngredient(ingredient.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground">No ingredients added yet.</p>
                    )}
    
                    <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                        <Select value={newIngredient.name} onValueChange={(value) => setNewIngredient({ ...newIngredient, name: value })}>
                            <SelectTrigger>
                            <SelectValue placeholder="Select ingredient" />
                            </SelectTrigger>
                            <SelectContent>
                            {inventoryItems.map((item) => (
                                <SelectItem key={item.id} value={item.name}>
                                {item.name} ({item.unit})
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="col-span-3">
                        <Input
                            type="number"
                            // placeholder="Quantity"
                            value={newIngredient.quantity || 0}
                            step="any"
                            inputMode="decimal"
                            onChange={(e) => {
                            const value = e.target.value;
                            const parsedValue = parseFloat(value);
                            setNewIngredient({
                                ...newIngredient,
                                quantity: !isNaN(parsedValue) ? parsedValue : 0, // Parse as number and handle invalid input
                            });
                            }}
                        />
                        </div>
                        <div className="col-span-2">
                        <span className="text-sm">{inventoryItems.find((item) => item.name === newIngredient.name)?.unit || ""}</span>
                        </div>
                        <div className="col-span-2">
                        <Button onClick={handleAddIngredient} disabled={!newIngredient.name || !newIngredient.quantity} className="w-full">
                            Add
                        </Button>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                    }}
                >
                    Cancel
                </Button>
                <Button onClick={handleAddRecipe} disabled={!newRecipe.name || !newRecipe.category || newRecipe.ingredients.length === 0}>
                    Save Recipe
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
    </div>
  )
}

export default AddDialogRecipes