"use client";

import { motion } from "framer-motion";
import {
  Book,
  Gem,
  Scroll,
  Diamond,
  Swords,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import type { InventoryItem, ItemCategory, ItemRarity } from "@/types";

const categoryIcons: Record<ItemCategory, React.ReactNode> = {
  book: <Book className="h-5 w-5" />,
  gem: <Gem className="h-5 w-5" />,
  scroll: <Scroll className="h-5 w-5" />,
  crystal: <Diamond className="h-5 w-5" />,
  weapon: <Swords className="h-5 w-5" />,
  artifact: <FlaskConical className="h-5 w-5" />,
};

const rarityConfig: Record<
  ItemRarity,
  { border: string; glow: string; bg: string; label: string }
> = {
  common: {
    border: "border-gray-500",
    glow: "shadow-[0_0_10px_-2px] shadow-gray-500/40",
    bg: "bg-gray-500/10",
    label: "text-gray-400",
  },
  uncommon: {
    border: "border-green-500",
    glow: "shadow-[0_0_10px_-2px] shadow-green-500/40",
    bg: "bg-green-500/10",
    label: "text-green-400",
  },
  rare: {
    border: "border-blue-500",
    glow: "shadow-[0_0_10px_-2px] shadow-blue-500/40",
    bg: "bg-blue-500/10",
    label: "text-blue-400",
  },
  epic: {
    border: "border-purple-500",
    glow: "shadow-[0_0_10px_-2px] shadow-purple-500/40",
    bg: "bg-purple-500/10",
    label: "text-purple-400",
  },
  legendary: {
    border: "border-amber-400",
    glow: "shadow-[0_0_15px_-2px] shadow-amber-400/50",
    bg: "bg-amber-400/10",
    label: "text-amber-400",
  },
};

interface ItemCardProps {
  inventoryItem: InventoryItem;
  onClick: (item: InventoryItem) => void;
}

export function ItemCard({ inventoryItem, onClick }: ItemCardProps) {
  const item = inventoryItem.item!;
  const rarity = rarityConfig[item.rarity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200",
        rarity.border,
        rarity.glow,
        rarity.bg,
        "hover:brightness-110"
      )}
      onClick={() => onClick(inventoryItem)}
    >
      {inventoryItem.equipped && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="success" className="gap-1 px-2 py-0.5 text-[10px]">
            <ShieldCheck className="h-3 w-3" />
            Equipped
          </Badge>
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl",
            rarity.bg,
            "text-foreground"
          )}
        >
          {categoryIcons[item.category]}
        </div>

        <div className="w-full text-center">
          <p className="truncate text-sm font-semibold text-foreground">
            {item.name}
          </p>
          <p className={cn("text-xs font-medium", rarity.label)}>
            {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
          </p>
        </div>

        <div className="flex w-full items-center justify-between">
          <Badge variant="outline" className="text-[10px]">
            {item.category}
          </Badge>
          {inventoryItem.quantity > 1 && (
            <Badge variant="secondary" className="text-[10px]">
              x{inventoryItem.quantity}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
