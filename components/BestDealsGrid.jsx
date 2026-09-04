"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useDragScroll } from "@/hooks/useDragScroll";
import ProductCard from "./ProductCard";

const BestDealsGrid = ({ deals, category, gradient }) => {
  const scrollRef = useRef(null);
  useDragScroll(scrollRef);

  if (!deals || deals.length === 0) {
    return null;
  }

  const categorySlug = category.toLowerCase();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="storefront-kicker">
            Curated Drop
          </span>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
            {category}
          </h3>
        </div>

        <Link
          href={`/search?q=${categorySlug}`}
          className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${gradient} px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5`}
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
      >
        {deals.map((deal) => (
          <div
            key={deal._id || deal.uniq_id}
            className="w-[280px] flex-shrink-0 snap-start sm:w-[300px]"
          >
            <ProductCard product={deal} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestDealsGrid;
