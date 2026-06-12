"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Package, Sparkles, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { ItemDetail } from "@/components/inventory/ItemDetail";
import type { InventoryItem, Item } from "@/types";

export default function InventoryPage() {
  const supabase = createClient();
  const { user } = useAuthStore();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    equipped: 0,
    unique: 0,
    legendary: 0,
  });

  const fetchItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*, item:items(*)")
        .eq("user_id", user.id)
        .order("acquired_at", { ascending: false });

      if (error) throw error;

      const invItems = (data || []) as unknown as InventoryItem[];
      setItems(invItems);
      setStats({
        total: invItems.reduce((sum, i) => sum + i.quantity, 0),
        equipped: invItems.filter((i) => i.equipped).length,
        unique: invItems.length,
        legendary: invItems.filter((i) => i.item?.rarity === "legendary")
          .length,
      });
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleItemClick = (invItem: InventoryItem) => {
    setSelectedItem(invItem);
    setDetailOpen(true);
  };

  const handleEquip = async (invItem: InventoryItem) => {
    try {
      const { error } = await supabase
        .from("inventory_items")
        .update({ equipped: true })
        .eq("id", invItem.id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((i) => (i.id === invItem.id ? { ...i, equipped: true } : i))
      );
      toast.success(`${invItem.item?.name} equipped!`);
      setDetailOpen(false);
    } catch (error) {
      console.error("Failed to equip item:", error);
      toast.error("Failed to equip item");
    }
  };

  const handleUnequip = async (invItem: InventoryItem) => {
    try {
      const { error } = await supabase
        .from("inventory_items")
        .update({ equipped: false })
        .eq("id", invItem.id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((i) =>
          i.id === invItem.id ? { ...i, equipped: false } : i
        )
      );
      toast.success(`${invItem.item?.name} unequipped!`);
      setDetailOpen(false);
    } catch (error) {
      console.error("Failed to unequip item:", error);
      toast.error("Failed to unequip item");
    }
  };

  const handleUse = async (invItem: InventoryItem) => {
    toast.success(`Used ${invItem.item?.name}!`);
    setDetailOpen(false);
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="game-text text-3xl font-bold text-foreground">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage your collected items
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchItems}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw
            className={cn("h-4 w-4", loading && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Items", value: stats.total, icon: Package },
          { label: "Equipped", value: stats.equipped, icon: Sparkles },
          { label: "Unique Items", value: stats.unique, icon: Package },
          { label: "Legendary", value: stats.legendary, icon: Sparkles },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <InventoryGrid
        items={items}
        loading={loading}
        onItemClick={handleItemClick}
      />

      <ItemDetail
        inventoryItem={selectedItem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEquip={handleEquip}
        onUnequip={handleUnequip}
        onUse={handleUse}
      />
    </div>
  );
}
