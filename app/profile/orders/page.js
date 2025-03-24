"use client";
import { ListFilter, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import "@/app/_styles/global.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import withAuth from "@/components/withAuth";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const Orders = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ orderStatus: [] });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const timerRef = useRef();
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(timerRef.current);
  }, []);

  const router = useRouter();
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.push("/api/auth/signin");
      }
    }
  }, [router]);
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await fetch(`${BACKEND_URI}/api/orders/${user?._id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleFilterChange = (status) => {
    setFilters((prevFilters) => {
      const updatedStatuses = prevFilters.orderStatus.includes(status)
        ? prevFilters.orderStatus.filter((s) => s !== status)
        : [...prevFilters.orderStatus, status];
      return { ...prevFilters, orderStatus: updatedStatuses };
    });
  };

  const clearFilters = () => {
    setFilters({ orderStatus: [] });
  };

  const filteredOrders = filters.orderStatus.length
    ? orders.filter((order) => filters.orderStatus.includes(order.status))
    : orders;

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-bold text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {showLoader || loading ? (
        <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
          <Image
            src="/underConstruction.gif"
            alt="Loading..."
            width={200}
            height={200}
            priority
            unoptimized
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gray-800 opacity-30 mix-blend-multiply" />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 mt-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                Order History
              </h1>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-all"
                >
                  <ListFilter className="w-5 h-5 text-gray-300" />
                  <span className="text-sm font-medium text-gray-300">
                    {filters.orderStatus.length
                      ? `Filters (${filters.orderStatus.length})`
                      : "Filters"}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Filters</h3>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="p-1 hover:bg-gray-700 rounded-lg"
                          >
                            <X className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Order Status
                            </label>
                            <div className="flex flex-col space-y-2">
                              {["Ordered", "Delivered", "Cancelled"].map(
                                (status) => (
                                  <button
                                    key={status}
                                    onClick={() => handleFilterChange(status)}
                                    className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-left rounded-lg transition-colors ${
                                      filters.orderStatus.includes(status)
                                        ? "bg-gray-700 text-gray-100"
                                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                                    }`}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded border ${
                                        filters.orderStatus.includes(status)
                                          ? "bg-blue-500 border-blue-500"
                                          : "bg-transparent border-gray-500"
                                      }`}
                                    />
                                    {status}
                                  </button>
                                )
                              )}
                            </div>
                          </div>

                          <button
                            onClick={clearFilters}
                            className="w-full px-4 py-2 text-sm text-center bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/40"
                          >
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {loading ? (
              <div className="grid gap-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-800 rounded-xl p-6 animate-pulse"
                  >
                    <div className="flex justify-between mb-4">
                      <div className="h-6 bg-gray-700 rounded w-1/4" />
                      <div className="h-6 bg-gray-700 rounded w-1/6" />
                    </div>
                    <div className="space-y-4">
                      <div className="h-16 bg-gray-700 rounded-lg" />
                      <div className="h-16 bg-gray-700 rounded-lg" />
                    </div>
                    <div className="h-6 bg-gray-700 rounded w-1/5 mt-4" />
                  </motion.div>
                ))}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-red-400"
              >
                Error loading orders: {error}
              </motion.div>
            ) : filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">📦</div>
                  <h2 className="text-xl font-semibold mb-2">
                    No orders found
                  </h2>
                  <p className="text-gray-400">
                    {filters.orderStatus.length
                      ? "Try adjusting your filters"
                      : "Your order history will appear here"}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-6"
              >
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-200">
                          Order #{order._id.slice(-8)}
                        </h2>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-900/30 text-green-400"
                            : order.status === "Ordered"
                            ? "bg-blue-900/30 text-blue-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-4 mb-6">
                      {order.products.map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-4 p-4 bg-gray-700/20 rounded-lg"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={
                                item.product.image
                                  ?.replace(/\s+/g, "")
                                  .replace(/[\[\]]/g, "") || "/lamp.jpg"
                              }
                              alt={item.product.product_name}
                              fill
                              className="rounded-lg object-cover"
                              loading="lazy"
                              placeholder="blur"
                              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-200 line-clamp-1">
                              {item.product.product_name}
                            </h3>
                            <p className="text-xs text-gray-400">
                              ₹{item.product.discounted_price} × {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-semibold text-gray-200">
                            ₹
                            {(
                              (+item.product.discounted_price || 799) *
                              item.quantity
                            ).toFixed(2)}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Total</span>
                        <span className="text-lg font-semibold text-gray-100">
                          ₹{order.totalPrice}
                        </span>
                      </div>
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
