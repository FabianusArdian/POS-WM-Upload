"use client"

import React, { useState } from 'react'
import { RecipeData, ingredients } from '@/models/RecipeData'
import { InventoryItem } from '@/models/InventoryItems'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, ChefHat, Plus, Trash2, Edit } from "lucide-react";
import { Button } from '@/components/ui/button'
import { useRecipe } from '@/contexts/recipeContext'
import EditDialogRecipes from './EditDialogRecipes'
import ViewIngredientsDialog from './ViewIngredientsDialog'
import DeleteDialogRecipes from './DeleteDialogRecipes'

interface TableRecipesProps {
    recipes: RecipeData[]
    inventoryItems: InventoryItem[]
}

const TableRecipes: React.FC<TableRecipesProps> = ({recipes, inventoryItems}) => {
      // const [inventoryItems, setInventoryItems] = useState(mockInventoryItems);

    const { setCurrentRecipe, setIsEditDialogOpen, setIsDeleteDialogOpen,
        setToDeleteId, setIsViewIngredientsDialogOpen
     } = useRecipe();

    // const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    // const [toDeleteId, setToDeleteId] = useState<number>(0);
    // const [isViewIngredientsDialogOpen, setIsViewIngredientsDialogOpen] = useState(false);
    // const [currentRecipe, setCurrentRecipe] = useState<RecipeData>({
    //     id: 0,
    //     recipe_id: 0,
    //     name: "",
    //     description: "",
    //     category: "",
    //     ingredients: [],
    // });
    // const [newIngredient, setNewIngredient] = useState<ingredients>({
    //     id: 0,
    //     name: "",
    //     quantity: 0,
    //     unit: "",
    // });
    
    // const [newRecipe, setNewRecipe] = useState<RecipeData>({
    //     id: 0,
    //     recipe_id: 0,
    //     name: "",
    //     description: "",
    //     category: "",
    //     ingredients: [],
    // });
    
      // Categories for recipes
    // const recipeCategories = ["Food", "Drinks", "Snacks", "Packages"];
    
    const openViewIngredientsDialog = (recipe: RecipeData) => {
        setCurrentRecipe(recipe);
        setIsViewIngredientsDialogOpen(true);
      };
    const openEditDialog = (recipe: RecipeData) => {
        setCurrentRecipe(recipe);
        setIsEditDialogOpen(true);
      };
    const openDeleteDialog = (value: boolean, product_id: number) => {
        setToDeleteId(product_id);
        setIsDeleteDialogOpen(value);
    };
    
  return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Ingredients</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {recipes.map((recipe) => (
                <TableRow key={recipe.id}>
                    <TableCell className="font-medium">{recipe.name}</TableCell>
                    <TableCell>{recipe.category}</TableCell>
                    <TableCell>{recipe.description}</TableCell>
                    <TableCell>
                    <Button variant="outline" size="sm" onClick={() => openViewIngredientsDialog(recipe)}>
                        View Ingredients ({recipe.ingredients.length})
                    </Button>
                    </TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(recipe)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(true, recipe.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
        {/* Edit Dialog */}
        <EditDialogRecipes inventoryItems={inventoryItems} />

        {/* View Ingredients Dialog */}
        <ViewIngredientsDialog />

        {/* Delete Dialog */}
        <DeleteDialogRecipes />

    </div>
  )
}

export default TableRecipes