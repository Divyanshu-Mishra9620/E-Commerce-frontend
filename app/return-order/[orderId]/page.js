"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Package, Loader2 } from "lucide-react";
import { useCancellationReturn } from "@/hooks/useCancellationReturn";
import Navbar from "@/components/Navbar";

const ReturnOrderPage = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const { getCancellationDetails, requestReturn } = useCancellationReturn();

  const [order, setOrder] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [returnReasons, setReturnReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [comments, setComments] = useState("");
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [step, setStep] = useState("confirm");
  const [returnResult, setReturnResult] = useState(null);

  useEffect(() => {
    fetchCancellationDetails();
  }, [orderId]);

  const fetchCancellationDetails = async () => {
    try {
      const data = await getCancellationDetails(orderId);
      setOrder(data.order);
      setEligibility(data.eligibility);
      setReturnReasons(data.returnReasons || []);
      setSelectedItems(new Set(data.order.products.map((_, idx) => idx)));
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (index) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const getReturnItems = () => {
    return order.products
      .map((product, idx) => ({
        product: product.product._id,
        quantity: product.quantity,
      }))
      .filter((_, idx) => selectedItems.has(idx));
  };

  const getReturnAmount = () => {
    return order.products
      .map(
        (product, idx) =>
          (product.product.discounted_price || 0) * product.quantity
      )
      .reduce(
        (sum, amount, idx) => (selectedItems.has(idx) ? sum + amount : sum),
        0
      );
  };

  const handleSubmitReturn = async () => {
    if (!selectedReason) {
      alert("Please select a return reason");
      return;
    }

    if (selectedItems.size === 0) {
      alert("Please select at least one item to return");
      return;
    }

    setSubmitting(true);
    try {
      const data = await requestReturn(
        orderId,
        selectedReason,
        comments,
        getReturnItems()
      );
      setReturnResult(data);
      console.log(data, "returnResult");

      setStep("confirmation");
    } catch (error) {
      console.error("Error submitting return:", error);
      alert(error.message || "Failed to submit return. Please try again.");
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

  if (!eligibility.canReturn) {
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
              Cannot Return Order
            </h2>
            <p className="text-slate-600 mb-2">
              Only delivered orders can be returned.
            </p>
            <p className="text-slate-600 mb-6">
              Current status:{" "}
              <span className="font-semibold">{order.status}</span>
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

  if (!eligibility.returnsWindowOpen) {
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
              Return Window Expired
            </h2>
            <p className="text-slate-600 mb-6">
              Returns are accepted within 14 days of delivery. This order is
              outside the return window.
            </p>
            <button
              onClick={() => router.push("/contact")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Contact Support
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  if (step === "confirmation" && returnResult) {
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
                  Return Approved
                </h1>
                <p className="text-green-100">
                  Your return request has been submitted
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
                    <p className="text-sm text-slate-600 mb-1">Return Amount</p>
                    <p className="text-lg font-semibold text-slate-900">
                      ₹{returnResult.refundAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Return Reason</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedReason}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Return Status</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {returnResult.order.status}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-blue-900 mb-4">
                    How to Return Your Items
                  </h3>
                  <div className="space-y-3 text-sm text-blue-900">
                    {[
                      {
                        step: 1,
                        title: "Pack Your Items",
                        desc: "Pack the items securely in the original packaging if possible.",
                      },
                      {
                        step: 2,
                        title: "Get Return Label",
                        desc: "A return label will be sent to your email within 2 hours.",
                      },
                      {
                        step: 3,
                        title: "Ship the Package",
                        desc: "Drop off at the nearest pickup point. Free return shipping!",
                      },
                      {
                        step: 4,
                        title: "Get Refund",
                        desc: "Refund processed within 5-7 days of receipt.",
                      },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                          {item.step}
                        </div>
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-blue-700">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {returnResult.refund && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-green-900 mb-4">
                      Refund Information
                    </h3>
                    {returnResult.refund.status === "failed" ? (
                      <div className="text-red-600">
                        <p className="mb-2">
                          Refund Processing: {returnResult.refund.status}
                        </p>
                        <p className="text-sm">{returnResult.refund.error}</p>
                      </div>
                    ) : (
                      <div className="text-green-900">
                        <p className="mb-2">
                          <span className="font-semibold">Type:</span>{" "}
                          {returnResult.refund.type === "full"
                            ? "Full Refund"
                            : "Partial Refund"}
                        </p>
                        <p className="mb-2">
                          <span className="font-semibold">Amount:</span> ₹
                          {returnResult.refund.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-green-700">
                          ⏱️ Refund will be credited to your account within 5-7
                          business days after we receive your items.
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
  console.log(order.products, "order.products");

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
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Return Order</h1>
              <p className="text-purple-100">
                Start your return process. Free return shipping included!
              </p>
            </div>

            <div className="p-8">
              {eligibility && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex gap-4">
                  <Package className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">
                      ✓ Eligible for return
                    </p>
                    <p className="text-sm text-green-700">
                      You have {14 - eligibility.daysOld} days remaining to
                      return this order
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="block text-lg font-semibold text-slate-900 mb-4">
                  Select Items to Return
                </div>
                <div className="space-y-3">
                  {order.products.map((item, idx) => {
                    let itemP = 0;
                    const type = typeof item.product.discounted_price;
                    const num = type === "number";
                    itemP = num
                      ? item.product.discounted_price
                      : item.product.discounted_price - "0";

                    return (
                      <motion.div
                        key={`item-${order._id}-${idx}`}
                        whileHover={{ scale: 1.01 }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition flex items-center gap-4 ${
                          selectedItems.has(idx)
                            ? "border-purple-600 bg-purple-50"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                        onClick={() => toggleItemSelection(idx)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.has(idx)}
                          onChange={() => toggleItemSelection(idx)}
                          className="w-5 h-5 text-purple-600 rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {item.product.product_name}
                          </p>
                          <p className="text-sm text-slate-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">
                            ₹
                            {(
                              (item.product.discounted_price || 0) *
                              item.quantity
                            ).toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-600">
                            ₹{itemP.toFixed(2)} each
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {selectedItems.size > 0 && (
                  <div className="mt-6 bg-slate-100 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-900 font-semibold">
                        Total Return Amount:
                      </span>
                      <span className="text-2xl font-bold text-purple-600">
                        ₹{getReturnAmount().toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      {selectedItems.size} of {order.products.length} items
                      selected
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <div className="block text-lg font-semibold text-slate-900 mb-4">
                  Why are you returning this item?
                </div>
                <div className="space-y-3">
                  {returnReasons &&
                    returnReasons.length > 0 &&
                    returnReasons.map((reason) => (
                      <motion.label
                        key={`reason-${reason.replaceAll(/\s+/g, "-")}`}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedReason === reason
                            ? "border-purple-600 bg-purple-50"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reason}
                          checked={selectedReason === reason}
                          onChange={(e) => setSelectedReason(e.target.value)}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="ml-3 text-slate-900 font-medium">
                          {reason}
                        </span>
                      </motion.label>
                    ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="block text-lg font-semibold text-slate-900 mb-2">
                  Additional Details (Optional)
                </div>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Describe the issue in detail (e.g., damage location, defect description)..."
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.back()}
                  className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold py-3 px-6 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReturn}
                  disabled={
                    submitting || !selectedReason || selectedItems.size === 0
                  }
                  className={`flex-1 font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 ${
                    submitting || !selectedReason || selectedItems.size === 0
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Return Request"
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

export default ReturnOrderPage;
