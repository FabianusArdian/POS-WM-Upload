import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  product: {
    name?: string;
    price?: number;
    category?: string;
    unit?: string;
    is_package?: boolean;
    image?: string;
  };
  onUpdate: (field: string, value: any) => void;
  onCancel: () => void;
  onSave: () => void;
  categories: string[];
  mode: "add" | "edit";
}

export default function ProductForm({
  product,
  onUpdate,
  onCancel,
  onSave,
  categories,
  mode
}: ProductFormProps) {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => onUpdate("name", e.target.value)}
            placeholder="Enter product name"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={product.price}
            onChange={(e) => onUpdate("price", parseFloat(e.target.value) || 0)}
            placeholder="Enter price"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={product.category}
            onValueChange={(value) => onUpdate("category", value)}
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
            value={product.unit}
            onChange={(e) => onUpdate("unit", e.target.value)}
            placeholder="e.g., box, piece, kg"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="isPackage">Product Type</Label>
          <Select
            value={product.is_package ? "package" : "single"}
            onValueChange={(value) =>
              onUpdate("is_package", value === "package")
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
            value={product.image}
            onChange={(e) => onUpdate("image", e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          {mode === "add" ? "Add Product" : "Save Changes"}
        </Button>
      </DialogFooter>
    </>
  );
}