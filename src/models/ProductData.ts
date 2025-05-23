export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  unit: string;
  is_package: boolean;
  image?: string;
  discount?: number;
  created_at: string;
  updated_at?: string;
}

export type ProductCreate = Omit<Product, "id">;
