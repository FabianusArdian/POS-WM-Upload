import { OrderItem } from "@/lib/types";
export const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  
    export function calculateSubtotal(items: OrderItem[]): number {
      return items.reduce((sum, item) => {
        const price = item.product?.price || 0;
        const discount = item.product?.discount ?? 0; // Gunakan 0 jika undefined
        const discountedPrice = price * (1 - discount / 100);

        return sum + discountedPrice * item.quantity;
      }, 0);
    }

  
    export function calculateDiscount(
      type: "percentage" | "nominal",
      value: string,
      subtotal: number
    ): number {
      const numericValue = parseFloat(value);
      if (!value || isNaN(numericValue)) return 0;
    
      return type === "percentage"
        ? subtotal * (numericValue / 100)
        : numericValue;
    }
  
  export function calculateTax(amount: number): number {
    return amount * 0.1; // 10% PPN
  }
  