"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/hooks/useSearch";
import { FilterPanel } from "@/components/FilterPanel";
import PageLoader from "@/components/PageLoader";

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [filters, setFilters] = useState({ minPrice: "", maxPrice: "" });
  const [sortOrder, setSortOrder] = useState("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { products, isLoading, error } = useSearch(
    initialQuery,
    filters,
    sortOrder
  );

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load results.
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">
              Search Results for "{initialQuery}"
            </h1>
            <p className="text-gray-600 mt-2">{products?.length} items found</p>
          </motion.div>

          <div className="flex items-center gap-4 my-8">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-100"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>

          {isLoading && products?.length === 0 ? (
            <PageLoader />
          ) : products?.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold">No results found</h2>
              <p className="text-gray-600 mt-2">
                Try a different search term or adjust your filters.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {products?.map((product, index) => (
                  <motion.div
                    key={product.uniq_id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={filters}
        onApply={setFilters}
      />
    </>
  );
};

const SearchPage = () => (
  <Suspense fallback={<PageLoader />}>
    <SearchPageContent />
  </Suspense>
);

export default SearchPage;
