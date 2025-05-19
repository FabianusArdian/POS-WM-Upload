"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { productsAPI } from "@/lib/api"
import type { ProductCreate } from "@/models/ProductData"
import AdminSidebar from "@/components/layout/AdminSidebar"

// Import refactored components
import ProductsHeader from "@/components/pos/Products/ProductsHeader"
import ProductsTable from "@/components/pos/Products/ProductsTable"
import AddProductDialog from "@/components/pos/Products/AddProductDialog"
import EditProductDialog from "@/components/pos/Products/EditProductDialog"
import DeleteProductDialog from "@/components/pos/Products/DeleteProductDialog"

interface Product {
  id: number
  name: string
  price: number
  category: string
  unit: string
  is_package: boolean
  image?: string
}

interface ProductUpdate {
  name: string
  price: number
  category: string
  unit: string
  image?: string
  isPackage: boolean
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({})

  const categories = products
    .map((product) => product.category)
    .filter((category, index, self) => self.indexOf(category) === index)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const apiProducts = await productsAPI.getAll()

        const mappedProducts = apiProducts.map((p) => ({
          ...p,
          isPackage: p.is_package, // convert snake_case to camelCase
        }))
        setProducts(mappedProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Add Product
  const handleAddProduct = async () => {
    try {
      const productToAdd = {
        ...newProduct,
      } as ProductCreate

      // Send the new product to the backend
      const addedProduct = await productsAPI.create(productToAdd)

      // Update the local state with the newly added product
      setProducts([...products, addedProduct])

      // Reset the form fields
      setNewProduct({
        name: "",
        price: 0,
        category: "Food",
        unit: "",
        is_package: false,
        image: "",
      })

      // Close the dialog
      setIsAddDialogOpen(false)

      // Show success message
      alert("Product added successfully!")
    } catch (error) {
      console.error("Failed to add product:", error)
      alert("Failed to add product.")
    }
  }

  // Edit Product
  const handleEditProduct = async (id: number, data: ProductUpdate) => {
    try {
      // Call the API to update the product
      const updatedProduct = await productsAPI.update(id, data)

      // Update the local state with the updated product
      setProducts((prevState) => prevState.map((product) => (product.id === id ? updatedProduct : product)))

      // Show success message
      alert("Product updated successfully!")

      // Close the dialog
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Failed to update product:", error)
      alert("Failed to update product.")
    }
  }

  const productToProductUpdate = (product: Product): ProductUpdate => ({
    name: product.name,
    price: product.price,
    category: product.category,
    unit: product.unit,
    image: product.image,
    isPackage: product.is_package,
  })

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!currentProduct) return

    try {
      // Call the API to delete the product
      await productsAPI.delete(currentProduct.id)

      // Remove the product from the local state
      const filteredProducts = products.filter((p) => p.id !== currentProduct.id)
      setProducts(filteredProducts)

      // Close the delete dialog and reset the current product
      setIsDeleteDialogOpen(false)
      setCurrentProduct(null)

      // Show success message
      alert("Product deleted successfully!")
    } catch (error) {
      console.error("Failed to delete product:", error)
      alert("Failed to delete product.")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const handleSaveChanges = () => {
    if (currentProduct) {
      handleEditProduct(currentProduct.id, productToProductUpdate(currentProduct))
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ProductsHeader onAddProduct={() => setIsAddDialogOpen(true)} />

        <main className="flex-1 overflow-auto p-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductsTable
                products={products}
                onEditProduct={(product) => {
                  setCurrentProduct(product)
                  setIsEditDialogOpen(true)
                }}
                onDeleteProduct={(product) => {
                  setCurrentProduct(product)
                  setIsDeleteDialogOpen(true)
                }}
                formatCurrency={formatCurrency}
              />
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Dialogs */}
      <AddProductDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddProduct={handleAddProduct}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        categories={categories}
      />

      <EditProductDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        onSaveChanges={handleSaveChanges}
        categories={categories}
      />

      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        currentProduct={currentProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  )
}
