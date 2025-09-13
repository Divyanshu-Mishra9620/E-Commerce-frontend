"use client";

import { Check, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { authedFetch } from "@/utils/authedFetch";

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    duration: 1,
    price: 299,
    features: ["1 product listing", "Basic analytics", "Email support"],
  },
  {
    id: "pro",
    name: "Pro Plan",
    duration: 6,
    price: 1499,
    features: ["10 product listings", "Advanced analytics", "Priority support"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium Plan",
    duration: 12,
    price: 2599,
    features: ["Unlimited listings", "24/7 support", "API access"],
  },
];

export default function PaymentSubPage() {
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin?callbackUrl=/paymentSub");
    },
  });

  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan) return toast.error("Please select a plan.");
    setIsLoading(true);

    try {
      const res = await authedFetch("/api/payments/create-subscription", {
        method: "POST",
        body: {
          amount: selectedPlan.price * 100,
          duration: selectedPlan.duration,
          planId: selectedPlan.id,
        },
      });

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Elysoria Subscription",
        description: selectedPlan.name,
        order_id: order.id,
        prefill: {
          name: session.user.name,
          email: session.user.email,
        },
        handler: async (paymentResponse) => {
          setIsLoading(true);
          try {
            await authedFetch("/api/payments/verify-subscription", {
              method: "POST",
              body: {
                ...paymentResponse,
                planId: selectedPlan.id,
                duration: selectedPlan.duration,
                user: session?.user,
              },
            });

            toast.success("Subscription successful!");
            router.push("/sell");
          } catch (error) {
            toast.error(error.message);
            setError(error.message);
          } finally {
            setIsLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (res) =>
        toast.error(`Payment failed: ${res.error.description}`)
      );
      rzp.open();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const calculateSavings = (plan) => {
    if (plan.duration === 1) return 0;
    const monthlyPrice = plan.price / plan.duration;
    const basicMonthly = subscriptionPlans[0].price;
    return Math.round(((basicMonthly - monthlyPrice) / basicMonthly) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full mb-4 text-sm font-medium">
              Premium Access
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Choose Your Plan
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unlock premium features to boost your sales. Select the plan that
              fits your business needs.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => {
              const savings = calculateSavings(plan);
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border p-6 transition-all duration-300 flex flex-col h-full ${
                    selectedPlan?.id === plan.id
                      ? "border-indigo-500 shadow-lg shadow-indigo-100"
                      : "border-gray-200 hover:border-gray-300 bg-white"
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
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <div className="flex items-end">
                        <span className="text-3xl font-bold text-gray-900">
                          ₹{plan.price}
                        </span>
                        <span className="text-gray-500 ml-1">
                          /{" "}
                          {plan.duration === 1
                            ? "month"
                            : `${plan.duration} months`}
                        </span>
                      </div>
                      {savings > 0 && (
                        <p className="text-green-600 text-sm mt-1">
                          Only ₹{(plan.price / plan.duration).toFixed(2)}/month
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-gray-600 text-sm"
                        >
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="ml-2">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      selectedPlan?.id === plan.id
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
                  </button>
                </div>
              );
            })}
          </div>

          {selectedPlan && (
            <div className="mt-12 bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Your Selection
                  </h3>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedPlan.name}
                      </p>
                      <p className="text-gray-600">
                        ₹{selectedPlan.price} for {selectedPlan.duration}{" "}
                        {selectedPlan.duration === 1 ? "month" : "months"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-12 text-center">
                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="px-10 py-4 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:bg-gray-300"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      `Pay ₹${selectedPlan.price}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              All plans include a 14-day money-back guarantee. Cancel anytime.
            </p>
            <p className="mt-2">
              Need help choosing?{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
