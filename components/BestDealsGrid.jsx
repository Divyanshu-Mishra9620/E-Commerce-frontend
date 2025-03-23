import { useRef } from "react";
import { useDragScroll } from "@/hooks/useDragScroll";
import ProductCard from "./ProductCard";

const BestDealsGrid = ({ deals, category }) => {
  const scrollRef = useRef(null);
  useDragScroll(scrollRef);

  return (
    <div className="mt-8 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        {category}
      </h3>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide snap-x snap-mandatory"
      >
        {deals.map((deal, index) => (
          <div key={index} className="snap-center flex-shrink-0 w-[280px]">
            <ProductCard product={deal} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestDealsGrid;
