"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useCancellationReturn } from "@/hooks/useCancellationReturn";
import Navbar from "@/components/Navbar";

const CancelOrderPage = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const { getCancellationDetails, requestCancellation } =
    useCancellationReturn();

  const [order, setOrder] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [cancellationReasons, setCancellationReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [comments, setComments] = useState("");
  const [step, setStep] = useState("confirm");
  const [cancelationResult, setCancellationResult] = useState(null);

  useEffect(() => {
    fetchCancellationDetails();
  }, [orderId]);

  const fetchCancellationDetails = async () => {
    try {
      const data = await getCancellationDetails(orderId);
      setOrder(data.order);
      setEligibility(data.eligibility);
      setCancellationReasons(data.cancellationReasons || []);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCancellation = async () => {
    if (!selectedReason) {
      alert("Please select a cancellation reason");
      return;
    }

    setSubmitting(true);
    try {
      const data = await requestCancellation(orderId, selectedReason, comments);
      setCancellationResult(data);
      setStep("confirmation");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.message || "Failed to cancel order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  if (!order || !eligibility) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Unable to Load Order
            </h2>
            <p className="text-slate-600 mb-6">
              We couldn't find the order details. Please try again.
            </p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!eligibility.canCancel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 mt-12 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center"
          >
            <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Cannot Cancel Order
            </h2>
            <p className="text-slate-600 mb-4">
              Orders with status "{order.status}" cannot be cancelled.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Please check our returns policy for eligible orders.
            </p>
            <button
              onClick={() => router.push("/profile/orders")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              View Orders
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  if (step === "confirmation" && cancelationResult) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 mt-12">
          <div className="max-w-2xl mx-auto mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2">
                  Cancellation Confirmed
                </h1>
                <p className="text-green-100">
                  Your order cancellation has been processed
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Order ID</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {order._id}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                    <p className="text-lg font-semibold text-slate-900">
                      ₹{order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">
                      Cancellation Reason
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedReason}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">
                      Current Status
                    </p>
                    <p className="text-lg font-semibold text-red-600">
                      {cancelationResult.order.status}
                    </p>
                  </div>
                </div>

                {cancelationResult.refund && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-blue-900 mb-4">
                      Refund Information
                    </h3>
                    {cancelationResult.refund.status === "failed" ? (
                      <div className="text-red-600">
                        <p className="mb-2">Refund Processing: Failed</p>
                        <p className="text-sm">
                          {cancelationResult.refund.error}
                        </p>
                        <p className="text-sm mt-2">
                          Our team will process your refund manually within 5-7
                          business days.
                        </p>
                      </div>
                    ) : (
                      <div className="text-blue-900">
                        <p className="mb-2">
                          <span className="font-semibold">Refund ID:</span>{" "}
                          {cancelationResult.refund.refundId}
                        </p>
                        <p className="mb-2">
                          <span className="font-semibold">Amount:</span> ₹
                          {cancelationResult.refund.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-blue-700">
                          ⏱️ Refund will be credited to your account within 3-5
                          business days.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-slate-900">
                    What Happens Next
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        step: 1,
                        title: "Cancellation Confirmed",
                        desc: "Your order has been cancelled",
                      },
                      {
                        step: 2,
                        title: "Refund Initiated",
                        desc: "Refund process has started",
                      },
                      {
                        step: 3,
                        title: "Refund Processing",
                        desc: "3-5 business days",
                      },
                      {
                        step: 4,
                        title: "Money Refunded",
                        desc: "Amount credited to your account",
                      },
                    ].map((item, idx) => (
                      <div key={`step-${item.step}`} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                            {item.step}
                          </div>
                          {idx < 3 && (
                            <div className="w-1 h-8 bg-green-200 mt-2" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-sm text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push("/profile/orders")}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                  >
                    View All Orders
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold py-3 px-6 rounded-lg transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 mt-12">
        <div className="max-w-4xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Cancel Order</h1>
              <p className="text-orange-100">
                We're sorry to see you go. Please let us know why you want to
                cancel this order.
              </p>
            </div>

            <div className="p-8">
              <div className="bg-slate-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Order Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Order ID</p>
                    <p className="font-semibold text-slate-900">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Status</p>
                    <p className="font-semibold text-slate-900">
                      {order.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Amount</p>
                    <p className="font-semibold text-slate-900">
                      ₹{order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {order.products.map((item, idx) => (
                    <div
                      key={`product-${item.product._id}`}
                      className="flex justify-between items-center text-sm"
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

              {eligibility && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex gap-4">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      {eligibility.daysOld} days since order placed
                    </p>
                    <p className="text-sm text-blue-700">
                      {eligibility.daysOld <= 7
                        ? "You can cancel this order. Action required within " +
                          (7 - eligibility.daysOld) +
                          " days."
                        : "Cancellation window has expired. You can request a return instead."}
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="block text-lg font-semibold text-slate-900 mb-4">
                  Why are you cancelling this order?
                </div>
                <div className="space-y-3">
                  {cancellationReasons && cancellationReasons.length > 0 ? (
                    cancellationReasons.map((reason) => (
                      <motion.label
                        key={`reason-${reason.replaceAll(/\s+/g, "-")}`}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedReason === reason
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reason}
                          checked={selectedReason === reason}
                          onChange={(e) => setSelectedReason(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3 text-slate-900 font-medium">
                          {reason}
                        </span>
                      </motion.label>
                    ))
                  ) : (
                    <p className="text-slate-600">
                      No cancellation reasons available
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <div className="block text-lg font-semibold text-slate-900 mb-2">
                  Additional Comments (Optional)
                </div>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Please share any additional feedback..."
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.back()}
                  className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold py-3 px-6 rounded-lg transition"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleSubmitCancellation}
                  disabled={submitting || !selectedReason}
                  className={`flex-1 font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 ${
                    submitting || !selectedReason
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CancelOrderPage;
