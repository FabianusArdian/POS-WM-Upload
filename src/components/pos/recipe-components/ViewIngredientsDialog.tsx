import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from "@/components/ui/button";
import React from 'react'

import { RecipeData } from "@/models/RecipeData";
import { useRecipe } from "@/contexts/recipeContext";

// interface ViewIngredientsDialogProps {
//     isViewIngredientsDialogOpen: boolean;
//     setIsViewIngredientsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     currentRecipe: RecipeData;
// }
const ViewIngredientsDialog = () => {

    const { currentRecipe, setIsViewIngredientsDialogOpen, isViewIngredientsDialogOpen } = useRecipe();
  return (
    <div>
        <Dialog open={isViewIngredientsDialogOpen} onOpenChange={setIsViewIngredientsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{currentRecipe.name} - Ingredients</DialogTitle>
                <DialogDescription>List of ingredients required for this recipe.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Ingredient</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentRecipe.ingredients.map((ingredient) => (
                        <TableRow key={ingredient.id}>
                        <TableCell>{ingredient.name}</TableCell>
                        <TableCell>{ingredient.quantity}</TableCell>
                        <TableCell>{ingredient.unit}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
                <DialogFooter>
                <Button onClick={() => setIsViewIngredientsDialogOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default ViewIngredientsDialog