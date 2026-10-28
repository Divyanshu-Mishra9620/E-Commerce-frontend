"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  LayoutGrid,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import {
  SiAmericanexpress,
  SiMastercard,
  SiPaypal,
  SiVisa,
} from "react-icons/si";

import CountUp from "@/components/fx/CountUp";
import SectionHeading from "@/components/fx/SectionHeading";
import { trackSpotlight } from "@/lib/motion";
import {
  getCategoryLabel,
  getDiscountPercent,
  getReviewSummary,
  RUPEE_SYMBOL,
} from "@/lib/product-display";
import { cn } from "@/lib/utils";

function getStoreStats(products) {
  const list = Array.isArray(products) ? products : [];
  const categories = new Set();
  let maxDiscount = 0;
  let ratingTotal = 0;
  let ratedCount = 0;

  for (const product of list) {
    maxDiscount = Math.max(maxDiscount, getDiscountPercent(product));

    const { rating, count } = getReviewSummary(product);
    if (count > 0 && rating > 0) {
      ratingTotal += rating;
      ratedCount += 1;
    }

    const category = getCategoryLabel(product, "");
    if (category) categories.add(category.toLowerCase());
  }

  return {
    productCount: list.length,
    maxDiscount,
    categoryCount: categories.size,
    avgRating: ratedCount ? ratingTotal / ratedCount : 0,
  };
}

function Tile({ href, className, children }) {
  const Component = href ? Link : "div";

  return (
    <Component
      href={href}
      onPointerMove={trackSpotlight}
      className={cn(
        "spotlight group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_30px_60px_-50px_rgba(35,18,79,0.45)] transition-transform duration-500 ease-out-expo hover:-translate-y-1",
        className
      )}
    >
      {children}
    </Component>
  );
}

function TileIcon({ icon: Icon }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-110 dark:bg-brand-500/15 dark:text-brand-300">
      <Icon className="h-5 w-5" />
    </span>
  );
}

export default function PerksBento({ products }) {
  const stats = useMemo(() => getStoreStats(products), [products]);

  return (
    <section className="storefront-section py-12 md:py-16">
      <SectionHeading
        kicker="Why Elysoria"
        icon={Sparkles}
        title="Built for a"
        highlight="smoother checkout"
        description="The essentials that make every order feel effortless, with live numbers from today's catalog."
      />

      <div className="grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile
          href="#collections"
          className="justify-between border-white/10 bg-[#0b0a14] p-8 text-[#fff] sm:col-span-2 lg:row-span-2"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/50 blur-[90px] motion-safe:animate-aurora" />
            <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-coral-500/30 blur-[90px] motion-safe:animate-aurora [animation-delay:-8s]" />
            <div className="bg-dots mask-radial absolute inset-0 opacity-50" />
          </div>

          <span className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fff]/75">
            Today&apos;s edit
          </span>

          <div className="relative z-10 mt-10">
            {stats.maxDiscount > 0 ? (
              <>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#fff]/55">
                  Save up to
                </p>
                <p className="font-display text-[5.5rem] font-extrabold leading-none tracking-[-0.06em] sm:text-[7rem]">
                  <CountUp
                    value={stats.maxDiscount}
                    suffix="%"
                    className="bg-gradient-to-r from-brand-200 via-fuchsia-200 to-coral-300 bg-clip-text text-transparent"
                  />
                </p>
                <p className="mt-2 max-w-sm text-base leading-7 text-[#fff]/65">
                  The deepest markdown across {stats.productCount} products in
                  today&apos;s catalog.
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-[5.5rem] font-extrabold leading-none tracking-[-0.06em]">
                  <CountUp value={stats.productCount} />
                </p>
                <p className="mt-2 max-w-sm text-base leading-7 text-[#fff]/65">
                  Fresh picks live in today&apos;s catalog.
                </p>
              </>
            )}
          </div>

          <span className="relative z-10 mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#fff] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-[#0b0a14]">
            Shop the collections
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b0a14] text-[#fff] transition-transform duration-500 ease-out-expo group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </span>
        </Tile>

        <Tile href="/shipping">
          <TileIcon icon={Truck} />
          <h3 className="mt-auto pt-6 font-display text-xl font-bold text-slate-950">
            Free shipping
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            On every order above {RUPEE_SYMBOL}500
          </p>
        </Tile>

        <Tile>
          <TileIcon icon={ShieldCheck} />
          <h3 className="mt-auto pt-6 font-display text-xl font-bold text-slate-950">
            Secure payments
          </h3>
          <div className="mt-2 flex items-center gap-3 text-slate-400 transition-colors duration-500 group-hover:text-slate-600">
            <SiVisa size={26} />
            <SiMastercard size={22} />
            <SiAmericanexpress size={20} />
            <SiPaypal size={18} />
          </div>
        </Tile>

        <Tile href="/categories">
          <div className="flex items-start justify-between">
            <TileIcon icon={LayoutGrid} />
            <ArrowUpRight className="h-5 w-5 text-slate-400 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
          <p className="mt-auto pt-6 font-display text-4xl font-extrabold tracking-[-0.04em] text-slate-950">
            {stats.categoryCount > 0 ? (
              <CountUp value={stats.categoryCount} suffix="+" />
            ) : (
              "All"
            )}
          </p>
          <p className="mt-1 text-sm text-slate-500">categories to explore</p>
        </Tile>

        {stats.avgRating > 0 ? (
          <Tile>
            <TileIcon icon={Star} />
            <p className="mt-auto flex items-baseline gap-2 pt-6 font-display text-4xl font-extrabold tracking-[-0.04em] text-slate-950">
              <CountUp value={stats.avgRating} decimals={1} />
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            </p>
            <p className="mt-1 text-sm text-slate-500">
              average rating across reviewed products
            </p>
          </Tile>
        ) : (
          <Tile href="/returns">
            <TileIcon icon={RotateCcw} />
            <h3 className="mt-auto pt-6 font-display text-xl font-bold text-slate-950">
              Easy returns
            </h3>
            <p className="mt-1 text-sm text-slate-500">Hassle-free, no questions asked</p>
          </Tile>
        )}
      </div>
    </section>
  );
}
