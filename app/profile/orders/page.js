"use client";
import React, { useMemo, useState } from "react";
import {
  ListFilter,
  X,
  ShoppingBag,
  Truck,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "@/components/PageLoader";
import { useUserOrders } from "@/hooks/useUserOrders";
import withAuth from "@/components/withAuth";

const FilterPanel = ({ filters, onChange, onClear, onClose }) => {
  const statuses = [
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl z-50 border border-slate-200"
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-slate-900">Filter Orders</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="space-y-2 mb-4">
          {statuses.map((status) => (
            <label
              key={status}
              className="flex items-center gap-3 w-full p-3 text-sm rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.orderStatus.includes(status)}
                onChange={() => onChange(status)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-700 font-medium">{status}</span>
            </label>
          ))}
        </div>
        <button
          onClick={onClear}
          className="w-full py-2.5 text-sm text-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
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
  const { orders, isLoading, error } = useUserOrders(filters, page);

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

    const filteredOrders = orders.filter((order) => {
      if (filters.orderStatus.length === 0) return true;
      return filters.orderStatus.includes(order.status);
    });

    return filteredOrders.flatMap((order) =>
      order.products
        .filter((item) => item && item.product)
        .map((item) => ({
          ...item,
          orderId: order._id,
          orderStatus: order.status,
          orderedAt: order.orderedAt,
          totalPrice: order.totalPrice,
        }))
    );
  }, [orders, filters]);

  const handleNavigate = (e, href) => {
    e.preventDefault();
    window.location.href = href;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "Returned":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

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
        <PageLoader />
      ) : (
        <div className="min-h-screen bg-white text-slate-900 pt-12">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Order History
              </h1>
              <p className="text-slate-600">
                {allProductsFromOrders.length > 0
                  ? `You have ${allProductsFromOrders.length} item${
                      allProductsFromOrders.length !== 1 ? "s" : ""
                    } in your orders`
                  : "Your order history is empty"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 flex justify-end"
            >
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-all font-semibold text-slate-900"
                >
                  <ListFilter className="w-5 h-5 text-slate-600" />
                  <span className="text-sm">
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200"
              >
                <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag size={40} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  No orders found
                </h2>
                <p className="text-slate-600 mb-6">
                  Start shopping to see your orders here
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
                    className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="relative w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        <Image
                          src={
                            item?.product?.image
                              ?.replace(/\s+/g, "")
                              .replace(/[\[\]]/g, "") || "/images/lamp.jpg"
                          }
                          alt={item.product.product_name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <a
                          href={`/product/${item.product.uniq_id}`}
                          className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {item.product.product_name}
                        </a>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-2">
                          <span>
                            ₹{item.product.discounted_price.toLocaleString()}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Truck className="w-4 h-4 text-slate-400" />
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                item.orderStatus
                              )}`}
                            >
                              {item.orderStatus}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>
                              {new Date(item.orderedAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) =>
                          handleNavigate(
                            e,
                            `/profile/orders/order-details/${item.orderId}`
                          )
                        }
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm hover:shadow-md"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
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
