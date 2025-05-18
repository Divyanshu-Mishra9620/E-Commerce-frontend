"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, {
  Suspense,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductContext from "@/context/ProductContext";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { SlidersHorizontal, X, ArrowUpDown, Check, Star } from "lucide-react";
import Spinner from "@/components/Spinner";

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prods, setProds] = useState([]);
  const [loader, setLoader] = useState(false);

  const [sortOrder, setSortOrder] = useState("none");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const query = searchParams.get("q") || "";
  const { products, isLoading } = useContext(ProductContext) || {
    products: [],
    isLoading: false,
  };
  const [isPending, startTransition] = useTransition();

  const sortOptions = [
    { value: "none", label: "Relevance" },
    { value: "lowToHigh", label: "Price: Low to High" },
    { value: "highToLow", label: "Price: High to Low" },
  ];

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      if (!query) {
        setProds([]);
        return;
      }
      setLoader(true);

      try {
        const decodedQuery = decodeURIComponent(query).toLowerCase().trim();
        const searchTerms = decodedQuery.split(/\s+/);

        let filteredProducts = products?.filter((product) => {
          product.image = product.image
            ?.replace(/\s+/g, "")
            .replace(/[\[\]]/g, "");
          const categoryTree =
            product.product_category_tree
              ?.replace(/[\[\]"]/g, "")
              .toLowerCase() || "";
          const brand =
            product.brand?.replace(/[\[\]"]/g, "").toLowerCase() || "";
          const productName = product.product_name?.toLowerCase() || "";
          const description =
            product.description?.replace(/[\[\]"]/g, "").toLowerCase() || "";
          const productUrl = product.product_url?.toLowerCase() || "";

          return searchTerms.every(
            (term) =>
              productName.includes(term) ||
              description.includes(term) ||
              categoryTree.includes(term) ||
              brand.includes(term) ||
              productUrl.includes(term)
          );
        });

        const parsedMin = parseFloat(minPrice);
        const parsedMax = parseFloat(maxPrice);

        if (!isNaN(parsedMin)) {
          filteredProducts = filteredProducts.filter(
            (p) => parseFloat(p.discounted_price) >= parsedMin
          );
        }

        if (!isNaN(parsedMax)) {
          filteredProducts = filteredProducts.filter(
            (p) => parseFloat(p.discounted_price) <= parsedMax
          );
        }

        if (sortOrder === "lowToHigh") {
          filteredProducts.sort(
            (a, b) =>
              parseFloat(a.discounted_price) - parseFloat(b.discounted_price)
          );
        } else if (sortOrder === "highToLow") {
          filteredProducts.sort(
            (a, b) =>
              parseFloat(b.discounted_price) - parseFloat(a.discounted_price)
          );
        }

        setProds(filteredProducts);
      } catch (error) {
        console.error("Error filtering products:", error);
      } finally {
        setTimeout(() => {
          setLoader(false);
        }, 1000);
      }
    };

    fetchAndFilterProducts();
  }, [query, products, sortOrder, minPrice, maxPrice]);

  // Clear all filters
  const clearFilters = () => {
    setSortOrder("none");
    setMinPrice("");
    setMaxPrice("");
  };

  const handleProdClick = (product) => {
    startTransition(() => {
      router.push(`/product/${product.uniq_id}`);
    });
  };
  if (isPending) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Results for "{query}"
            </h1>
            <div className="flex items-center justify-between mt-4">
              <p className="text-gray-600 dark:text-gray-400">
                {prods?.length || 0} items found
              </p>
              {(sortOrder !== "none" || minPrice || maxPrice) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  Clear filters
                </button>
              )}
            </div>
          </motion.div>

          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl border border-gray-800 dark:border-gray-700"
              >
                <ArrowUpDown className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {sortOptions.find((opt) => opt.value === sortOrder)?.label}
                </span>
              </motion.button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-2 space-y-1">
                      {sortOptions.map((option) => (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          className="relative"
                        >
                          <button
                            onClick={() => {
                              setSortOrder(option.value);
                              setIsSortOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left rounded-lg flex items-center justify-between ${
                              sortOrder === option.value
                                ? "bg-gray-100 dark:bg-gray-700"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            }`}
                          >
                            <span className="dark:text-gray-200">
                              {option.label}
                            </span>
                            {sortOrder === option.value && (
                              <Check className="w-4 h-4 text-black dark:text-white" />
                            )}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl border border-gray-800 dark:border-gray-700"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="text-sm font-medium">Filters</span>
            </motion.button>
          </div>

          {/* Filter Modal */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setIsFilterOpen(false)}
              >
                <motion.div
                  initial={{ x: 300 }}
                  animate={{ x: 0 }}
                  exit={{ x: 500 }}
                  className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold dark:text-gray-200">
                      Filters
                    </h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <X className="w-6 h-6 dark:text-gray-200" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4 dark:text-gray-300">
                        Price Range
                      </h4>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-1/2">
                          <label className="block text-xs font-semibold mb-1 dark:text-gray-300">
                            Min
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="1000"
                            value={minPrice || ""}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="w-1/2">
                          <label className="block text-xs font-semibold mb-1 dark:text-gray-300">
                            Max
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="1000"
                            value={maxPrice || ""}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-xs font-semibold mb-1 dark:text-gray-300">
                          Minimum Price
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={minPrice || 0}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <span>₹0</span>
                          <span>₹{minPrice || 0}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 dark:text-gray-300">
                          Maximum Price
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={maxPrice || 1000}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <span>₹0</span>
                          <span>₹{maxPrice || 1000}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 border-t pt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearFilters}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium dark:text-gray-200"
                      >
                        Clear
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full px-4 py-3 bg-black text-white rounded-lg font-medium"
                      >
                        Apply
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          {loader ? (
            <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
              <Image
                src="/search.gif"
                alt="Loading..."
                width={200}
                height={200}
                priority
                unoptimized
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gray-800 opacity-30 mix-blend-multiply" />
            </div>
          ) : prods?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 space-y-6"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800">
                🔍
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                No results found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your search or filters
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {prods.slice(0, 100).map((product, index) => (
                <motion.div
                  key={product.uniq_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleProdClick(product)}
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.product_name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={index < 4}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>

                  <div className="p-4">
                    <h2 className="font-medium text-gray-900 dark:text-gray-200 line-clamp-2 mb-2">
                      {product.product_name}
                    </h2>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ₹{product.discounted_price}
                      </p>
                      {product.original_price && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{product.original_price}
                        </p>
                      )}
                    </div>
                  </div>

                  {product.reviews?.rating && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm shadow-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {product.reviews.rating}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const SearchPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;
