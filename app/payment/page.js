"use client";
import { Menu, MoveLeft, User } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "@/app/_styles/global.css";
import dotenv from "dotenv";
dotenv.config();

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function PaymentPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [products, setProducts] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [hasFetchedAddress, setHasFetchedAddress] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URI}/api/users/email/${user.email}`
        );
        const data = await response.json();
        if (data.address) {
          setAddress(data.address);
          setHasFetchedAddress(true);
        }
      } catch (error) {
        console.error("Error fetching user address:", error);
      }
    };

    if (user?.email && !hasFetchedAddress) {
      fetchUserAddress();
    }
  }, [user, hasFetchedAddress]);

  const saveAddress = async () => {
    try {
      const response = await fetch(`${BACKEND_URI}/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }
      setHasFetchedAddress(false);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  useEffect(() => {
    const loadRazorpayScript = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    };

    loadRazorpayScript();

    return () => {
      const script = document.querySelector(
        "script[src='https://checkout.razorpay.com/v1/checkout.js']"
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setProducts(cartItems);
  }, []);

  const calculateTotal = () => {
    return products.reduce(
      (total, item) =>
        total + (+item.product.discounted_price || 799) * item.quantity,
      0
    );
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validatePaymentForm = () => {
    const newErrors = {};

    if (!address.street) newErrors.street = "Street is required";
    if (!address.city) newErrors.city = "City is required";
    if (!address.state) newErrors.state = "State is required";
    if (!address.country) newErrors.country = "Country is required";
    if (!address.postalCode) newErrors.postalCode = "Postal Code is required";
    if (!/^\d{6}$/.test(address.postalCode)) {
      newErrors.postalCode = "Invalid postal code format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!validatePaymentForm()) {
        throw new Error("Please fill in all required fields correctly.");
      }

      await saveAddress();

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to continue");
      }

      const orderResponse = await fetch(
        `${BACKEND_URI}/api/orders/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            products,
            shippingAddress: address,
            paymentMethod: "UPI",
            user,
          }),
        }
      );

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const order = await orderResponse.json();

      const paymentResponse = await fetch(
        `${BACKEND_URI}/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: order.order._id,
            amount: order.order.totalPrice,
          }),
        }
      );

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || "Failed to initiate payment");
      }

      const paymentData = await paymentResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: paymentData.order.amount,
        currency: paymentData.order.currency,
        order_id: paymentData.order.id,
        name: "ShopEase",
        description: `Order #${order.order._id}`,
        image: "/lamp.png",
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#222",
        },
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              `${BACKEND_URI}/api/payments/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              }
            );

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            localStorage.removeItem("cart");

            window.location.href = `/profile/orders`;
          } catch (error) {
            setError(error.message);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setError(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      setError(error.message);
      console.error("Payment Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900 bg-opacity-90 backdrop-blur-lg shadow-md"
            : "bg-black"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-gray-300 hover:text-gray-100"
            >
              <MoveLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-100">Payment</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={isLoggedIn ? "/profile" : "/api/auth/signin"}
              className="text-gray-300 hover:text-gray-100"
            >
              <User className="w-6 h-6" />
            </Link>
            <button className="md:hidden text-gray-300 hover:text-gray-100">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-black min-h-screen pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800">
            <h1 className="text-2xl font-bold text-gray-100 mb-6">
              Payment Details
            </h1>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-200 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                {products.length === 0 ? (
                  <p className="text-center text-gray-500">
                    Your cart is empty.
                  </p>
                ) : (
                  products.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="w-16 h-16 relative">
                        <Image
                          src={
                            item.product.image
                              .replace(/\s+/g, "")
                              .replace(/[\[\]]/g, "") || "/default-product.jpg"
                          }
                          alt={item.product.product_name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 ml-4">
                        <p className="text-sm font-medium text-gray-200">
                          {item.product.product_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ₹{item.product.discounted_price} x {item.quantity}
                        </p>
                      </div>

                      <div className="text-sm font-semibold text-gray-200">
                        ₹
                        {(
                          (+item.product.discounted_price || 799) *
                          item.quantity
                        ).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-200">Total:</p>
                  <p className="text-lg font-bold text-gray-100">
                    ₹{calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-200">
                Shipping Address
              </h2>
              <button
                onClick={() => setHasFetchedAddress(false)}
                className="mt-4 bg-gray-800 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Reset Address
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Street
                </label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="Enter street address"
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-lg border ${
                    errors.street ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-gray-600`}
                />
                {errors.street && (
                  <p className="text-sm text-red-500 mt-1">{errors.street}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="Enter city"
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-lg border ${
                    errors.city ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-gray-600`}
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="Enter state"
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-lg border ${
                    errors.state ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-gray-600`}
                />
                {errors.state && (
                  <p className="text-sm text-red-500 mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                  placeholder="Enter country"
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-lg border ${
                    errors.country ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-gray-600`}
                />
                {errors.country && (
                  <p className="text-sm text-red-500 mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleAddressChange}
                  placeholder="Enter postal code"
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-lg border ${
                    errors.postalCode ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-gray-600`}
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>

              <hr className="border-gray-800 my-6" />

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(e.target.value.replace(/\s/g, ""))
                  }
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-lg border ${
                    errors.cardNumber ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-gray-600`}
                  maxLength={16}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Expiry Date (MM/YY)
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-lg border ${
                    errors.expiryDate ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-gray-600`}
                  maxLength={5}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-lg border ${
                    errors.cvv ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-gray-600`}
                  maxLength={3}
                />
                {errors.cvv && (
                  <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>
                )}
              </div>

              <div className="mt-6">
                {error && (
                  <div className="text-red-500 mb-4 text-center">{error}</div>
                )}
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className={`w-full ${
                    isLoading ? "bg-gray-500" : "bg-gray-700 hover:bg-gray-600"
                  } text-gray-100 py-3 rounded-lg transition-colors`}
                >
                  {isLoading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
