/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "@/app/_styles/global.css";
import BottomNavigation from "@/components/BottomNavigation";

import ProductContext from "@/context/ProductContext";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [prods, setProds] = useState([]);
  const [loader, setLoader] = useState(false);
  const query = searchParams.get("q") || "";

  const { products, isLoading } = useContext(ProductContext) || {
    products: [],
    isLoading: false,
  };

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

        const filteredProducts = products
          ?.filter((product) => {
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

            return searchTerms.every((term) => {
              return (
                productName.includes(term) ||
                description.includes(term) ||
                categoryTree.includes(term) ||
                brand.includes(term) ||
                productUrl.includes(term)
              );
            });
          })
          .slice(100, 400);

        console.log(filteredProducts);
        setProds(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchAndFilterProducts();
  }, [query, products]);

  useEffect(() => {
    const handleScroll = () => {
      setIsBottomNavVisible(
        window.innerHeight + window.scrollY <
          document.documentElement.scrollHeight
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mt-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100"
          >
            Search Results for "{query}"
            <span className="ml-3 text-gray-500 dark:text-gray-400 text-lg font-normal">
              ({prods?.length || 0} results)
            </span>
          </motion.h1>

          {loader ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
                >
                  <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-4 w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-2 w-1/2 animate-pulse" />
                </motion.div>
              ))}
            </div>
          ) : prods?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4 dark:text-gray-600">🔍</div>
                <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
                  No products found for "{query}"
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Try different keywords or check out our featured collections.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {prods.slice(0, 100).map((product, index) => (
                <motion.div
                  key={product.uniq_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-shadow"
                  onClick={() => router.push(`/product/${product.uniq_id}`)}
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-xl">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.product_name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading={index < 4 ? "eager" : "lazy"}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
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
                    <div className="absolute top-4 left-4 flex items-center bg-black/80 px-2 py-1 rounded-full text-white text-sm">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{product.reviews.rating}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <BottomNavigation visible={isBottomNavVisible} />
        </div>
      </div>
    </>
  );
};
export default SearchPageContent;
