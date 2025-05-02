export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    unit: string;
    is_package: boolean;
    image?: string;
  }
  
  export type ProductCreate = Omit<Product, "id">;