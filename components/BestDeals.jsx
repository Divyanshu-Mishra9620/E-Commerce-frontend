"use client";
import { useRouter } from "next/navigation";
import React from "react";

const BestDealsGrid = ({ products }) => {
  const router = useRouter();
  const productList = Array.isArray(products) ? products : [];
  return (
    <div className="flex-col mt-8 p-4 bg-green-100 rounded-lg shadow-sm">
      <h3 className="px-4 text-2xl font-semibold text-gray-800 mb-6">
        Our Best Deals
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {productList?.slice(20, 32)?.map((deal, index) => (
          <div
            key={index}
            className="group flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full hover:cursor-pointer"
            onClick={() => router.push(`/product/${deal.uniq_id}`)}
          >
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={
                  deal.image.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
                  deal.description.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
                  "/lamp.jpg"
                }
                alt={deal.product_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                {isNaN(+deal.discounted_price)
                  ? Math.round((200 / 1000) * 100)
                  : Math.round((200 / (+deal.discounted_price + 200)) * 100)}
                % Off
              </span>
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {deal.product_name}
              </h4>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-gray-900">
                  ₹{isNaN(+deal.discounted_price) ? 800 : deal.discounted_price}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹
                  {isNaN(+deal.discounted_price)
                    ? 1000
                    : +deal.discounted_price + 200}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(deal.reviews?.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {deal.reviews?.rating || 0} ({deal.reviews?.rating || 0}{" "}
                  reviews)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestDealsGrid;
