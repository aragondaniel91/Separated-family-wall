import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Check,
  ShoppingCart,
  Apple,
  Milk,
  Beef,
  Croissant,
  Snowflake,
  Package,
  GlassWater,
  Cookie,
  Warehouse,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const categoryConfig = {
  produce: {
    icon: Apple,
    label: "Produce",
    color: "bg-green-100 text-green-700",
  },
  dairy: { icon: Milk, label: "Dairy", color: "bg-blue-100 text-blue-700" },
  meat: { icon: Beef, label: "Meat", color: "bg-red-100 text-red-700" },
  bakery: {
    icon: Croissant,
    label: "Bakery",
    color: "bg-amber-100 text-amber-700",
  },
  frozen: {
    icon: Snowflake,
    label: "Frozen",
    color: "bg-cyan-100 text-cyan-700",
  },
  pantry: {
    icon: Package,
    label: "Pantry",
    color: "bg-orange-100 text-orange-700",
  },
  beverages: {
    icon: GlassWater,
    label: "Beverages",
    color: "bg-sky-100 text-sky-700",
  },
  snacks: { icon: Cookie, label: "Snacks", color: "bg-pink-100 text-pink-700" },
  household: {
    icon: Warehouse,
    label: "Household",
    color: "bg-gray-100 text-gray-700",
  },
  other: {
    icon: CircleDot,
    label: "Other",
    color: "bg-slate-100 text-slate-700",
  },
};

export default function Groceries() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("other");
  const [newQuantity, setNewQuantity] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("groceries") || "[]");
    setItems(data);
  }, []);

  const saveItems = (updated) => {
    setItems(updated);
    localStorage.setItem("groceries", JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (!newItem.trim()) return;

    const newData = {
      id: Date.now(),
      name: newItem.trim(),
      category: newCategory,
      quantity: newQuantity,
      checked: false,
    };

    const updated = [newData, ...items];
    saveItems(updated);

    setNewItem("");
    setNewQuantity("");
  };

  const toggleItem = (item) => {
    const updated = items.map((i) =>
      i.id === item.id ? { ...i, checked: !i.checked } : i
    );
    saveItems(updated);
  };

  const deleteItem = (id) => {
    const updated = items.filter((i) => i.id !== id);
    saveItems(updated);
  };

  const clearChecked = () => {
    const updated = items.filter((i) => !i.checked);
    saveItems(updated);
  };

  const unchecked = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);

  const grouped = unchecked.reduce((acc, item) => {
    const cat = item.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-heading">Grocery List</h1>
        <Badge variant="secondary">{unchecked.length} items left</Badge>
      </div>

      {/* Add */}
      <Card className="p-3 mb-4">
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add item..."
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Input
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            placeholder="Qty"
            className="w-20"
          />
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryConfig).map(([key, val]) => (
                <SelectItem key={key} value={key}>
                  {val.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* List */}
      {Object.entries(grouped).map(([cat, catItems]) => {
        const config = categoryConfig[cat] || categoryConfig.other;
        const Icon = config.icon;

        return (
          <div key={cat} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" />
              <p className="text-sm font-semibold">{config.label}</p>
            </div>

            {catItems.map((item) => (
              <Card key={item.id} className="p-3 flex items-center gap-3">
                <button onClick={() => toggleItem(item)}>
                  <div className="w-5 h-5 border rounded-full" />
                </button>

                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.quantity && (
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}
                    </p>
                  )}
                </div>

                <button onClick={() => deleteItem(item.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </Card>
            ))}
          </div>
        );
      })}

      {unchecked.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>List is empty</p>
        </div>
      )}

      {/* Checked */}
      {checked.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <p className="text-sm">In Cart ({checked.length})</p>
            <Button variant="ghost" size="sm" onClick={clearChecked}>
              Clear All
            </Button>
          </div>

          {checked.map((item) => (
            <Card
              key={item.id}
              className="p-3 flex items-center gap-3 opacity-50"
            >
              <button onClick={() => toggleItem(item)}>
                <Check className="w-4 h-4" />
              </button>

              <p className="line-through text-sm">{item.name}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
