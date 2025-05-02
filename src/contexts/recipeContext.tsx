"use client"
import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    Dispatch,
    SetStateAction,
  } from "react";
  import { RecipeData } from "@/models/RecipeData";

type RecipeContextType = {
    currentRecipe: RecipeData;
    setCurrentRecipe: Dispatch<SetStateAction<RecipeData>>;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: Dispatch<SetStateAction<boolean>>;
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
    toDeleteId: number;
    setToDeleteId: Dispatch<SetStateAction<number>>;
    isViewIngredientsDialogOpen: boolean;
    setIsViewIngredientsDialogOpen: Dispatch<SetStateAction<boolean>>;
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: Dispatch<SetStateAction<boolean>>;
    
 };

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {

    const [currentRecipe, setCurrentRecipe] = useState<RecipeData>({
        id: 0,
        recipe_id: 0,
        name: "",
        description: "",
        category: "",
        ingredients: [],
      });
    
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState<number>(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewIngredientsDialogOpen, setIsViewIngredientsDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
      return (
        <RecipeContext.Provider value={
            { 
              currentRecipe, setCurrentRecipe, isEditDialogOpen, setIsEditDialogOpen,
              toDeleteId, setToDeleteId, isDeleteDialogOpen, setIsDeleteDialogOpen, isViewIngredientsDialogOpen,
              setIsViewIngredientsDialogOpen, isAddDialogOpen, setIsAddDialogOpen
            }
            }>
          {children}
        </RecipeContext.Provider>
      );
};

export function useRecipe() {
    const context = useContext(RecipeContext);
    if (!context) {
      throw new Error("useRecipe must be used within a RecipeProvider");
    }
    return context;
  }