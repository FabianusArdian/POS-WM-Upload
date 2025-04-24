"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, ChefHat, Plus, Trash2, Edit } from "lucide-react";
import { recipeAPI, inventoryAPI, InventoryItem } from "@/lib/api";
import { RecipeData, ingredients } from "@/models/RecipeData";
import { ca } from "date-fns/locale";
// import { set } from "date-fns";
// import { add } from "date-fns";

// Mock data for inventory items
// const mockInventoryItems = [
//   { id: 1, name: "Ayam Fillet", current_stock: 5.35, unit: "kg" },
//   { id: 2, name: "Beras", current_stock: 24.8, unit: "kg" },
//   { id: 3, name: "Minyak Goreng", current_stock: 7.95, unit: "liter" },
//   { id: 4, name: "Fish Ball", current_stock: 1.5, unit: "pack" },
//   { id: 5, name: "Gula", current_stock: 3.99, unit: "kg" },
//   { id: 6, name: "Garam Himalaya", current_stock: 5.0, unit: "kg" },
//   { id: 7, name: "gak nok bahan e", current_stock: 5.0, unit: "kg" },
// ];

export default function RecipesPage() {
  const router = useRouter();
  // const [recipes, setRecipes] = useState(mockRecipes);
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  // const [inventoryItems, setInventoryItems] = useState(mockInventoryItems);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number>(0);
  const [isViewIngredientsDialogOpen, setIsViewIngredientsDialogOpen] =
    useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<RecipeData>({
    id: 0,
    recipe_id: 0,
    name: "",
    description: "",
    category: "",
    ingredients: [],
  });
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
  const recipeCategories = ["Food", "Drinks", "Snacks", "Packages"];

  // In a real implementation, this would fetch from the API
  useEffect(() => {
    try {
      recipeAPI.getAll().then((data) => {
        setRecipes(data);
      });
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }

    try{
      inventoryAPI.getAll().then((data) => {
        setInventoryItems(data);
      });
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }

  }, [isAddDialogOpen, isEditDialogOpen, isDeleteDialogOpen]);

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

  const handleDeleteRecipe = (product_id: number) => {
    
    try {
      recipeAPI.deleteRecipe(product_id);
    } catch (error) {
      console.error("Error deleting recipe:", error);
    } finally { 
      setIsDeleteDialogOpen(false);
    }
    
  };

  const handleAddIngredient = () => {
    // Find the selected inventory item to get its unit
    const selectedItem = inventoryItems.find(
      (item) => item.name === newIngredient.name,
    );

    if (selectedItem) {
      const ingredientToAdd = {
        ...newIngredient,
        id: Date.now(), // Generate a temporary ID
        unit: selectedItem.unit,
      };

      setNewRecipe({
        ...newRecipe,
        ingredients: [...newRecipe.ingredients, ingredientToAdd],
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
  const handleUpdateIngredient = () => {
    // Find the selected inventory item to get its unit
    const selectedItem = inventoryItems.find(
      (item) => item.name === newIngredient.name,
    );

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

  const handleRemoveIngredient = (ingredientId: number) => {
    setNewRecipe({
      ...newRecipe,
      ingredients: newRecipe.ingredients.filter(
        (ingredient) => ingredient.id !== ingredientId,
      ),
    });
  };

  const handleRemoveCurrentIngredient = (ingredientId: number) => {
    setCurrentRecipe({
      ...currentRecipe,
      ingredients: currentRecipe.ingredients.filter(
        (ingredient) => ingredient.id !== ingredientId,
      ),
    });
  }

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

  const openEditDialog = (recipe: RecipeData) => {
    setCurrentRecipe(recipe);
    setIsEditDialogOpen(true);
  };

  

  const openViewIngredientsDialog = (recipe: RecipeData) => {
    setCurrentRecipe(recipe);
    setIsViewIngredientsDialogOpen(true);
  };

  const openDeleteDialog = (value: boolean, product_id: number) => {
    setToDeleteId(product_id);
    setIsDeleteDialogOpen(value);
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">Food POS</h2>
          <p className="text-sm text-muted-foreground">Restaurant Management</p>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start mb-4"
          size="lg"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Button>
      </div>

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
              <CardDescription>
                Manage your recipes and their ingredients.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                      <TableCell className="font-medium">
                        {recipe.name}
                      </TableCell>
                      <TableCell>{recipe.category}</TableCell>
                      <TableCell>{recipe.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewIngredientsDialog(recipe)}
                        >
                          View Ingredients ({recipe.ingredients.length})
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(recipe)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(true, recipe.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Add Recipe Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Recipe</DialogTitle>
            <DialogDescription>
              Create a new recipe with ingredients.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                className="col-span-3"
                value={newRecipe.name}
                onChange={(e) =>
                  setNewRecipe({ ...newRecipe, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right">
                Category
              </label>
              <Select
                value={newRecipe.category}
                onValueChange={(value) =>
                  setNewRecipe({ ...newRecipe, category: value })
                }
              >
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveIngredient(ingredient.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No ingredients added yet.
                  </p>
                )}

                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Select
                      value={newIngredient.name}
                      onValueChange={(value) =>
                        setNewIngredient({ ...newIngredient, name: value })
                      }
                    >
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
                    <span className="text-sm">
                      {inventoryItems.find(
                        (item) => item.name === newIngredient.name,
                      )?.unit || ""}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <Button
                      onClick={handleAddIngredient}
                      disabled={!newIngredient.name || !newIngredient.quantity}
                      className="w-full"
                    >
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
            <Button
              onClick={handleAddRecipe}
              disabled={
                !newRecipe.name ||
                !newRecipe.category ||
                newRecipe.ingredients.length === 0
              }
            >
              Save Recipe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Recipe Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Recipe</DialogTitle>
            <DialogDescription>
              Update recipe details and ingredients.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                Name
              </label>
              <Input
                id="edit-name"
                className="col-span-3"
                value={currentRecipe.name}
                onChange={(e) =>
                  setCurrentRecipe({ ...currentRecipe, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-category" className="text-right">
                Category
              </label>
              <Select
                value={currentRecipe.category}
                onValueChange={(value) =>
                  setCurrentRecipe({ ...currentRecipe, category: value })
                }
              >
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
              </Select>
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveCurrentIngredient(ingredient.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No ingredients added yet.
                  </p>
                )}

                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Select
                      value={newIngredient.name}
                      onValueChange={(value) =>
                        setNewIngredient({ ...newIngredient, name: value })
                      }
                    >
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
                    <span className="text-sm">
                      {inventoryItems.find(
                        (item) => item.name === newIngredient.name,
                      )?.unit || ""}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <Button
                      onClick={handleUpdateIngredient}
                      disabled={!newIngredient.name || !newIngredient.quantity}
                      className="w-full"
                    >
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
            <Button
              onClick={handleEditRecipe}
              disabled={
                !currentRecipe.name ||
                !currentRecipe.category ||
                currentRecipe.ingredients.length === 0
              }
            >
              Update Recipe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Recipe Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipe</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this recipe?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>            
              <Button onClick={() => handleDeleteRecipe(toDeleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Ingredients Dialog */}
      <Dialog
        open={isViewIngredientsDialogOpen}
        onOpenChange={setIsViewIngredientsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentRecipe.name} - Ingredients</DialogTitle>
            <DialogDescription>
              List of ingredients required for this recipe.
            </DialogDescription>
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
            <Button onClick={() => setIsViewIngredientsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


