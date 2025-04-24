import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product, OrderItem, HeldOrder } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTokenFromCookies(): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
  return cookie ? cookie.split("=")[1] : null;
}

export function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return null;
  }
}
export function getCurrentUserId(): number | null {
  const token = getTokenFromCookies();
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload?.sub ? parseInt(payload.sub) : null;
}

export function getCurrentUser(): { name: string; role: string } | null {
  if (typeof window === "undefined") return null;
  const token = getTokenFromCookies();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      name: payload.username || "User",
      role: payload.role || "unknown",
    };
  } catch {
    return null;
  }
}

export function formatDate(utcDateString: string): string {
  const date = new Date(utcDateString);
  // Convert to WIB by adding 7 hours
  const wibDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const day = String(wibDate.getDate()).padStart(2, "0");
  const month = String(wibDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = wibDate.getFullYear();

  const hours = String(wibDate.getHours()).padStart(2, "0");
  const minutes = String(wibDate.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`; 
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

// Calculate subtotal with discount
export const calculateSubtotal = (
  price: number,
  quantity: number,
  discount: number
): number => {
  const subtotal = price * quantity;
  return discount > 0 ? subtotal * (1 - discount / 100) : subtotal;
};

// Get unique categories from products
export const getUniqueCategories = (products: Product[]): string[] => {
  return Array.from(new Set(products.map((product) => product.category)));
};

// Filter products by category and search query
export const filterProducts = (
  products: Product[],
  activeCategory: string,
  searchQuery: string
): Product[] => {
  return products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
};