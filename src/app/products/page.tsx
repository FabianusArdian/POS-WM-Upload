"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import { productsAPI, ProductCreate } from "@/lib/api";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  unit: string;
  is_package: boolean;
  image?: string;
}

interface ProductUpdate {
  name: string;
  price: number;
  category: string;
  unit: string;
  image?: string;
  isPackage: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const categories = products.map((product) => product.category);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
  
        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }
  
        // Call the API with the token in the Authorization header
        const apiProducts = await productsAPI.getAll();
  
        const mappedProducts = apiProducts.map((p) => ({
          ...p,
          isPackage: p.is_package, // convert snake_case to camelCase
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadProducts();
  }, []);

  
  // Add Product
  const handleAddProduct = async () => {
    try {
      const productToAdd = {
        ...newProduct,
      } as ProductCreate;
  
      // Send the new product to the backend
      const addedProduct = await productsAPI.create(productToAdd);
      
      // Update the local state with the newly added product
      setProducts([...products, addedProduct]);
  
      // Reset the form fields
      setNewProduct({
        name: "",
        price: 0,
        category: "Food",
        unit: "",
        is_package: false,
        image: "",
      });
  
      // Close the dialog
      setIsAddDialogOpen(false);
  
      // Show success message
      alert("Product added successfully!");
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product.");
    }
  };
  

// Edit Product
const handleEditProduct = async (id: number, data: ProductUpdate) => {
  try {
    // Call the API to update the product
    const updatedProduct = await productsAPI.update(id, data);

    // Update the local state with the updated product
    setProducts((prevState) => 
      prevState.map((product) => 
        product.id === id ? updatedProduct : product
      )
    );

    // Show success message
    alert("Product updated successfully!");
  } catch (error) {
    console.error("Failed to update product:", error);
    alert("Failed to update product.");
  }
};

const productToProductUpdate = (product: Product): ProductUpdate => ({
  name: product.name,
  price: product.price,
  category: product.category,
  unit: product.unit,
  image: product.image,
  isPackage: product.is_package,
});

// Delete Product
const handleDeleteProduct = async () => {
  if (!currentProduct) return;

  try {
    // Call the API to delete the product
    await productsAPI.delete(currentProduct.id);

    // Remove the product from the local state
    const filteredProducts = products.filter((p) => p.id !== currentProduct.id);
    setProducts(filteredProducts);

    // Close the delete dialog and reset the current product
    setIsDeleteDialogOpen(false);
    setCurrentProduct(null);

    // Show success message
    alert("Product deleted successfully!");
  } catch (error) {
    console.error("Failed to delete product:", error);
    alert("Failed to delete product.");
  }
};


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Toaster />
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Product Management</h1>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted"></div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>
                    {product.is_package ? (
                      <Badge variant="secondary">Package</Badge>
                    ) : (
                      <Badge variant="outline">Single</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentProduct(product);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => {
                          setCurrentProduct(product);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter price"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={newProduct.unit}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, unit: e.target.value })
                  }
                  placeholder="e.g., box, piece, kg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="isPackage">Product Type</Label>
                <Select
                  value={newProduct.is_package ? "package" : "single"}
                  onValueChange={(value) =>
                    setNewProduct({
                      ...newProduct,
                      is_package: value === "package",
                    })
                  }
                >
                  <SelectTrigger id="isPackage">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Item</SelectItem>
                    <SelectItem value="package">Package</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newProduct?.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  placeholder="Enter image URL"
                />
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {currentProduct && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={currentProduct.name}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={currentProduct.price}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={currentProduct.category}
                    onValueChange={(value) =>
                      setCurrentProduct({ ...currentProduct, category: value })
                    }
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-unit">Unit</Label>
                  <Input
                    id="edit-unit"
                    value={currentProduct.unit}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        unit: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-isPackage">Product Type</Label>
                  <Select
                    value={currentProduct.is_package ? "package" : "single"}
                    onValueChange={(value) =>
                      setCurrentProduct({
                        ...currentProduct,
                        is_package: value === "package",
                      })
                    }
                  >
                    <SelectTrigger id="edit-isPackage">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Item</SelectItem>
                      <SelectItem value="package">Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input
                    id="edit-image"
                    value={currentProduct.image || ""}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        image: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => currentProduct && handleEditProduct(currentProduct.id, productToProductUpdate(currentProduct))}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {currentProduct?.name || "this product"}
              </span>
              ? This action cannot be undone.
            </p>
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}