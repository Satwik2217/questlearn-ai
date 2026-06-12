"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Book,
  Gem,
  Scroll,
  Diamond,
  Swords,
  FlaskConical,
  Calendar,
  ShieldCheck,
  ShieldOff,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { InventoryItem, ItemCategory, ItemRarity } from "@/types";

const categoryIcons: Record<ItemCategory, React.ReactNode> = {
  book: <Book className="h-6 w-6" />,
  gem: <Gem className="h-6 w-6" />,
  scroll: <Scroll className="h-6 w-6" />,
  crystal: <Diamond className="h-6 w-6" />,
  weapon: <Swords className="h-6 w-6" />,
  artifact: <FlaskConical className="h-6 w-6" />,
};

const rarityConfig: Record<
  ItemRarity,
  { border: string; glow: string; bg: string; text: string; badge: string }
> = {
  common: {
    border: "border-gray-500",
    glow: "shadow-[0_0_15px_-2px] shadow-gray-500/30",
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    badge: "default",
  },
  uncommon: {
    border: "border-green-500",
    glow: "shadow-[0_0_15px_-2px] shadow-green-500/30",
    bg: "bg-green-500/10",
    text: "text-green-400",
    badge: "success",
  },
  rare: {
    border: "border-blue-500",
    glow: "shadow-[0_0_15px_-2px] shadow-blue-500/30",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    badge: "secondary",
  },
  epic: {
    border: "border-purple-500",
    glow: "shadow-[0_0_15px_-2px] shadow-purple-500/30",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    badge: "accent",
  },
  legendary: {
    border: "border-amber-400",
    glow: "shadow-[0_0_25px_-2px] shadow-amber-400/40",
    bg: "bg-amber-400/10",
    text: "text-amber-400",
    badge: "default",
  },
};

interface ItemDetailProps {
  inventoryItem: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEquip: (item: InventoryItem) => Promise<void>;
  onUnequip: (item: InventoryItem) => Promise<void>;
  onUse: (item: InventoryItem) => Promise<void>;
}

export function ItemDetail({
  inventoryItem,
  open,
  onOpenChange,
  onEquip,
  onUnequip,
  onUse,
}: ItemDetailProps) {
  const [busy, setBusy] = useState(false);

  if (!inventoryItem || !inventoryItem.item) return null;

  const item = inventoryItem.item;
  const rarity = rarityConfig[item.rarity];

  const effects = item.effects
    ? Object.entries(item.effects).map(([key, value]) => ({
        label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: String(value),
      }))
    : [];

  const handleEquip = async () => {
    setBusy(true);
    try {
      await onEquip(inventoryItem);
    } finally {
      setBusy(false);
    }
  };

  const handleUnequip = async () => {
    setBusy(true);
    try {
      await onUnequip(inventoryItem);
    } finally {
      setBusy(false);
    }
  };

  const handleUse = async () => {
    setBusy(true);
    try {
      await onUse(inventoryItem);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">{item.name}</DialogTitle>
          <DialogDescription className="sr-only">
            {item.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 py-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "flex h-24 w-24 items-center justify-center rounded-2xl border-2",
              rarity.border,
              rarity.glow,
              rarity.bg
            )}
          >
            {categoryIcons[item.category]}
          </motion.div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
            <Badge
              variant={rarity.badge as "default" | "secondary" | "accent" | "success"}
              className="mt-1"
            >
              {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
            </Badge>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {item.description}
          </p>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5">
              {categoryIcons[item.category]}
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Badge>
            {inventoryItem.quantity > 1 && (
              <Badge variant="secondary">x{inventoryItem.quantity}</Badge>
            )}
            <Badge variant="ghost" className="gap-1.5">
              <Calendar className="h-3 w-3" />
              {new Date(inventoryItem.acquired_at).toLocaleDateString()}
            </Badge>
          </div>

          {effects.length > 0 && (
            <>
              <Separator />
              <div className="w-full space-y-2">
                <h4 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Effects
                </h4>
                <ul className="space-y-1">
                  {effects.map((effect) => (
                    <li
                      key={effect.label}
                      className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-1.5 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {effect.label}
                      </span>
                      <span className="font-medium text-foreground">
                        +{effect.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          {inventoryItem.equipped ? (
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleUnequip}
              disabled={busy}
            >
              <ShieldOff className="h-4 w-4" />
              Unequip
            </Button>
          ) : (
            <Button
              variant="game-primary"
              className="flex-1 gap-2"
              onClick={handleEquip}
              disabled={busy}
            >
              <ShieldCheck className="h-4 w-4" />
              Equip
            </Button>
          )}
          <Button
            variant="secondary"
            className="flex-1 gap-2"
            onClick={handleUse}
            disabled={busy}
          >
            <Sparkles className="h-4 w-4" />
            Use
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
