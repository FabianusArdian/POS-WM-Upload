"use client";

import { inventoryAPI, InventoryItemCreate } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { Search, Plus, AlertTriangle, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface InventoryItem {
  id: number;
  name: string;
  current_stock: number;
  unit: string;
  min_threshold: number;
  last_updated: string;
  category: string;
}

interface InventoryItemUpdate {
  name: string;
  current_stock: number;
  unit: string;
  min_threshold: number;
  last_updated: string;
  category: string;
}

export default function InventoryManager() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [newInventory, setNewInventory] = useState<Partial<InventoryItem>>({});
  const categories = inventoryItems.map((inventory) => inventory.category).filter((category, index, self) => self.indexOf(category) === index);
  const units = inventoryItems.map((inventory) => inventory.unit).filter((unit, index, self) => self.indexOf(unit) === index);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }

        // Call the API with the token in the Authorization header
        const apiInventory = await inventoryAPI.getAll();

        const mappedProducts = apiInventory.map((p) => ({
          ...p, // convert snake_case to camelCase
        }));
        setInventoryItems(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInventory();
  }, []);

  // Filter inventory items based on search query
  // const filteredItems = inventoryItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredItems = inventoryItems.filter((item) => {
    if (!item || !item.name || !item.category) return false;

    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddItem = async () => {
    // In a real app, this would add the item to the database
    try {
      const inventoryToAdd = {
        ...newInventory,
      } as InventoryItemCreate;

      // Send the new product to the backend
      const addedInventoryItems = await inventoryAPI.create(inventoryToAdd);
      console.log(inventoryToAdd);

      // Update the local state with the newly added product
      setInventoryItems([...inventoryItems, addedInventoryItems]);

      // Reset the form fields
      setNewInventory({
        name: "",
        current_stock: 0,
        unit: "",
        min_threshold: 0,
        last_updated: "",
        category: "",
      });

      // Close the dialog
      setIsAddDialogOpen(false);

      // Show success message
      alert("inventory added successfully!");
    } catch (error) {
      console.error("Failed to add inventory:", error);
      alert("Failed to add inventory.");
    }

    const fetchInventoryItems = async () => {
      const items = await inventoryAPI.getAll();
      setInventoryItems(items);
    };
    fetchInventoryItems();
  };

  const handleEditItem = async (id: number, data: InventoryItemUpdate) => {
    try {
      // Call the API to update the product
      const updatedInventory = await inventoryAPI.update(id, data);

      // Update the local state with the updated product
      setInventoryItems((prevState) => prevState.map((inventory) => (inventory.id === id ? updatedInventory : inventory)));
      // Show success message
      setIsEditDialogOpen(false);
      alert("Inventory updated successfully!");
    } catch (error) {
      console.error("Failed to update inventory:", error);
      alert("Failed to update inventory.");
    }

    const fetchInventoryItems = async () => {
      const items = await inventoryAPI.getAll();
      setInventoryItems(items);
    };
    fetchInventoryItems();
  };

  const inventoryToInventoryUpdate = (inventory: InventoryItem): InventoryItemUpdate => ({
    name: inventory.name,
    current_stock: inventory.current_stock,
    unit: inventory.unit,
    min_threshold: inventory.min_threshold,
    last_updated: inventory.last_updated,
    category: inventory.category,
  });

  const handleDeleteItem = async (id: number) => {
    try {
      // Call the API to delete the product
      await inventoryAPI.delete(id);

      // Remove the product from the local state
      const filteredInvetory = inventoryItems.filter((p) => p.id !== id);
      setInventoryItems(filteredInvetory);

      // Close the delete dialog and reset the current product
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);

      // Show success message
      alert("inventory deleted successfully!");
    } catch (error) {
      console.error("Failed to delete inventory:", error);
      alert("Failed to delete inventory.");
    }
    const fetchInventoryItems = async () => {
      const items = await inventoryAPI.getAll();
      setInventoryItems(items);
    };
    fetchInventoryItems();
  };

  return (
    <div className="bg-background p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search inventory..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{inventoryItems.filter((item) => item.current_stock < item.min_threshold).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(inventoryItems.map((item) => item.category)).size}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Min. Threshold</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {item.current_stock} {item.unit}
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      {item.min_threshold} {item.unit}
                    </TableCell>
                    <TableCell>{item.last_updated}</TableCell>
                    <TableCell>
                      {item.current_stock < item.min_threshold ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="secondary">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No inventory items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={newInventory.name} onChange={(e) => setNewInventory({ ...newInventory, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={newInventory.category} onValueChange={(value) => setNewInventory({ ...newInventory, category: value })}>
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Current Stock
              </Label>
              <Input id="stock" value={newInventory.current_stock} onChange={(e) => setNewInventory({ ...newInventory, current_stock: parseInt(e.target.value) })} type="number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Unit</Label>
              <Select value={newInventory.unit} onValueChange={(value) => setNewInventory({ ...newInventory, unit: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threshold" className="text-right">
                Min. Threshold
              </Label>
              <Input id="threshold" value={newInventory.min_threshold} onChange={(e) => setNewInventory({ ...newInventory, min_threshold: parseInt(e.target.value) })} type="number" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleAddItem}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input id="edit-name" value={selectedItem.name} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select value={selectedItem.category} onValueChange={(value) => setSelectedItem({ ...selectedItem, category: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stock" className="text-right">
                  Current Stock
                </Label>
                <Input id="edit-stock" value={selectedItem.current_stock} onChange={(e) => setSelectedItem({ ...selectedItem, current_stock: parseInt(e.target.value) })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Unit
                </Label>
                <Select value={selectedItem.unit} onValueChange={(value) => setSelectedItem({ ...selectedItem, unit: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-threshold" className="text-right">
                  Min. Threshold
                </Label>
                <Input id="edit-threshold" type="number" value={selectedItem.min_threshold} onChange={(e) => setSelectedItem({ ...selectedItem, min_threshold: parseInt(e.target.value) })} className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={() => selectedItem && handleEditItem(selectedItem.id, inventoryToInventoryUpdate(selectedItem))}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
