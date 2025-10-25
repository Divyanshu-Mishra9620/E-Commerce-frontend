"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Loader2,
  MapPin,
  Package,
  Truck,
  CreditCard,
  Lock,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { authedFetch } from "@/utils/authedFetch";

import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { cartItems, clearCart } = useCart();
  const {
    profile,
    isLoading: isProfileLoading,
    mutate: mutateProfile,
  } = useUserProfile();

  const [activeStep, setActiveStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    phoneNumber: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("Razorpay");

  const checkoutItems = useMemo(() => {
    const productId = searchParams.get("productId");
    const quantity = searchParams.get("quantity");

    if (productId && quantity) {
      const item = cartItems.find((item) => item.product._id === productId);
      if (item) {
        return [{ ...item, quantity: parseInt(quantity) || item.quantity }];
      }
    }
    return cartItems;
  }, [cartItems, searchParams]);

  useEffect(() => {
    if (profile?.addresses && profile.addresses.length > 0) {
      const defaultAddress =
        profile.addresses.find((a) => a.isDefault) || profile.addresses[0];
      setAddress({
        fullName: defaultAddress.fullName || "",
        street: defaultAddress.street || "",
        city: defaultAddress.city || "",
        state: defaultAddress.state || "",
        country: defaultAddress.country || "India",
        postalCode: defaultAddress.postalCode || "",
        phoneNumber: defaultAddress.phoneNumber || "",
      });
    } else if (profile?.address) {
      setAddress({
        fullName: profile.address.fullName || user?.name || "",
        street: profile.address.street || "",
        city: profile.address.city || "",
        state: profile.address.state || "",
        country: profile.address.country || "India",
        postalCode: profile.address.postalCode || "",
        phoneNumber: profile.address.phoneNumber || user?.phoneNumber || "",
      });
    }
  }, [profile, user]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  const itemsSubtotal = useMemo(() => {
    return (
      checkoutItems?.reduce((sum, item) => {
        return sum + (item.product?.discounted_price || 0) * item.quantity;
      }, 0) || 0
    );
  }, [checkoutItems]);

  const estimatedTax = useMemo(() => {
    return itemsSubtotal * 0.1;
  }, [itemsSubtotal]);

  const estimatedShipping = useMemo(() => {
    return itemsSubtotal > 500 ? 0 : 50;
  }, [itemsSubtotal]);

  const finalTotal = useMemo(() => {
    return itemsSubtotal + estimatedTax + estimatedShipping;
  }, [itemsSubtotal, estimatedTax, estimatedShipping]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

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
            cartItems: checkoutItems,
            shippingAddress: address,
            paymentMethod: selectedPaymentMethod,
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

      const rzp = new globalThis.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProfileLoading || !user) {
    return <PageLoader />;
  }

  if (authLoading)
    return (
      <div className="min-h-screen bg-slate-50">
        <PageLoader />
      </div>
    );

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-24">
          <div className="w-full flex items-center justify-center">
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Your Cart is Empty
              </h2>
              <p className="text-slate-600 mb-6">
                Add items to your cart before proceeding to checkout.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                onClick={() => router.push("/")}
              >
                Continue Shopping
              </motion.button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-24">
        <div className="w-full bg-white border-b border-slate-200 sticky top-24 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              {[
                { step: 1, title: "Address" },
                { step: 2, title: "Payment" },
                { step: 3, title: "Confirmation" },
              ].map((item) => (
                <div key={item.step} className="flex items-center">
                  <motion.div
                    animate={{
                      scale: activeStep >= item.step ? 1 : 0.8,
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
                      activeStep >= item.step
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {activeStep > item.step ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      item.step
                    )}
                  </motion.div>
                  <span
                    className={`ml-3 font-medium ${
                      activeStep >= item.step
                        ? "text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.step < 3 && (
                    <div
                      className={`w-12 h-1 mx-4 rounded-full transition-all ${
                        activeStep > item.step ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Shipping Address
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          Full Name *
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          value={address.fullName}
                          onChange={handleAddressChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          Phone Number *
                        </label>
                        <input
                          id="phoneNumber"
                          type="tel"
                          name="phoneNumber"
                          value={address.phoneNumber}
                          onChange={handleAddressChange}
                          placeholder="9876543210"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="street"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                      >
                        Street Address *
                      </label>
                      <input
                        id="street"
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleAddressChange}
                        placeholder="123 Main Street, Apt 4B"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          City *
                        </label>
                        <input
                          id="city"
                          type="text"
                          name="city"
                          value={address.city}
                          onChange={handleAddressChange}
                          placeholder="Mumbai"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          State *
                        </label>
                        <input
                          id="state"
                          type="text"
                          name="state"
                          value={address.state}
                          onChange={handleAddressChange}
                          placeholder="Maharashtra"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="postalCode"
                          className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          Postal Code *
                        </label>
                        <input
                          id="postalCode"
                          type="text"
                          name="postalCode"
                          value={address.postalCode}
                          onChange={handleAddressChange}
                          placeholder="400001"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          Country *
                        </label>
                        <input
                          id="country"
                          type="text"
                          name="country"
                          value={address.country}
                          onChange={handleAddressChange}
                          placeholder="India"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <label
                      className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all hover:bg-blue-50"
                      style={{
                        borderColor:
                          selectedPaymentMethod === "Razorpay"
                            ? "#3B82F6"
                            : undefined,
                        backgroundColor:
                          selectedPaymentMethod === "Razorpay"
                            ? "#EFF6FF"
                            : undefined,
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="Razorpay"
                        checked={selectedPaymentMethod === "Razorpay"}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <span className="ml-3 font-semibold text-slate-900">
                        Credit/Debit Card, UPI, Wallet
                      </span>
                      <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                        Recommended
                      </span>
                    </label>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      Your payment is secure and encrypted. We use
                      industry-standard SSL technology to protect your
                      information.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 flex items-start gap-4"
                >
                  <Truck className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      Estimated Delivery
                    </h3>
                    <p className="text-sm text-green-800">
                      Your order will be delivered in 5-7 business days. Free
                      shipping on orders over ₹500.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="sticky top-80 space-y-4"
                >
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Summary
                    </h3>

                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2 mb-6 pb-6 border-b border-slate-200">
                      {checkoutItems.map((item, index) => (
                        <motion.div
                          key={item.product._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                            <img
                              src={
                                item.product.image?.replaceAll(
                                  /\s+|[[\]]/g,
                                  ""
                                ) || "/lamp.jpg"
                              }
                              alt={item.product.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 line-clamp-1">
                              {item.product.product_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 flex-shrink-0">
                            ₹
                            {(
                              item.product.discounted_price * item.quantity
                            ).toLocaleString("en-IN")}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-semibold text-slate-900">
                          ₹
                          {itemsSubtotal.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">
                          Estimated Tax (10%)
                        </span>
                        <span className="font-semibold text-slate-900">
                          ₹
                          {estimatedTax.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Shipping</span>
                        <span className="font-semibold text-slate-900">
                          {estimatedShipping === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `₹${estimatedShipping.toLocaleString("en-IN")}`
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                      <span className="text-lg font-semibold text-slate-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹
                        {finalTotal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Pay ₹
                          {finalTotal.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </>
                      )}
                    </motion.button>

                    <p className="text-xs text-center text-slate-500 mt-4">
                      🔒 Secure payment powered by Razorpay
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-600 space-y-2">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>SSL Encrypted & Secure</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Easy Returns & Refunds</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>24/7 Customer Support</span>
                      </div>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
