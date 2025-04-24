export const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  
  export const calculateSubtotal = (items: { price: number; quantity: number }[]) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  export const calculateDiscount = (
    type: "percentage" | "nominal",
    value: string,
    subtotal: number
  ) => {
    if (!value) return 0;
    const parsed = parseFloat(value);
    return type === "percentage"
      ? Math.round(subtotal * (parsed / 100))
      : parsed;
  };
  
  export const calculateTax = (amount: number) => Math.round(amount * 0.1);
  