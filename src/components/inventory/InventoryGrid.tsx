"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  Calendar,
  SortAsc,
  Package,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemCard } from "./ItemCard";
import type { InventoryItem, ItemRarity, ItemCategory } from "@/types";

const categories: { value: ItemCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "book", label: "Books" },
  { value: "gem", label: "Gems" },
  { value: "scroll", label: "Scrolls" },
  { value: "crystal", label: "Crystals" },
  { value: "weapon", label: "Weapons" },
  { value: "artifact", label: "Artifacts" },
];

const rarities: { value: ItemRarity | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "common", label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
];

type SortBy = "rarity" | "name" | "acquired";

const rarityOrder: Record<ItemRarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

interface InventoryGridProps {
  items: InventoryItem[];
  loading?: boolean;
  onItemClick: (item: InventoryItem) => void;
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
        <Package className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        No items found
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        Go on quests to find items! Complete challenges and defeat bosses to
        earn rare loot.
      </p>
    </motion.div>
  );
}

export function InventoryGrid({
  items,
  loading,
  onItemClick,
}: InventoryGridProps) {
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | "all">(
    "all"
  );
  const [rarityFilter, setRarityFilter] = useState<ItemRarity | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("acquired");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filtered = useMemo(() => {
    let result = [...items];

    if (categoryFilter !== "all") {
      result = result.filter((i) => i.item?.category === categoryFilter);
    }
    if (rarityFilter !== "all") {
      result = result.filter((i) => i.item?.rarity === rarityFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.item?.name.toLowerCase().includes(q) ||
          i.item?.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "rarity":
          return rarityOrder[b.item!.rarity] - rarityOrder[a.item!.rarity];
        case "name":
          return a.item!.name.localeCompare(b.item!.name);
        case "acquired":
          return (
            new Date(b.acquired_at).getTime() -
            new Date(a.acquired_at).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [items, categoryFilter, rarityFilter, sortBy, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(0, page * perPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              variant={
                categoryFilter === cat.value ? "default" : "outline"
              }
              className={cn(
                "cursor-pointer transition-all",
                categoryFilter === cat.value && "shadow-lg"
              )}
              onClick={() => {
                setCategoryFilter(cat.value);
                setPage(1);
              }}
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {rarities.map((r) => (
            <Badge
              key={r.value}
              variant={rarityFilter === r.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all",
                rarityFilter === r.value && "shadow-lg"
              )}
              onClick={() => {
                setRarityFilter(r.value);
                setPage(1);
              }}
            >
              {r.label}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort:</span>
          {(
            [
              { value: "acquired", label: "Date", icon: Calendar },
              { value: "rarity", label: "Rarity", icon: ArrowUpDown },
              { value: "name", label: "Name", icon: SortAsc },
            ] as const
          ).map((opt) => (
            <Button
              key={opt.value}
              variant={sortBy === opt.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy(opt.value as SortBy)}
              className="h-8 gap-1.5 text-xs"
            >
              <opt.icon className="h-3.5 w-3.5" />
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {paginated.length === 0 ? (
                <EmptyState />
              ) : (
                paginated.map((invItem) => (
                  <ItemCard
                    key={invItem.id}
                    inventoryItem={invItem}
                    onClick={onItemClick}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {paginated.length < filtered.length && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                className="gap-2"
              >
                Load More ({filtered.length - paginated.length} remaining)
              </Button>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Showing {paginated.length} of {filtered.length} items
          </p>
        </>
      )}
    </div>
  );
}
