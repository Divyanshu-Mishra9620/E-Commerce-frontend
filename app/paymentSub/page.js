"use client";
import { MoveLeft, User, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function PaymentSubPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const router = useRouter();

  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic Plan",
      duration: 1,
      price: 299,
      features: ["1 product listing", "Basic analytics", "Email support"],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro Plan",
      duration: 6,
      price: 1499,
      features: [
        "10 product listings",
        "Advanced analytics",
        "Priority support",
        "Custom domain",
      ],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium Plan",
      duration: 12,
      price: 2599,
      features: [
        "Unlimited listings",
        "Advanced analytics",
        "24/7 support",
        "Custom domain",
        "API access",
      ],
      popular: false,
    },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) router.push("/api/auth/signin");
    setUser(JSON.parse(storedUser));
  }, [router]);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (document.getElementById("rzp-script")) {
          setRazorpayLoaded(true);
          return resolve();
        }

        const script = document.createElement("script");
        script.id = "rzp-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError("Please select a subscription plan");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to continue");
      }

      const response = await fetch(
        `${BACKEND_URI}/api/payments/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: selectedPlan.price * 100,
            duration: selectedPlan.duration,
            planId: selectedPlan.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initiate payment");
      }

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Elysoria",
        description: `${selectedPlan.name} Subscription`,
        order_id: order.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#6366f1",
        },
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              `${BACKEND_URI}/api/payments/verify-subscription`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  planId: selectedPlan.id,
                  duration: selectedPlan.duration,
                  user: user,
                  startDate: startDate,
                  endDate: endDate,
                }),
              }
            );

            const result = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(result.message || "Payment verification failed");
            }

            localStorage.setItem("user", JSON.stringify(user));
            router.push("/sell");
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
    } finally {
      setIsLoading(false);
    }
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handlePlan = (plan) => {
    const start = new Date();
    const end = new Date(
      start.getFullYear(),
      start.getMonth() + plan.duration + 1,
      0
    );

    setStartDate(start);
    setEndDate(end);
    setSelectedPlan(plan);
  };

  const calculateSavings = (plan) => {
    if (plan.duration === 1) return 0;
    const monthlyPrice = plan.price / plan.duration;
    const basicMonthly = subscriptionPlans[0].price;
    return Math.round(((basicMonthly - monthlyPrice) / basicMonthly) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900 bg-opacity-90 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Go back"
            >
              <MoveLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>

          <Link
            href="/profile"
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="User profile"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-indigo-900/30 text-indigo-300 px-4 py-1 rounded-full mb-4 text-sm">
              Premium Access
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Unlock premium features to boost your sales. Select the plan that
              fits your business needs.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-100 p-4 rounded-lg mb-8 text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => {
              const savings = calculateSavings(plan);
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border p-6 transition-all duration-300 flex flex-col h-full ${
                    selectedPlan?.id === plan.id
                      ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                      : "border-gray-800 hover:border-gray-600"
                  } ${plan.popular ? "ring-2 ring-indigo-500" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}

                  {savings > 0 && (
                    <div className="absolute -top-3 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Save {savings}%
                    </div>
                  )}

                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <div className="flex items-end">
                        <span className="text-3xl font-bold">
                          ₹{plan.price}
                        </span>
                        <span className="text-gray-400 ml-1">
                          /{" "}
                          {plan.duration === 1
                            ? "month"
                            : `${plan.duration} months`}
                        </span>
                      </div>
                      {savings > 0 && (
                        <p className="text-green-400 text-sm mt-1">
                          Only ₹{(plan.price / plan.duration).toFixed(2)}/month
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-gray-300 text-sm"
                        >
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="ml-2">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePlan(plan)}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      selectedPlan?.id === plan.id
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Selected Plan Summary */}
          {selectedPlan && (
            <div className="mt-12 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Your Selection</h3>
                  <div className="flex items-center">
                    <div className="bg-indigo-900/30 p-3 rounded-lg mr-4">
                      <div className="bg-indigo-500 w-10 h-10 rounded-lg flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{selectedPlan.name}</p>
                      <p className="text-gray-400">
                        ₹{selectedPlan.price} for {selectedPlan.duration}{" "}
                        {selectedPlan.duration === 1 ? "month" : "months"}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={isLoading || !razorpayLoaded}
                  className={`mt-4 md:mt-0 px-8 py-3.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    isLoading || !razorpayLoaded
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : !razorpayLoaded ? (
                    "Loading Payment..."
                  ) : (
                    `Pay ₹${selectedPlan.price}`
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              All plans include a 14-day money-back guarantee. Cancel anytime.
            </p>
            <p className="mt-2">
              Need help choosing?{" "}
              <a href="#" className="text-indigo-400 hover:text-indigo-300">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
