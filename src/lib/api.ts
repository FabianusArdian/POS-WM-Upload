/**
 * API client for interacting with the backend
 */

import { UserData } from "@/models/UserData";
import { RecipeData } from "@/models/RecipeData";
import { getTokenFromCookies } from "./utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URLL || "https://api-pwk.ahmadcloud.my.id";

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
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
      errorMessage = Array.isArray(errorData.detail)
        ? errorData.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ')
        : errorData.detail || JSON.stringify(errorData);
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
  deleteRecipe: (recipt_id: number) => {
    const token = getTokenFromCookies();
    return fetchAPI<void>(`/recipes/${recipt_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

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
  }
};


// Auth API (changed to use username instead of email)
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

  getAllPaginated: ({
    payment_status = "paid",
    limit = 20,
    offset = 0,
  }: {
    payment_status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const token = getTokenFromCookies();
    const query = `?payment_status=${payment_status}&limit=${limit}&offset=${offset}`;
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
  }
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
