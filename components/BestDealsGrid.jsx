import { useRef } from "react";
import { useDragScroll } from "@/hooks/useDragScroll";
import ProductCard from "./ProductCard";

const BestDealsGrid = ({ deals, category }) => {
  const scrollRef = useRef(null);
  useDragScroll(scrollRef);

  return (
    <section className="relative">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {category}
        </h3>
        <button className="hidden sm:inline-flex items-center text-sm font-medium bg-gradient-to-r ${gradient} text-black px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
          View All
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div
        ref={scrollRef}
        className="grid auto-cols-[minmax(280px,1fr)] grid-flow-col gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full"
      >
        {deals.map((deal, index) => (
          <ProductCard key={index} product={deal} />
        ))}
      </div>
    </section>
  );
};

export default BestDealsGrid;
