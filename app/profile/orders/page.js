"use client";
import React, { useMemo, useState } from "react";
import { ListFilter, X, Package, ShoppingBag, Link, Truck } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import CyberLoader from "@/components/CyberLoader";
import { useUserOrders } from "@/hooks/useUserOrders";
import withAuth from "@/components/withAuth";

const FilterPanel = ({ filters, onChange, onClear, onClose }) => {
  const statuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-2">
          {statuses.map((status) => (
            <label
              key={status}
              className="flex items-center gap-3 w-full p-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={filters.orderStatus.includes(status)}
                onChange={() => onChange(status)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {status}
            </label>
          ))}
        </div>
        <button
          onClick={onClear}
          className="w-full mt-4 py-2 text-sm text-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
        >
          Clear Filters
        </button>
      </div>
    </motion.div>
  );
};

const Orders = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ orderStatus: [] });
  const [page, setPage] = useState(1);
  const { orders, totalPages, isLoading, error } = useUserOrders(filters, page);

  const handleFilterChange = (status) => {
    setFilters((prev) => {
      const newStatuses = prev.orderStatus.includes(status)
        ? prev.orderStatus.filter((s) => s !== status)
        : [...prev.orderStatus, status];
      return { ...prev, orderStatus: newStatuses };
    });
    setPage(1);
  };

  const clearFilters = () => setFilters({ orderStatus: [] });

  const allProductsFromOrders = useMemo(() => {
    if (!orders) return [];
    return orders.flatMap((order) =>
      order.products
        .filter((item) => item && item.product)
        .map((item) => ({
          ...item,
          orderId: order._id,
          orderStatus: order.status,
          orderedAt: order.createdAt,
        }))
    );
  }, [orders]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <Navbar />
      {isLoading && orders.length === 0 ? (
        <CyberLoader />
      ) : (
        <div className="min-h-screen bg-gray-50 text-gray-800 pt-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900">
                Order History
              </h1>
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
                >
                  <ListFilter className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">
                    {filters.orderStatus.length
                      ? `Filters (${filters.orderStatus.length})`
                      : "Filters"}
                  </span>
                </button>
                <AnimatePresence>
                  {isFilterOpen && (
                    <FilterPanel
                      filters={filters}
                      onChange={handleFilterChange}
                      onClear={clearFilters}
                      onClose={() => setIsFilterOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {allProductsFromOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag size={40} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  You haven't ordered any items yet
                </h2>
                <p className="text-gray-600">
                  Your purchased items will appear here.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {allProductsFromOrders.map((item, index) => (
                  <motion.div
                    key={`${item.orderId}-${item.product._id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center gap-4"
                  >
                    <div className="relative w-24 h-24 shrink-0">
                      <Image
                        src={
                          item.product.image
                            .replace(/\s+/g, "")
                            .replace(/[\[\]]/g, "") || "/images/lamp.jpg"
                        }
                        alt={item.product.product_name}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product.uniq_id}`}
                        className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-1"
                      >
                        {item.product.product_name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        ₹{item.product.discounted_price}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                          item.orderStatus === "Delivered"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        <Truck size={16} />
                        <span>{item.orderStatus}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Ordered on{" "}
                        {new Date(item.orderedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(Orders);
