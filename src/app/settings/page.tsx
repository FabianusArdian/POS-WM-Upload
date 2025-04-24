"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  User,
  Store,
  Lock,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserData, StoreSettings } from "@/models/UserData";

import { usersAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";




export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");

  // Users state
  // const [users, setUsers] = useState<UserData[]>([
  //   {
  //     id: 1,
  //     name: "Admin User",
  //     email: "admin@example.com",
  //     role: "admin",
  //     last_login: "2023-06-15 08:30",
  //   },
  //   {
  //     id: 2,
  //     name: "Cashier 1",
  //     email: "cashier1@example.com",
  //     role: "cashier",
  //     last_login: "2023-06-14 17:45",
  //   },
  //   {
  //     id: 3,
  //     name: "Cashier 2",
  //     email: "cashier2@example.com",
  //     role: "cashier",
  //     last_login: "2023-06-13 09:15",
  //   },
  // ]);
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    usersAPI.getAll().then((data) => {
      setUsers(data);
    });
  }, []);

  // Store settings state
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: "Warung Makan",
    address: "Jl. Contoh No. 123, Jakarta",
    phone: "021-1234567",
    taxRate: 10,
    currency: "IDR",
    logo: "",
  });

  // Dialog states
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [newUser, setNewUser] = useState<Partial<UserData>>({
    username: "",
    email: "",
    password: "",
    role: "cashier",
  });

  // User management functions
  const handleAddUser = () => {
    const id = Math.max(0, ...users.map((u) => u.id)) + 1;
    const userToAdd = { ...newUser, id } as UserData;
    setUsers([...users, userToAdd]);
    setNewUser({
      username: "",
      email: "",
      password: "",
      role: "cashier",
    });
    try {
      usersAPI.createUser(userToAdd);
    } catch (error) {
      console.error("Error creating user:", error);
    }
    setIsAddUserDialogOpen(false);
  };

  const handleEditUser = () => {
    if (!currentUser) return;
    const updatedUsers = users.map((u) =>
      u.id === currentUser.id ? currentUser : u,
    );
    setUsers(updatedUsers);
    try {
      usersAPI.updateUser(currentUser.id, currentUser);
    } catch (error) {
      console.error("Error updating user:", error);
    }
    setIsEditUserDialogOpen(false);
    setCurrentUser(null);
  };

  const handleDeleteUser = () => {
    if (!currentUser) return;
    const filteredUsers = users.filter((u) => u.id !== currentUser.id);
    setUsers(filteredUsers);
    try {
      usersAPI.deleteUser(currentUser.id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setIsDeleteUserDialogOpen(false);
    setCurrentUser(null);
  };

  // Store settings functions
  const handleUpdateStoreSettings = () => {
    // In a real app, this would save to a database
    console.log("Store settings updated:", storeSettings);
    alert("Store settings updated successfully!");
  };

  return (

    <div className="flex h-screen bg-background">
        {/* Sidebar Navigation */}
          <div className="w-64 border-r bg-card p-4 flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary">Food POS</h2>
              <p className="text-sm text-muted-foreground">Restaurant Management</p>
            </div>
    
            <Button
              variant="ghost"
              className="w-full justify-start mb-4"
              size="lg"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
          </div>
        {/* <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div> */}

      {/* Main Content Area */}

    <div className="flex-1 flex flex-col overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

       
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <TabsList className="mb-6">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <User className="h-4 w-4" /> User Management
              </TabsTrigger>
              <TabsTrigger value="store" className="flex items-center gap-2">
                <Store className="h-4 w-4" /> Store Settings
              </TabsTrigger>
            </TabsList>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>User Management</CardTitle>
              <Button
                onClick={() => setIsAddUserDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role === "admin" ? "Admin" : "Cashier"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.last_login ? formatDate(user.last_login) : "Never"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentUser(user);
                              setIsEditUserDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => {
                              setCurrentUser(user);
                              setIsDeleteUserDialogOpen(true);
                            }}
                            disabled={
                              user.role === "admin" &&
                              users.filter((u) => u.role === "admin").length <=
                                1
                            }
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
        </TabsContent>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={storeSettings.name}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="store-address">Address</Label>
                  <Input
                    id="store-address"
                    value={storeSettings.address}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        address: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="store-phone">Phone Number</Label>
                  <Input
                    id="store-phone"
                    value={storeSettings.phone}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    value={storeSettings.taxRate}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        taxRate: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={storeSettings.currency}
                    onValueChange={(value) =>
                      setStoreSettings({ ...storeSettings, currency: value })
                    }
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">
                        Indonesian Rupiah (IDR)
                      </SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="SGD">
                        Singapore Dollar (SGD)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="store-logo">Logo URL</Label>
                  <Input
                    id="store-logo"
                    value={storeSettings.logo || ""}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        logo: e.target.value,
                      })
                    }
                    placeholder="Enter logo URL"
                  />
                </div>

                <Button
                  onClick={handleUpdateStoreSettings}
                  className="mt-4 w-full md:w-auto"
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </main>
      </Tabs>
    </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">password</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Enter password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value: "admin" | "cashier") =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={currentUser.username}
                  onChange={(e) =>
                    setCurrentUser({
                      ...currentUser,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) =>
                    setCurrentUser({
                      ...currentUser,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={currentUser.role}
                  onValueChange={(value: "admin" | "cashier") =>
                    setCurrentUser({ ...currentUser, role: value })
                  }
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={isDeleteUserDialogOpen}
        onOpenChange={setIsDeleteUserDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {currentUser?.username || "this user"}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
