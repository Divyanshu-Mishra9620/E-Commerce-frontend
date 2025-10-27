"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const CancellationHistoryPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchCancellationHistory();
  }, [filter, page]);

  const fetchCancellationHistory = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const params = new URLSearchParams({
        limit,
        skip: page * limit,
      });

      if (filter !== "all") {
        params.append("status", filter);
      }

      const response = await fetch(
        `/api/cancellations/history/${userId}?${params}`
      );
      if (!response.ok) throw new Error("Failed to fetch cancellation history");

      const data = await response.json();
      setOrders(data.cancellations);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Cancelled":
        return "text-red-600 bg-red-50";
      case "Returned":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Cancelled":
        return <AlertCircle className="w-4 h-4" />;
      case "Returned":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto mt-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-blue-600" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8 mt-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            Cancellation & Returns
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex gap-4 flex-wrap">
            {[
              { value: "all", label: "All Orders" },
              { value: "Cancelled", label: "Cancelled" },
              { value: "Returned", label: "Returned" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(option.value);
                  setPage(0);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-12 text-center"
          >
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No Orders Found
            </h2>
            <p className="text-slate-600 mb-6">
              You don't have any {filter !== "all" ? filter.toLowerCase() : ""}{" "}
              orders yet.
            </p>
            <button
              onClick={() => router.push("/profile/orders")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              View All Orders
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <span
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        Placed on{" "}
                        {new Date(order.orderedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        ₹{order.totalPrice.toFixed(2)}
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          order.paymentStatus === "Refunded"
                            ? "text-green-600"
                            : "text-slate-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-slate-900 mb-3">
                      Items:
                    </p>
                    <div className="space-y-2">
                      {order.products.map((item, pidx) => (
                        <div
                          key={pidx}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-slate-600">
                            {item.product.product_name} x {item.quantity}
                          </span>
                          <span className="font-semibold text-slate-900">
                            ₹
                            {(
                              item.product.discounted_price * item.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">
                        Reason:
                      </p>
                      <p className="text-slate-600">
                        {order.status === "Cancelled"
                          ? order.cancellationReason
                          : order.refundReason}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">
                        {order.status === "Cancelled"
                          ? "Cancelled on:"
                          : "Returned on:"}
                      </p>
                      <p className="text-slate-600">
                        {order.status === "Cancelled"
                          ? new Date(order.cancelledAt).toLocaleDateString()
                          : new Date(order.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Your Comments:
                      </p>
                      <p className="text-blue-700">{order.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/order-details/${order._id}`)}
                      className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold py-2 px-4 rounded-lg transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/refund?orderId=${order._id}`)
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Track Refund
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                page === 0
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-slate-900 font-semibold">
              Page {page + 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={orders.length < limit}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                orders.length < limit
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancellationHistoryPage;
