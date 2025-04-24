export interface RecipeData {
    id: number;
    recipe_id: number;
    name: string;
    description: string;
    category: string;
    ingredients: ingredients[];
}

export interface ingredients {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}