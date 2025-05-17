"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, List } from "lucide-react";
import OrderSummary from "./OrderSummary/OrderSummary";
import { productsAPI, ordersAPI } from "@/lib/api";
import { ClipLoader } from "react-spinners";
import { Suspense } from "react";
import { submitOrder } from "@/lib/helpers/order";
import { getCurrentUserId } from "@/lib/utils";

// Import components
import ProductGrid from "./ProductGrid";
import NoteDialog from "./NoteDialog";
import HeldOrdersDialog from "./HeldOrdersDialog";

// Import types and utilities
import {
  Product,
  OrderItem,
  HeldOrder,
  CustomerType,
  DiscountType,
} from "@/lib/types";
import {
  calculateSubtotal,
  filterProducts,
  getUniqueCategories,
} from "@/lib/utils";

interface SalesInterfaceProps {
  userId: number | null;
}
export default function SalesInterface({ userId }: SalesInterfaceProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // State for note dialog
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteDialogProduct, setNoteDialogProduct] = useState<Product | null>(
    null,
  );
  const [noteText, setNoteText] = useState("");
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);

  // State for customer type
  const [customerType, setCustomerType] = useState<CustomerType>("pilih");

  // State for discount type and value
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [discountValue, setDiscountValue] = useState<string>("");

  // Function to update discount type
  const handleUpdateDiscountType = (type: DiscountType) => {
    setDiscountType(type);
  };

  // Function to update discount value
  const handleUpdateDiscountValue = (value: string) => {
    setDiscountValue(value);
  };

  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "qris" | "transfer"
  >("cash");

  // State for held orders
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [isHeldOrdersDialogOpen, setIsHeldOrdersDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // State for current order
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [recalledOrderId, setRecalledOrderId] = useState<string | null>(
  typeof window !== "undefined" ? localStorage.getItem("recalledOrderId") : null
  );

  // Filter products based on active category and search query
  const filteredProducts = filterProducts(
    products,
    activeCategory,
    searchQuery,
  );

  // Calculate order total
  const orderTotal = currentOrder.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  const [orderLocked, setOrderLocked] = useState(false);

  const [heldOrdersCount, setHeldOrdersCount] = useState(0)

  const handleNewOrder = async () => {
    setCurrentOrder([]);
    setDiscountType("percentage");
    setDiscountValue("");
    setCustomerType("pilih");
    setPaymentMethod("cash");
    setOrderLocked(false);

    // ✅ Reset recalled order state
    if (recalledOrderId) {
      setRecalledOrderId(null);
      localStorage.removeItem("recalledOrderId");
      localStorage.removeItem("recalledOrderItems");
    }

    // ✅ Refresh list held orders (jumlah dan isi)
    await fetchHeldOrdersFromBackend(currentPage);
  };
    
  const mapOrderTypeToCustomerType = (
  type: string
  ): Exclude<CustomerType, "pilih"> => {
    const lower = type.toLowerCase();
    const validTypes = ["dine-in", "gojek", "grab", "shopee"] as const;

    return validTypes.includes(lower as typeof validTypes[number])
      ? (lower as Exclude<CustomerType, "pilih">)
      : "dine-in"; // fallback
  };

  
  const fetchHeldOrdersFromBackend = async (page = 1) => {
  try {
    const res = await ordersAPI.getAllPaginated({
      payment_status: "unpaid",
    });

    const localOrders = JSON.parse(localStorage.getItem("heldOrders") || "[]");
    const localOnlyOrders = localOrders.filter((o: HeldOrder) =>
      isNaN(Number(o.id))
    );

    const backendOrders = await Promise.all(
      res.data.map(async (order: any) => {
        let items: HeldOrder["items"] = [];

        try {
          const detail = await ordersAPI.getById(order.id) as { items: any[] };
          items = Array.isArray(detail.items)
          ? detail.items.map((item: any) => ({
              id: item.id,
              product_id: item.product_id,
              product_name: item.product_name,
              price: item.price,
              quantity: item.quantity,
              note: item.note,
              product: {
                id: item.product_id,
                name: item.product_name || "Product",
                price: item.price,
                category: "",
                unit: "",
                isPackage: false,
              },
              subtotal: item.quantity * item.price,
            }))
          : [];
        } catch (err) {
          console.error("Failed to fetch detail for order", order.id, err);
        }

        return {
          id: String(order.id),
          timestamp: new Date(order.created_at).toLocaleTimeString(),
          created_at: order.created_at,
          total: order.total_amount,
          customerType: mapOrderTypeToCustomerType(order.order_type),
          items,
          discountInfo: undefined,
        };
      })
    );

    const combinedOrders = [...localOnlyOrders, ...backendOrders];
    setHeldOrdersCount(combinedOrders.length);
    const totalPages = Math.ceil(combinedOrders.length / ITEMS_PER_PAGE);
    setTotalPages(totalPages);

    const start = (page - 1) * ITEMS_PER_PAGE;
    const paginated = combinedOrders.slice(start, start + ITEMS_PER_PAGE);
    setHeldOrders(paginated);

    localStorage.setItem("heldOrders", JSON.stringify(combinedOrders));
  } catch (err) {
    console.error("Gagal fetch held orders:", err);
    const fallback = localStorage.getItem("heldOrders");
    if (fallback) {
      try {
        const parsed = JSON.parse(fallback);
        const totalPages = Math.ceil(parsed.length / ITEMS_PER_PAGE);
        setTotalPages(totalPages);

        const start = (page - 1) * ITEMS_PER_PAGE;
        const paginated = parsed.slice(start, start + ITEMS_PER_PAGE);
        setHeldOrders(paginated);
      } catch (e) {
        console.error("Fallback parse error:", e);
      }
    }
  }
};
  
      // Load held orders from localStorage on component mount
  useEffect(() => {
    // Fetch held orders from backend first with the current page
    fetchHeldOrdersFromBackend(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (recalledOrderId) {
      const raw = localStorage.getItem("recalledOrderItems");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setCurrentOrder(parsed);
        } catch {
          console.warn("❌ Failed to parse recalledOrderItems");
        }
      }
    }
  }, []);

  // Save held orders to localStorage whenever they change
  useEffect(() => {
    if (heldOrders.length > 0) {
      localStorage.setItem("heldOrders", JSON.stringify(heldOrders));
    }
  }, [heldOrders]);

  // Process current order and move it to held orders
  const processOrder = async () => {
    if (currentOrder.length === 0) return;

    const total = currentOrder.reduce((sum, item) => sum + item.subtotal, 0);
    const userId = getCurrentUserId();
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      // Create order in backend
      const response = await ordersAPI.create({
        order: {
          order_type: customerType,
          payment_status: "unpaid",
          payment_method: "",
          total_amount: total,
          created_by: userId,
          items: currentOrder.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            note: item.note,
          })),
        },
      });

      alert("Order held successfully!");

      // Refresh held orders from backend to ensure we have the latest data
      await fetchHeldOrdersFromBackend(currentPage);

      // Reset UI state
      setCurrentOrder([]);
      setDiscountValue("");
    } catch (err: any) {
      alert("Failed to process order: " + err.message);
    }
  };

  // Recall a held order
  const recallHeldOrder = async (orderId: string) => {
    let orderToRecall = heldOrders.find((order) => order.id === orderId);

  const shouldFetch = !orderToRecall || orderToRecall.items.length === 0;

    if (shouldFetch && !isNaN(Number(orderId))) {
      try {
        const fetchedOrder = await ordersAPI.getById(orderId) as {
          id: number;
          order_type: string;
          created_at: string;
          total_amount: number;
          items: {
            id: number;
            product_id: number;
            product_name: string;
            price: number;
            quantity: number;
            note: string;
          }[];
        };

    const mappedItems: OrderItem[] = Array.isArray(fetchedOrder.items)
    ? fetchedOrder.items.map((item: any) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;

      return {
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        price: price,
        quantity: quantity,
        subtotal: quantity * price,
        note: item.note || "",
        product: {
          id: item.product_id,
          name: item.product_name || "Product",
          price: price,
          category: "",
          unit: "",
          isPackage: false,
        },
      };
    })
  : [];


    orderToRecall = {
      id: String(fetchedOrder.id),
      timestamp: new Date(fetchedOrder.created_at).toLocaleTimeString(),
      created_at: fetchedOrder.created_at,
      total: fetchedOrder.total_amount,
      customerType: mapOrderTypeToCustomerType(fetchedOrder.order_type),
      items: mappedItems,
      discountInfo: undefined,
    };
  } catch (err) {
    console.error("Failed to fetch order from backend", err);
    alert("Failed to fetch order from backend.");
    return;
  }
}
  
    // Periksa kembali setelah mapping
    if (!orderToRecall || !Array.isArray(orderToRecall.items) || orderToRecall.items.length === 0) {
      alert("Order has no items");
      return;
    }
  
    // Set ulang UI dan state
    setCurrentOrder(orderToRecall.items);
    localStorage.setItem("recalledOrderItems", JSON.stringify(orderToRecall.items));
    setCustomerType(orderToRecall.customerType);
    setDiscountType(orderToRecall.discountInfo?.type || "percentage");
    setDiscountValue(orderToRecall.discountInfo?.value || "");
    setOrderLocked(false);
    setIsHeldOrdersDialogOpen(false);
    setRecalledOrderId(orderId);
    localStorage.setItem("recalledOrderId", orderId);
  };

  // Delete a held order
  const deleteHeldOrder = async (id: string) => {
    try {
      await ordersAPI.cancelOrder(id);
  
      const existing = JSON.parse(localStorage.getItem("heldOrders") || "[]");
      const updated = existing.filter((o: HeldOrder) => o.id !== id);
      localStorage.setItem("heldOrders", JSON.stringify(updated));
  
      await fetchHeldOrdersFromBackend(currentPage);
    } catch (err) {
      console.error("Failed to delete held order", err);
      alert("Failed to delete order. Please try again.");
    }
  };
  
    // Handle order checkout

  const handleCheckout = async () => {
      const finalPaymentMethod: "cash" | "qris" | "transfer" =
      paymentMethod && ["cash", "qris", "transfer"].includes(paymentMethod)
        ? paymentMethod
        : "cash";
    if (currentOrder.length === 0) return;

    const total = currentOrder.reduce((sum, item) => sum + item.subtotal, 0);

    try {
      if (recalledOrderId) {
        await submitOrder({
          orderId: Number(recalledOrderId),
          action: "pay",
          order: {
            order_type: customerType.toUpperCase(),
            payment_status: "unpaid",
            payment_method: finalPaymentMethod,
            total_amount: total,
            items: currentOrder.map((item) => ({
              product_id: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
              note: item.note || "",
            })),
          },
        });
      } else {
        await submitOrder({
          items: currentOrder.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            note: item.note || "",
          })),
          customerType,
          paymentMethod: finalPaymentMethod || "cash",
          status: "paid",
          totalAmount: total,
        });
      }

      alert("Order processed successfully!");

      if (recalledOrderId) {
        // If this was a recalled order, remove it from held orders
        if (!isNaN(Number(recalledOrderId))) {
          // If it's a backend order (has numeric ID), delete it from backend
          try {
          } catch (deleteErr) {
            console.error(
              "Failed to delete recalled order from backend",
              deleteErr,
            );
          }
        }

        // Remove from local state
        setHeldOrders((prev) =>
          prev.filter((order) => order.id !== recalledOrderId),
        );

        // Clear recalled order ID from state and localStorage
        setRecalledOrderId(null);
        localStorage.removeItem("recalledOrderId");
      }

      // Refresh held orders from backend
      await fetchHeldOrdersFromBackend();
      setOrderLocked(true);
    } catch (err: any) {
      alert("Checkout failed: " + err.message);
    }
  };

  // Handle removing an item from the order
  const handleRemoveItem = (id: number) => {
    setCurrentOrder(currentOrder.filter((item) => item.product.id !== id));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productsAPI.getAll();
        const transformed = productsData.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          unit: product.unit,
          isPackage: product.is_package,
          image: product.image,
        }));
        setProducts(transformed);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <ClipLoader />;
  }

  // Get categories from products
  const categories = getUniqueCategories(products);
  const categoryOptions = ["All", ...categories];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col md:flex-row h-full bg-background">
        {/* Main content area */}
        <div className="flex-1 overflow-auto sm:p-0 lg:p-4">
          <div className="mb-6">
            <p className="text-muted-foreground">View and manage orders</p>
          </div>

          {/* Search and filter */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories tabs */}
          <Tabs defaultValue="All" className="mb-6">
            <TabsList className="mb-4 flex flex-wrap">
              {categoryOptions.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Product grid component */}
            <ProductGrid
              products={filteredProducts}
              activeCategory={activeCategory}
              currentOrder={currentOrder}
              calculateSubtotal={calculateSubtotal}
              setCurrentOrder={setCurrentOrder}
              setNoteDialogProduct={setNoteDialogProduct}
              setNoteText={setNoteText}
              setCurrentItemId={setCurrentItemId}
              setIsNoteDialogOpen={setIsNoteDialogOpen}
              orderLocked={orderLocked}
            />
          </Tabs>
        </div>

        {/* Order summary sidebar */}
        <div className="w-full sm:w-[200px] md:w-[300px] lg:w-[300px] border-t md:border-t-0 md:border-l bg-card">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold sm:text-sm md:text-md">
              Current Order
            </h2>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={processOrder}
                disabled={currentOrder.length === 0 || !!recalledOrderId}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Process Order
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsHeldOrdersDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <List className="h-4 w-4" />
                Orders ({heldOrdersCount})
              </Button>
            </div>
          </div>
          <div className="p-4 border-b">
            {/* Customer type and discount selection moved to payment section */}
          </div>
          <OrderSummary
            items={currentOrder}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={(id, newQuantity) => {
              if (newQuantity <= 0) {
                // Remove item if quantity becomes 0
                const updatedOrder = currentOrder.filter(
                  (item) => item.product.id !== id,
                );
                setCurrentOrder(updatedOrder);
              } else {
                // Update quantity
                const updatedOrder = currentOrder.map((item) =>
                  item.product.id === id
                    ? {
                        ...item,
                        quantity: newQuantity,
                        subtotal: calculateSubtotal(
                          item.product.price,
                          newQuantity,
                          0,
                        ),
                      }
                    : item,
                );
                setCurrentOrder(updatedOrder);
              }
            }}
            onCheckout={handleCheckout}
            onCancelOrder={() => {
              setCurrentOrder([]);
              setDiscountType("percentage");
              setDiscountValue("");
              setCustomerType("pilih");
              setPaymentMethod("cash");
              setOrderLocked(false);

              if (recalledOrderId) {
                setRecalledOrderId(null);
                localStorage.removeItem("recalledOrderId");
                localStorage.removeItem("recalledOrderItems");
              }
            }}
            customerType={customerType}
            setCustomerType={(val: string) =>
              setCustomerType(val as CustomerType)
            }
            discountInfo={
              discountValue
                ? { type: discountType, value: discountValue }
                : undefined
            }
            onUpdateDiscountType={handleUpdateDiscountType}
            onUpdateDiscountValue={handleUpdateDiscountValue}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onNewOrder={handleNewOrder}
            setOrderLocked={setOrderLocked}
            recalledOrderId={recalledOrderId}
            setRecalledOrderId={setRecalledOrderId}
          />
        </div>

        {/* Note Dialog Component */}
        <NoteDialog
          isOpen={isNoteDialogOpen}
          setIsOpen={setIsNoteDialogOpen}
          noteDialogProduct={noteDialogProduct}
          noteText={noteText}
          setNoteText={setNoteText}
          currentItemId={currentItemId}
          setNoteDialogProduct={setNoteDialogProduct}
          setCurrentItemId={setCurrentItemId}
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
        />

        {/* Held Orders Dialog Component */}
        <HeldOrdersDialog
          isOpen={isHeldOrdersDialogOpen}
          setIsOpen={setIsHeldOrdersDialogOpen}
          heldOrders={heldOrders}
          recallHeldOrder={recallHeldOrder}
          deleteHeldOrder={deleteHeldOrder}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </Suspense>
  );
}
