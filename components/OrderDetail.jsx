"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  ShoppingBag,
  Package,
} from "lucide-react";

import { InfoCard } from "./InfoCard";
import { OrderMap } from "./OrderMap";
import PageLoader from "./PageLoader";
import { OrderStatusTracker } from "./OrderStatusTracker";
import { useOrderDetail } from "@/hooks/useOrderDetail";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <p className="text-gray-600">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

export default function OrderDetail({ order: initialOrder, isLoading, error }) {
  const { order, mutate } = useOrderDetail(initialOrder?._id, {
    fallbackData: initialOrder,
  });
  const router = useRouter();
  console.log(order);

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <header className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft size={18} /> Back to Orders
          </button>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order._id.slice(-8)}
              </h1>
              <p className="text-gray-500">
                Ordered on {formatDate(order.orderedAt)}
              </p>
            </div>
            <div
              className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-2 ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <Package size={14} /> {order.status}
            </div>
          </div>
        </header>

        <main className="space-y-6">
          <OrderStatusTracker order={order} onStatusChange={mutate} />
          <InfoCard icon={ShoppingBag} title="Products">
            {order.products.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 pt-3 border-t first:border-t-0 first:pt-0"
              >
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={item.product.image || "/lamp.jpg"}
                    alt={item.product.product_name}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/product/${item.product.uniq_id}`}
                    className="font-medium text-gray-800 hover:text-blue-600 line-clamp-1"
                  >
                    {item.product.product_name}
                  </Link>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">
                  ₹{(item.product.discounted_price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </InfoCard>

          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard icon={MapPin} title="Shipping Address">
              <p className="text-sm text-gray-700">
                {order.shippingAddress.street}
              </p>
              <p className="text-sm text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.postalCode}
              </p>
              <div className="mt-4">
                <OrderMap orderId={order._id} />
              </div>
            </InfoCard>

            <InfoCard icon={CreditCard} title="Payment Summary">
              <DetailRow
                label="Subtotal"
                value={`₹${order.totalPrice.toFixed(2)}`}
              />
              <DetailRow label="Tax" value={"Included"} />
              <DetailRow label="Discount" value={`- ₹0.00`} />
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-md font-semibold">
                  <p>Total</p>
                  <p className="text-blue-600">
                    ₹{order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>
        </main>
      </div>
    </div>
  );
}
