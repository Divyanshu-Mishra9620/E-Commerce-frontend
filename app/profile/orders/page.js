"use client";
import Link from "next/link";
import { ListFilter, Menu, MoveLeft, User } from "lucide-react";
import React, { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import "@/app/_styles/global.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import withAuth from "@/components/withAuth";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const Orders = () => {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ orderStatus: [] });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

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
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user?._id) {
        throw new Error("User not found");
      }
      try {
        const response = await fetch(`${BACKEND_URI}/api/orders/${user._id}`);

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
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      setIsScrolled(scrollY > 1);
      setIsBottomNavVisible(scrollY + windowHeight < fullHeight - 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-bold">
        Loading Orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-bold text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white bg-opacity-90 backdrop-blur-lg shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-700">
              <MoveLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Your Orders</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={isLoggedIn ? "/profile" : "/login"}
              className="text-gray-700"
            >
              <User className="w-6 h-6" />
            </Link>
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-gray-50 min-h-screen pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Order History</h2>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ListFilter className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  Filter
                </span>
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Filters</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Order Status
                        </label>
                        <div className="flex flex-col space-y-2">
                          {["Ordered", "Delivered", "Cancelled"].map(
                            (status) => (
                              <button
                                key={status}
                                onClick={() => handleFilterChange(status)}
                                className={`w-full px-4 py-2 text-sm text-left rounded-lg ${
                                  filters.orderStatus.includes(status)
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {status}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                      <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 text-sm text-center bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-gray-600">No orders found.</p>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Order #{order._id}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Ordered"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {order.products.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-16 h-16 relative">
                          <Image
                            src={
                              item.product.image
                                .replace(/\s+/g, "")
                                .replace(/[\[\]]/g, "") || "/lamp.jpg"
                            }
                            alt={item.product.product_name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {item.product.product_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹{item.product.discounted_price} x {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          ₹
                          {(
                            parseFloat(item.product.discounted_price) *
                            item.quantity
                          ).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">
                      Total: ₹{order.totalPrice}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNavigation visible={isBottomNavVisible} />
    </>
  );
};

export default withAuth(Orders);
