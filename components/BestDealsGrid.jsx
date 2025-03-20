import ProductCard from "./ProductCard";

const BestDealsGrid = ({ deals, category }) => {
  return (
    <div className="flex-col mt-8 p-4 bg-green-100 dark:bg-green-900 rounded-lg shadow-sm">
      <h3 className="px-4 text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        {category}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {deals.map((deal, index) => (
          <ProductCard
            key={index}
            product={deal}
            showBadge
            badgeText="Hot Deal"
          />
        ))}
      </div>
    </div>
  );
};

export default BestDealsGrid;
