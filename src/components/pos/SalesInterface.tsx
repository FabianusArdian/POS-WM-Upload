"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, List } from "lucide-react";
import OrderSummary from "./OrderSummary/OrderSummary";
import { productsAPI, ordersAPI } from "@/lib/api";
import { ClipLoader } from 'react-spinners';
import { Suspense } from 'react';
import { submitOrder } from "@/lib/helpers/order";
import { getCurrentUserId } from "@/lib/utils";

// Import components
import ProductGrid from "./ProductGrid";
import NoteDialog from "./NoteDialog";
import HeldOrdersDialog from "./HeldOrdersDialog";

// Import types and utilities
import { Product, OrderItem, HeldOrder, CustomerType, DiscountType } from "@/lib/types";
import { calculateSubtotal, filterProducts, getUniqueCategories } from "@/lib/utils";;

interface SalesInterfaceProps {
  userId: number | null;
}
export default function SalesInterface({ userId }: SalesInterfaceProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // State for note dialog
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteDialogProduct, setNoteDialogProduct] = useState<Product | null>(null);
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

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris" | "transfer">("cash");

  // State for held orders
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [isHeldOrdersDialogOpen, setIsHeldOrdersDialogOpen] = useState(false);

  // State for current order
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on active category and search query
  const filteredProducts = filterProducts(products, activeCategory, searchQuery);

  // Calculate order total
  const orderTotal = currentOrder.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  const [orderLocked, setOrderLocked] = useState(false);

  const handleNewOrder = () => {
    setCurrentOrder([]);
    setDiscountType("percentage");
    setDiscountValue("");
    setCustomerType("walk-in");
    setPaymentMethod("cash");
    setOrderLocked(false);
  };

  const [recalledOrderId, setRecalledOrderId] = useState<string | null>(null);


  const fetchHeldOrdersFromBackend = async () => {
    try {
      const res = await ordersAPI.getHeldOrders();
      const mapped = res.data.map((order) => ({
        id: String(order.id),
        timestamp: new Date(order.created_at).toLocaleTimeString(),
        total: order.total_amount,
        customerType: order.order_type,
        items: order.items.map((item: any) => ({
          product: {
            id: item.product_id,
            name: item.product_name || "Product",
            price: item.price,
            category: "",
            unit: "",
            isPackage: false,
          },
          quantity: item.quantity,
          subtotal: item.quantity * item.price,
          note: item.note || "",
        })),
        discountInfo: undefined,
      }));
      setHeldOrders(mapped);
    } catch (err) {
      console.error("Gagal fetch held order dari server", err);
    }
  };
  
  useEffect(() => {
    fetchHeldOrdersFromBackend();
  }, []);

  // Process current order and move it to held orders
  const processOrder = async () => {
    if (currentOrder.length === 0) return;
  
    const total = currentOrder.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    const userId = getCurrentUserId();
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      await ordersAPI.create({
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
      
      const newHeldOrder: HeldOrder = {
        id: `order-${Date.now()}`,
        items: [...currentOrder],
        timestamp: new Date().toLocaleTimeString(),
        total,
        customerType,
        discountInfo: discountValue
          ? { type: discountType, value: discountValue }
          : undefined,
      };
  
      setHeldOrders((prev) => [...prev, newHeldOrder]);
  
      // Reset UI state
      setCurrentOrder([]);
      setDiscountValue("");
    } catch (err: any) {
      alert("Failed to process order: " + err.message);
    }
  };

  // Recall a held order
  const recallHeldOrder = (orderId: string) => {
  const orderToRecall = heldOrders.find((order) => order.id === orderId);
  if (!orderToRecall) return;

  setCurrentOrder(orderToRecall.items);
  setCustomerType(orderToRecall.customerType);
  setDiscountType(orderToRecall.discountInfo?.type || "percentage");
  setDiscountValue(orderToRecall.discountInfo?.value || "");
  setPaymentMethod("cash"); // default
  setOrderLocked(false);
  setIsHeldOrdersDialogOpen(false);
  setRecalledOrderId(orderId);
};
  

  // Delete a held order
  const deleteHeldOrder = (orderId: string) => {
    setHeldOrders(heldOrders.filter((order) => order.id !== orderId));
  };

  // Handle order checkout
  const handleCheckout = async () => {
    if (currentOrder.length === 0) return;
  
    const total = currentOrder.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
  
    try {
      await submitOrder({
        items: currentOrder,
        customerType,
        paymentMethod: "paymentMethod", // atau sesuaikan dari state
        status: "paid",
        action: "pay",
        totalAmount: total,
      });
  
      alert("Order processed successfully!");

      if (recalledOrderId) {
        setHeldOrders((prev) =>
          prev.filter((order) => order.id !== recalledOrderId)
        );
        setRecalledOrderId(null);
      }

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
        <div className="flex-1 overflow-auto p-4">
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
        <div className="w-full md:w-[350px] border-t md:border-t-0 md:border-l bg-card">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Current Order</h2>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={processOrder}
                disabled={currentOrder.length === 0}
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
                <List className="h-4 w-4" /> Orders ({heldOrders.length})
              </Button>
            </div>
          </div>
          <div className="p-4 border-b">
            {/* Customer type and discount selection moved to payment section */}
          </div>
          <OrderSummary
            items={currentOrder.map((item) => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              note: item.note,
            }))}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={(id, newQuantity) => {
              if (newQuantity <= 0) {
                // Remove item if quantity becomes 0
                const updatedOrder = currentOrder.filter(
                  (item) => item.product.id !== id
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
                          item.discount || 0
                        ),
                      }
                    : item
                );
                setCurrentOrder(updatedOrder);
              }
            }}
            onCheckout={handleCheckout}
            onCancelOrder={() => setCurrentOrder([])}
            customerType={customerType}
            setCustomerType={setCustomerType}
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
        />
      </div>
    </Suspense>
  );
}