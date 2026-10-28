"use client";

import { Sparkle } from "lucide-react";

import { Marquee } from "@/components/magicui/marquee";
import { RUPEE_SYMBOL } from "@/lib/product-display";
import { cn } from "@/lib/utils";

const categoryItems = [
  "Fashion",
  "Electronics",
  "Home & Living",
  "Beauty & Health",
  "Sports & Outdoors",
];

const perkItems = [
  `Free shipping over ${RUPEE_SYMBOL}500`,
  "100% secure payments",
  "Hassle-free returns",
  "Quick delivery",
];

function Band({ items, reverse = false }) {
  return (
    <Marquee
      reverse={reverse}
      pauseOnHover
      className="py-4 [--duration:36s] [--gap:2.5rem]"
    >
      {items.map((item) => (
        <span
          key={item}
          className="flex items-center gap-10 whitespace-nowrap font-display text-xl font-bold uppercase tracking-[-0.01em] sm:text-2xl"
        >
          {item}
          <Sparkle className="h-5 w-5 opacity-70" />
        </span>
      ))}
    </Marquee>
  );
}

// Two crossing ticker bands; decorative, so the repeated text is hidden from
// assistive tech and summarised once below.
export default function MarqueeBand({ className }) {
  return (
    <section
      aria-label="Store highlights"
      className={cn("relative overflow-hidden py-16 sm:py-20", className)}
    >
      <div aria-hidden className="relative">
        <div className="-rotate-[2.5deg] scale-x-110 bg-brand-gradient text-[#fff] shadow-[0_30px_60px_-30px_rgba(99,56,238,0.6)]">
          <Band items={categoryItems} />
        </div>
        <div
          className={cn(
            "absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-[2deg] scale-x-110 border-y",
            "border-white/10 bg-[#0b0a14] text-[#fff]/90 dark:bg-[#15132a]"
          )}
        >
          <Band items={perkItems} reverse />
        </div>
      </div>

      <ul className="sr-only">
        {[...categoryItems, ...perkItems].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
