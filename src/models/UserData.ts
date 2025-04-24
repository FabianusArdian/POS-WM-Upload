export interface UserData {
    id: number;
    username: string;
    email: string;
    password?: string;
    role: "admin" | "cashier";
    last_login?: string;
  }
  

export interface StoreSettings {
    name: string;
    address: string;
    phone: string;
    taxRate: number;
    currency: string;
    logo?: string;
  }
