import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useRecipe } from "@/contexts/recipeContext";

import { recipeAPI } from "@/lib/api";
const DeleteDialogRecipes = () => {
    const { toDeleteId, isDeleteDialogOpen, setIsDeleteDialogOpen } = useRecipe();

    const handleDeleteRecipe = (product_id: number) => {
        try {
          recipeAPI.deleteRecipe(product_id);
        } catch (error) {
          console.error("Error deleting recipe:", error);
        } finally {
          setIsDeleteDialogOpen(false);
        }
      };
  return (
    <div>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Recipe</DialogTitle>
                <DialogDescription>Are you sure you want to delete this recipe?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
                </Button>
                <Button onClick={() => handleDeleteRecipe(toDeleteId)}>Delete</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default DeleteDialogRecipes