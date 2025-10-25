"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  IndianRupee,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Modal } from "@/components/Modals";
import toast from "react-hot-toast";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const statusConfig = {
  Processing: { icon: Truck, color: "text-blue-600", bg: "bg-blue-100" },
  Shipped: { icon: Truck, color: "text-purple-600", bg: "bg-purple-100" },
  Delivered: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  Cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
  Returned: { icon: XCircle, color: "text-orange-600", bg: "bg-orange-100" },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URI}/api/orders`, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id?.includes(searchTerm) ||
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await fetch(`${BACKEND_URI}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      toast.success("Order status updated");
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-10 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border border-slate-200 space-y-4"
            >
              <div className="space-y-2">
                <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-5 w-24 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse ml-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">Orders Management</h1>
        <p className="text-slate-600 mt-2">
          Total Orders: <span className="font-semibold">{orders.length}</span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Returned">Returned</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-600">No orders found</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-4"
        >
          <AnimatePresence>
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status]?.icon || Clock;
              const statusStyle =
                statusConfig[order.status] || statusConfig.Processing;

              return (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-semibold text-slate-600 uppercase">
                          Order #{order._id?.slice(-6)}
                        </span>
                        <span
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.color}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Customer</p>
                          <p className="font-semibold text-slate-900">
                            {order.user?.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600">Items</p>
                          <p className="font-semibold text-slate-900">
                            {order.products?.length || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600">Total</p>
                          <p className="font-semibold text-slate-900 flex items-center">
                            <IndianRupee className="w-4 h-4" />
                            {order.totalPrice?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600">Date</p>
                          <p className="font-semibold text-slate-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Eye className="w-4 h-4" />
                      View & Update
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?._id?.slice(-6)}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-slate-600 text-sm">Customer</p>
                <p className="font-semibold text-slate-900">
                  {selectedOrder.user?.name}
                </p>
                <p className="text-slate-600 text-sm">
                  {selectedOrder.user?.email}
                </p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Order Date</p>
                <p className="font-semibold text-slate-900">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Total Amount</p>
                <p className="font-semibold text-slate-900 flex items-center text-lg">
                  <IndianRupee className="w-5 h-5" />
                  {selectedOrder.totalPrice?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    statusConfig[selectedOrder.status]?.bg
                  } ${statusConfig[selectedOrder.status]?.color}`}
                >
                  {React.createElement(
                    statusConfig[selectedOrder.status]?.icon || Clock,
                    {
                      className: "w-4 h-4",
                    }
                  )}
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Products</h3>
              <div className="space-y-2">
                {selectedOrder.products?.map((product, idx) => {
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-lg flex justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {product._id}
                        </p>
                        <p className="text-sm text-slate-600">
                          Qty: {product.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        <IndianRupee className="w-4 h-4 inline" />
                        {product.product.discounted_price?.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">
                Update Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.keys(statusConfig).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(selectedOrder._id, status)}
                    disabled={updatingStatus}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedOrder.status === status
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    } disabled:opacity-50`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {selectedOrder.shippingAddress && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  Shipping Address
                </h3>
                <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state}
                  </p>
                  <p>
                    {selectedOrder.shippingAddress.postalCode},{" "}
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
