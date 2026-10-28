"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import SliderRail from "@/components/fx/SliderRail";
import ProductCard from "./ProductCard";

const BestDealsGrid = ({ deals, category, gradient }) => {
  if (!deals || deals.length === 0) {
    return null;
  }

  const categorySlug = category.toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          <span className="font-display text-lg font-bold text-slate-950">
            {deals.length}
          </span>{" "}
          picks in {category}
        </p>

        <Link
          href={`/search?q=${categorySlug}`}
          className={`group inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${gradient} py-1.5 pl-5 pr-1.5 text-sm font-semibold text-[#fff] shadow-lg transition-transform duration-500 ease-out-expo hover:-translate-y-0.5`}
        >
          View all
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-out-expo group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      <SliderRail label={category}>
        {deals.map((deal) => (
          <ProductCard key={deal._id || deal.uniq_id} product={deal} />
        ))}
      </SliderRail>
    </div>
  );
};

export default BestDealsGrid;
