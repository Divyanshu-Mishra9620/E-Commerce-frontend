"use client";

import { useRef } from "react";
import Link from "next/link";
import { useDragScroll } from "@/hooks/useDragScroll";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";

const BestDealsGrid = ({ deals, category, gradient }) => {
  const scrollRef = useRef(null);
  useDragScroll(scrollRef);

  if (!deals || deals.length === 0) {
    return null;
  }

  const categorySlug = category.toLowerCase();

  return (
    <section className="relative">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">{category}</h3>
        <Link
          href={`/search?q=${categorySlug}`}
          className={`hidden sm:inline-flex items-center text-sm font-medium bg-gradient-to-r ${gradient} text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity`}
        >
          View All
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="grid auto-cols-[minmax(280px,1fr)] grid-flow-col gap-6 overflow-x-auto pb-4 scrollbar-hide"
      >
        {deals.map((deal) => (
          <ProductCard key={deal._id || deal.uniq_id} product={deal} />
        ))}
      </div>
    </section>
  );
};

export default BestDealsGrid;
