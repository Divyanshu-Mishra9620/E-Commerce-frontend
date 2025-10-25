"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  ShoppingBag,
  Package,
  Truck,
} from "lucide-react";

import { InfoCard } from "./InfoCard";
import { OrderMap } from "./OrderMap";
import PageLoader from "./PageLoader";
import { OrderStatusTracker } from "./OrderStatusTracker";
import { useOrderDetail } from "@/hooks/useOrderDetail";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm py-2">
    <p className="text-slate-600 font-medium">{label}</p>
    <p className="font-semibold text-slate-900">{value}</p>
  </div>
);

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

export default function OrderDetail({ order: initialOrder, isLoading, error }) {
  const { order, mutate } = useOrderDetail(initialOrder?._id, {
    fallbackData: initialOrder,
  });
  const router = useRouter();

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Error: {error.message}
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Order not found.
      </div>
    );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900"
    >
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors mb-4"
          >
            <ArrowLeft size={20} /> Back to Orders
          </button>
          <div className="flex justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Order #{order._id.slice(-8)}
              </h1>
              <p className="text-slate-600 mt-1">
                Ordered on {formatDate(order.orderedAt)}
              </p>
            </div>
            <div
              className={`px-4 py-2 text-sm font-bold rounded-full flex items-center gap-2 border whitespace-nowrap ${getStatusColor(
                order.status
              )}`}
            >
              <Package size={16} /> {order.status}
            </div>
          </div>
        </motion.header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 20 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <OrderStatusTracker order={order} onStatusChange={mutate} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 20 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <motion.div
                    key={item.product._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-center gap-4 pb-4 border-b border-slate-200 last:border-b-0 last:pb-0"
                  >
                    <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                      <Image
                        src={
                          item.product?.image
                            ?.replace(/\s+/g, "")
                            .replace(/[\[\]]/g, "") || "/images/lamp.jpg"
                        }
                        alt={item.product.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.uniq_id}`}
                        className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block"
                      >
                        {item.product.product_name}
                      </Link>
                      <div className="flex gap-4 text-sm text-slate-600 mt-1">
                        <span className="font-semibold text-slate-900">
                          ₹{item.product.discounted_price.toLocaleString()}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        ₹
                        {(
                          item.product.discounted_price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 20 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Shipping Address
              </h2>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4">
                <p className="font-semibold text-slate-900">
                  {order.shippingAddress?.fullName}
                </p>
                <p className="text-slate-700 mt-2">
                  {order.shippingAddress?.street}
                </p>
                <p className="text-slate-700">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  - {order.shippingAddress?.postalCode}
                </p>
                <p className="text-slate-600 mt-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Estimated Delivery:{" "}
                  <span className="font-semibold">
                    {new Date(
                      new Date(order.orderedAt).getTime() +
                        7 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-IN")}
                  </span>
                </p>
              </div>
              <div className="rounded-lg overflow-hidden h-64 bg-slate-100">
                <OrderMap address={order.shippingAddress} />
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 sticky top-20"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Order Summary
              </h2>
              <div className="space-y-0 mb-5 pb-5 border-b border-slate-200">
                <DetailRow
                  label="Subtotal"
                  value={`₹${
                    order.subTotal?.toLocaleString() ||
                    order.totalPrice?.toLocaleString()
                  }`}
                />
                <DetailRow
                  label="Shipping"
                  value={`₹${order.shippingFee?.toLocaleString() || 0}`}
                />
                {order.discount > 0 && (
                  <DetailRow
                    label="Discount"
                    value={`-₹${order.discount?.toLocaleString()}`}
                  />
                )}
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{order.totalPrice?.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-sm space-y-2">
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-900">
                    Payment Method:{" "}
                  </span>
                  {order.paymentMethod}
                </p>
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-900">
                    Payment Status:{" "}
                  </span>
                  {order.isPaid ? (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Pending</span>
                  )}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 rounded-xl p-6 border border-blue-200"
            >
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Status
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                {order.status === "Delivered"
                  ? "Your order has been delivered successfully!"
                  : order.status === "Shipped"
                  ? "Your order is on its way to you."
                  : order.status === "Processing"
                  ? "We're preparing your order for shipment."
                  : "Please contact support for assistance."}
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                Contact Support
              </button>
            </motion.div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
