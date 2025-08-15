"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { authedFetch } from "@/utils/authedFetch";

import { AddressForm } from "@/components/AddressForm";
import { OrderSummary } from "@/components/OrderSummary";
import CyberLoader from "@/components/CyberLoader";

export default function PaymentPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const {
    profile,
    isLoading: isProfileLoading,
    mutate: mutateProfile,
  } = useUserProfile();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (profile?.address) {
      setAddress(profile.address);
    }
  }, [profile]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (Object.values(address).some((field) => !field)) {
      return toast.error("Please fill in all address fields.");
    }
    if (cartItems.length === 0) {
      return toast.error("Your cart is empty.");
    }

    setIsProcessing(true);
    try {
      const { order: internalOrder } = await authedFetch(
        `/api/orders/${user._id}`,
        {
          method: "POST",
          body: {
            cartItems,
            shippingAddress: address,
            paymentMethod: "UPI",
          },
        }
      );

      const razorpayOrder = await authedFetch(`/api/payments/create-order`, {
        method: "POST",
        body: {
          orderId: internalOrder._id,
          amount: internalOrder.totalPrice,
          user,
        },
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: razorpayOrder.order.amount,
        currency: "INR",
        name: "Elysoria",
        order_id: razorpayOrder.order.id,
        prefill: { name: user.name, email: user.email },
        handler: async (response) => {
          await authedFetch(`/api/payments/verify`, {
            method: "POST",
            body: {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            },
          });
          toast.success("Payment successful! Your order has been placed.");
          clearCart();
          router.push(`/profile/orders`);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProfileLoading || !user) {
    return <CyberLoader />;
  }

  if (authLoading)
    return (
      <div className="min-h-screen bg-gray-50">
        <CyberLoader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <AddressForm address={address} setAddress={setAddress} />
          </div>
          <div className="space-y-8">
            <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
            <button
              onClick={handlePayment}
              disabled={isProcessing || cartItems.length === 0}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="animate-spin" />
              ) : (
                `Pay ₹${cartTotal.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
