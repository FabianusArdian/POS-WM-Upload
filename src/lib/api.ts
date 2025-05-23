/**
 * API client for interacting with the backend
 */

import { UserData } from "@/models/UserData";
import { RecipeData } from "@/models/RecipeData";
import { InventoryItem, InventoryItemCreate } from "@/models/InventoryItems";
import { getTokenFromCookies } from "./utils";
import { Product, ProductCreate } from "@/models/ProductData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URLL || "https://api-pwk.ahmadcloud.my.id";

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = Array.isArray(errorData.detail) ? errorData.detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ") : errorData.detail || JSON.stringify(errorData);
    } catch (e) {
      errorMessage = `API error: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const recipeAPI = {
  getAll: () => {
    const token = getTokenFromCookies();
    return fetchAPI<RecipeData[]>("/recipes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  createRecipe: (recipe: RecipeData) => {
    const token = getTokenFromCookies();
    return fetchAPI<RecipeData>("/recipes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipe),
    });
  },
  updateRecipe: (product_id: number, recipe: Partial<RecipeData>) => {
    const token = getTokenFromCookies();
    return fetchAPI<RecipeData>(`/recipes/${product_id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipe),
    });
  },
  deleteRecipe: (recipe_id: number) => {
    const token = getTokenFromCookies();
    return fetchAPI<void>(`/recipes/${recipe_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const usersAPI = {
  getAll: () => {
    const token = getTokenFromCookies();
    return fetchAPI<UserData[]>(`/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateUser: (id: number, user: Partial<UserData>) => {
    const token = getTokenFromCookies();
    return fetchAPI<UserData>(`/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
  },
  createUser: (user: UserData) => {
    return fetchAPI<UserData>("/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },
  deleteUser: (id: number) => {
    const token = getTokenFromCookies();
    return fetchAPI<void>(`/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Auth API (changed to use username instead of email)
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid username or password");
    }

    const data = await response.json();

    // Ensure the access_token is returned in the response
    if (!data.access_token) {
      throw new Error("No access token returned from server");
    }

    return data; // Return the full data, which contains access_token
  },
};

export const productsAPI = {
  getAll: (category?: string) => {
    const token = getTokenFromCookies();
    const query = category ? `?category=${category}` : "";

    return fetchAPI<Product[]>(`/products${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getById: (id: number) => {
    const token = getTokenFromCookies();
    return fetchAPI<Product>(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  create: (product: ProductCreate) => {
    const token = getTokenFromCookies();
    return fetchAPI<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Make sure to set the content type for POST requests
      },
    });
  },

  update: (id: number, product: Partial<ProductCreate>) => {
    const token = getTokenFromCookies();
    return fetchAPI<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Make sure to set the content type for PUT requests
      },
    });
  },

  delete: (id: number) => {
    const token = getTokenFromCookies();
    return fetchAPI<void>(`/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// cash balance API
type CashBalanceQueryParams = {
  start_date?: string;
  end_date?: string;
  transaction_type?: "sale" | "other";
};
type QueryParams = {
  start_date?: string;
  end_date?: string;
};
import { CashBalance, expense, income, incomeItem, expenseItem } from "@/models/CashBalances";
export const cashBalanceAPI = {
  getAll: (params: CashBalanceQueryParams) => {
    const { start_date, end_date, transaction_type } = params || {};
    const token = getTokenFromCookies();

    const query = new URLSearchParams();
    if (start_date) query.append("start_date", start_date);
    if (end_date) query.append("end_date", String(end_date));
    if (transaction_type) query.append("transaction_type", String(transaction_type));

    return fetchAPI<CashBalance>(`/cashflow/incomes?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getAllExpenses: (params: QueryParams) => {
    const { start_date, end_date } = params || {};
    const token = getTokenFromCookies();

    const query = new URLSearchParams();
    if (start_date) query.append("start_date", start_date);
    if (end_date) query.append("end_date", String(end_date));

    return fetchAPI<expense>(`/expenses?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getAllIncomes: (params: QueryParams) => {
    const { start_date, end_date } = params || {};
    const token = getTokenFromCookies();

    const query = new URLSearchParams();
    if (start_date) query.append("start_date", start_date);
    if (end_date) query.append("end_date", String(end_date));

    return fetchAPI<income>(`/incomes?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  createIncome: (payload: incomeItem) => {
    const token = getTokenFromCookies();
    return fetchAPI<incomeItem>("/incomes", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Make sure to set the content type for POST requests
      },
    });
  },
  createExpense: (payload: expenseItem) => {
    const token = getTokenFromCookies();
    return fetchAPI<expenseItem>("/expenses", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Make sure to set the content type for POST requests
      },
    });
  },
};

// Orders API
export const ordersAPI = {
  getAll: (status?: string) => {
    const token = getTokenFromCookies();
    const query = status ? `?status=${status}` : "";
    return fetchAPI<{ data: Order[] }>(`/orders${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getAllPaginated: ({ payment_status, limit = 10000, offset = 0 }: { payment_status?: string; limit?: number; offset?: number }) => {
    const token = getTokenFromCookies();
    let queryParams = [`limit=${limit}`, `offset=${offset}`];
    if (payment_status) {
      queryParams.push(`payment_status=${payment_status}`);
    }
    const query = `?${queryParams.join("&")}`;
    return fetchAPI<{ data: Order[] }>(`/orders${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getById: (id: string) => {
    const token = getTokenFromCookies();
    return fetchAPI(`/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getHeldOrders: () => {
    const token = getTokenFromCookies();
    return fetchAPI<{ data: any[] }>("/orders?status=unpaid", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  create: (payload: any) => {
    const token = getTokenFromCookies();
    return fetchAPI("/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  cancelOrder: (id: string | number) => {
    const token = getTokenFromCookies();
    return fetchAPI(`/orders/${id}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getFavorites: (params?: { category?: string; start_date?: string; end_date?: string }) => {
    const token = getTokenFromCookies();
    const queryParams = [];

    if (params?.category) queryParams.push(`category=${params.category}`);
    if (params?.start_date) queryParams.push(`start_date=${params.start_date}`);
    if (params?.end_date) queryParams.push(`end_date=${params.end_date}`);

    const query = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    return fetchAPI<any>(`/orders/favorites${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getSalesRangeReport: (params?: { start_date?: string; end_date?: string }) => {
    const token = getTokenFromCookies();

    const query = new URLSearchParams();
    if (params?.start_date) query.append("start_date", params.start_date);
    if (params?.end_date) query.append("end_date", params.end_date);

    const url = `/orders/report/sales-range?${query.toString()}`;

    return fetchAPI<SalesRangeResponse>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: (params?: { category?: string; lowStock?: boolean }) => {
    const token = getTokenFromCookies();
    const queryParams = [];
    if (params?.category) queryParams.push(`category=${params.category}`);
    if (params?.lowStock) queryParams.push("low_stock=true");

    const query = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    return fetchAPI<InventoryItem[]>(`/inventory${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  },

  getById: (id: number) => {
    const token = getTokenFromCookies();
    return fetchAPI<InventoryItem>(`/inventory/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  create: (item: InventoryItemCreate) => {
    const token = getTokenFromCookies();
    return fetchAPI<InventoryItem>("/inventory", {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  },

  update: (id: number, item: Partial<InventoryItemCreate>) => {
    const token = getTokenFromCookies();
    return fetchAPI<InventoryItem>(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Make sure to set the content type for PUT requests
      },
    });
  },

  delete: (id: number) => {
    const token = getTokenFromCookies();
    return fetchAPI<void>(`/inventory/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Type definitions
// export interface Product {
//   id: number;
//   name: string;
//   price: number;
//   category: string;
//   unit: string;
//   is_package: boolean;
//   image?: string;
// }

// export type ProductCreate = Omit<Product, "id">;

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderItemCreate {
  product_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  order_number: string;
  timestamp: string;
  order_type: string;
  total_amount: number;
  payment_status: string;
  paid_at: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface RangeData {
  range: string;
  items_sold: number;
  percentage: number;
  products: Product[];
}

export interface SalesRangeResponse {
  best_range: string;
  total_sold: number;
  ranges: RangeData[];
}

import { TimeBasedReport } from "./types";
export async function fetchTimeBasedReport(startDate: string, endDate: string): Promise<TimeBasedReport> {
  const res = await fetch(`https://api-pwk.ahmadcloud.my.id/orders/reports/time-based?start_date=${startDate}&end_date=${endDate}`);

  if (!res.ok) {
    throw new Error("Failed to fetch time-based report");
  }

  return res.json();
}
