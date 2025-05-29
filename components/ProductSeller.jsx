import React, { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import CyberLoader from "./CyberLoader";
import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductSeller() {
  const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;
  const [sellerProducts, setSellerProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const fetchedProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URI}/api/products`);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        console.log(data);

        const filtered = data?.filter((product) => {
          const creator = String(product.createdBy).trim().toLowerCase();
          return ["admin", "seller"].includes(creator);
        });
        setSellerProducts(filtered);
      } catch (error) {
        console.error("Product filtering failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchedProducts();
  }, []);

  const handleProdClick = (productId) => {
    setIsNavigating(true);
    startTransition(() => {
      router.push(`/product/${productId}`);
      setIsNavigating(false);
    });
  };

  if (isLoading || isNavigating || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CyberLoader />
      </div>
    );
  }

  const getImageUrl = (imageString) => {
    if (!imageString) return "/images/lamp.jpg";
    try {
      const cleanedUrl = imageString.replace(/\s+/g, "").replace(/[\[\]]/g, "");
      if (
        cleanedUrl.startsWith("http://") ||
        cleanedUrl.startsWith("https://")
      ) {
        return cleanedUrl;
      }
      return `/images/${cleanedUrl}` || "/images/lamp.jpg";
    } catch (error) {
      console.error("Error processing image URL:", error);
      return "/images/lamp.jpg";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Seller Products
        </h1>

        {sellerProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No seller products available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sellerProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                onClick={() => handleProdClick(product.uniq_id)}
              >
                <div className="relative h-60 w-full">
                  <Image
                    src={getImageUrl(product.image)}
                    alt={product.product_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={(e) => {
                      e.target.src = "/images/lamp.jpg";
                    }}
                  />
                  {product.retail_price > product.discounted_price && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                      {Math.round(
                        ((product.retail_price - product.discounted_price) /
                          product.retail_price) *
                          100
                      )}
                      % OFF
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {product.product_name}
                  </h3>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 text-gray-600">
                        {product.product_rating || "4.5"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {product.retail_price > product.discounted_price && (
                        <span className="text-gray-400 line-through">
                          ${product.retail_price}
                        </span>
                      )}
                      <span className="text-xl font-bold text-emerald-600">
                        ${product.discounted_price}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
