"use client";
import ProductCard from "./ProductCard";

const MostVisitedSection = ({ products }) => {
  const mostVisitedItems = products
    .filter((product) => product.reviews && product.reviews > 0)
    .slice(0, 10);
  const randomItems =
    mostVisitedItems.length === 0 ? products.slice(0, 10) : mostVisitedItems;

  return (
    <div className="flex-col mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-sm">
      <h3 className="px-4 text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Most Visited Products
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {randomItems.map((item, index) => (
          <ProductCard
            key={index}
            product={item}
            showBadge
            badgeText="Most Visited"
          />
        ))}
      </div>
    </div>
  );
};

export default MostVisitedSection;
