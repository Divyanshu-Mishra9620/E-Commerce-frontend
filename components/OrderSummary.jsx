"use client";
import Image from "next/image";

export function OrderSummary({ cartItems, cartTotal }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Order Summary
      </h2>
      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div key={item.product._id} className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
              <Image
                src={item.product.image || "/lamp.jpg"}
                alt={item.product.product_name}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 line-clamp-1">
                {item.product.product_name}
              </p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold">
              ₹{(item.product.discounted_price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="pt-6 mt-6 border-t border-gray-200">
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-blue-600">
            ₹{cartTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
