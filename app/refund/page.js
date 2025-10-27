"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RefundStatusPage = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingData, setTrackingData] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setTrackingData({
        orderNumber: orderNumber,
        status: "approved",
        statusSteps: [
          {
            step: "Return Initiated",
            status: "completed",
            date: "Oct 20, 2024",
          },
          {
            step: "Return Picked Up",
            status: "completed",
            date: "Oct 21, 2024",
          },
          { step: "In Transit", status: "completed", date: "Oct 22-23, 2024" },
          {
            step: "Received at Warehouse",
            status: "completed",
            date: "Oct 24, 2024",
          },
          {
            step: "Quality Check",
            status: "in-progress",
            date: "Oct 25-26, 2024",
          },
          { step: "Refund Processed", status: "pending", date: "Oct 27, 2024" },
          {
            step: "Money Refunded",
            status: "pending",
            date: "Oct 28 - Nov 2, 2024",
          },
        ],
        refundAmount: "₹4,599",
        originalAmount: "₹4,599",
        refundMethod: "Original Payment Method",
        estimatedRefund: "Oct 28 - Nov 2, 2024",
      });
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const getStepIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case "in-progress":
        return <Clock className="w-6 h-6 text-blue-600 animate-spin" />;
      case "pending":
        return <Clock className="w-6 h-6 text-slate-400" />;
      default:
        return <Clock className="w-6 h-6 text-slate-300" />;
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-900";
      case "in-progress":
        return "bg-blue-100 text-blue-900";
      case "pending":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-50 text-slate-400";
    }
  };

  return (
    <>
      <Navbar />
      <motion.div
        className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Refund Status Tracker
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Track your refund status in real-time. Enter your order number to
              see the latest updates.
            </p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto mb-16"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <form onSubmit={handleSearch}>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Enter Your Order Number
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g., ELY-2024-001234"
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Track
                  </motion.button>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  You can find your order number in your confirmation email or
                  order history.
                </p>
              </form>
            </div>
          </motion.div>

          {trackingData ? (
            <motion.div
              className="max-w-4xl mx-auto mb-20"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-slate-600 font-semibold mb-1">
                      ORDER NUMBER
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {trackingData.orderNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold mb-1">
                      REFUND AMOUNT
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {trackingData.refundAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold mb-1">
                      REFUND METHOD
                    </p>
                    <p className="text-lg text-slate-900">
                      {trackingData.refundMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold mb-1">
                      ESTIMATED REFUND
                    </p>
                    <p className="text-lg text-slate-900">
                      {trackingData.estimatedRefund}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">
                  Refund Timeline
                </h2>
                <div className="space-y-6">
                  {trackingData.statusSteps.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex gap-6"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepColor(
                            item.status
                          )} flex-shrink-0`}
                        >
                          {getStepIcon(item.status)}
                        </div>
                        {index < trackingData.statusSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-16 my-2 ${
                              item.status === "completed"
                                ? "bg-green-600"
                                : "bg-slate-200"
                            }`}
                          ></div>
                        )}
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3
                            className={`font-bold text-lg ${
                              item.status === "completed"
                                ? "text-green-600"
                                : item.status === "in-progress"
                                ? "text-blue-600"
                                : "text-slate-400"
                            }`}
                          >
                            {item.step}
                          </h3>
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase">
                            {item.status === "completed"
                              ? "✓ Completed"
                              : item.status === "in-progress"
                              ? "⏳ In Progress"
                              : "○ Pending"}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm">{item.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      Next Steps
                    </h3>
                    <p className="text-sm text-slate-700">
                      Your refund is currently in the quality check phase. Once
                      approved, the money will be refunded to your original
                      payment method within 7-10 business days.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="max-w-2xl mx-auto text-center mb-20"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6">
                <Truck className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No Results Yet
              </h3>
              <p className="text-slate-600 mb-8">
                Enter your order number above to track your refund status
              </p>
            </motion.div>
          )}

          <motion.div
            className="mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Common Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-2">
                  How long does refund take?
                </h3>
                <p className="text-sm text-slate-600">
                  After we approve your return, it takes 7-10 business days for
                  the refund to reflect in your account.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-2">
                  Where will I get the refund?
                </h3>
                <p className="text-sm text-slate-600">
                  Refunds are processed to your original payment method. If paid
                  by card, check your bank account.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-2">
                  Can I cancel my return?
                </h3>
                <p className="text-sm text-slate-600">
                  You can cancel within 24 hours of initiating the return. After
                  pickup, contact support.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-2">
                  How often is tracking updated?
                </h3>
                <p className="text-sm text-slate-600">
                  Status updates in real-time as your return progresses through
                  each stage.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Need Help?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              If you can't find your refund status or have questions about your
              return, our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default RefundStatusPage;
