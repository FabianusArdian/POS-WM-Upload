export interface InventoryItem {
    id: number;
    name: string;
    current_stock: number;
    unit: string;
    min_threshold: number;
    last_updated: string;
    category: string;
  }
  
  export type InventoryItemCreate = Omit<InventoryItem, "id" | "last_updated">;