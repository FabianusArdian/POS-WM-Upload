"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRecipe } from '@/contexts/recipeContext';
import { Trash2 } from 'lucide-react';

import { ingredients } from '@/models/RecipeData';
import { InventoryItem } from '@/models/InventoryItems';

import { RecipeData } from '@/models/RecipeData';

import { recipeAPI } from '@/lib/api';

interface EditDialogRecipesProps {
    inventoryItems: InventoryItem[];
  }

const EditDialogRecipes: React.FC<EditDialogRecipesProps> = ({ inventoryItems }) => {

    const { currentRecipe, setCurrentRecipe, isEditDialogOpen, setIsEditDialogOpen } = useRecipe();
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
    
    // Categories for recipes
    // const recipeCategories = ["Food", "Drinks", "Snacks", "Packages"];

    const handleUpdateIngredient = () => {
        // Find the selected inventory item to get its unit
        const selectedItem = inventoryItems.find((item) => item.name === newIngredient.name);
    
        if (selectedItem) {
            const ingredientToAdd = {
            ...newIngredient,
            id: Date.now(), // Generate a temporary ID
            unit: selectedItem.unit,
            };
    
            setCurrentRecipe({
            ...currentRecipe,
            ingredients: [...currentRecipe.ingredients, ingredientToAdd],
            });
    
            // Reset the new ingredient form
            setNewIngredient({
            id: 0,
            name: "",
            quantity: 0,
            unit: "",
            });
        }
        };
    const handleEditRecipe = () => {
        try {
          recipeAPI.updateRecipe(currentRecipe.id, currentRecipe);
        } catch (error) {
          console.error("Error updating recipe:", error);
        } finally {
          resetForm();
          setIsEditDialogOpen(false);
        }
      };
    const handleRemoveCurrentIngredient = (ingredientId: number) => {
        setCurrentRecipe({
            ...currentRecipe,
            ingredients: currentRecipe.ingredients.filter((ingredient) => ingredient.id !== ingredientId),
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
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Recipe</DialogTitle>
                    <DialogDescription>Update recipe details and ingredients.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-name" className="text-right">
                        Name
                      </label>
                        <Input id="edit-name" className="col-span-3" value={currentRecipe.name} disabled />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-category" className="text-right">
                        Category
                      </label>
                      <Input id="edit-name" className="col-span-3" value={currentRecipe.category} disabled />
                      {/* <Select value={currentRecipe.category} onValueChange={(value) => setCurrentRecipe({ ...currentRecipe, category: value })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {recipeCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select> */}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-description" className="text-right">
                        Description
                      </label>
                      <Input
                        id="edit-description"
                        className="col-span-3"
                        value={currentRecipe.description}
                        onChange={(e) =>
                          setCurrentRecipe({
                            ...currentRecipe,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
        
                    <div className="border-t pt-4 mt-2">
                      <h4 className="font-medium mb-2">Ingredients</h4>
                      <div className="space-y-4">
                        {currentRecipe.ingredients.length > 0 ? (
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
                              {currentRecipe.ingredients.map((ingredient) => (
                                <TableRow key={ingredient.id}>
                                  <TableCell>{ingredient.name}</TableCell>
                                  <TableCell>{ingredient.quantity}</TableCell>
                                  <TableCell>{ingredient.unit}</TableCell>
                                  <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveCurrentIngredient(ingredient.id)}>
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
                            <Button onClick={handleUpdateIngredient} disabled={!newIngredient.name || !newIngredient.quantity} className="w-full">
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
                        setIsEditDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleEditRecipe} disabled={!currentRecipe.name || !currentRecipe.category || currentRecipe.ingredients.length === 0}>
                      Update Recipe
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
    </div>
  )
}

export default EditDialogRecipes