"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Percent,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ReturnsPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const returnProcess = [
    {
      step: 1,
      title: "Initiate Return",
      description:
        "Visit your order history and click 'Return' on the item you wish to return. Fill in the reason for return.",
      icon: RefreshCw,
    },
    {
      step: 2,
      title: "Get Return Label",
      description:
        "We'll generate a prepaid return label. Download and print it or use it for courier pickup.",
      icon: ArrowRight,
    },
    {
      step: 3,
      title: "Pack & Ship",
      description:
        "Pack the item securely in its original condition. Arrange pickup or drop at the nearest collection point.",
      icon: Clock,
    },
    {
      step: 4,
      title: "Receive Refund",
      description:
        "Once we receive and inspect the item, we'll process your refund within 7-10 business days.",
      icon: CheckCircle2,
    },
  ];

  const returnPolicy = [
    {
      title: "Return Window",
      description: "14 days from the date of delivery",
      icon: Clock,
    },
    {
      title: "Condition Required",
      description:
        "Item must be in original, unused condition with original packaging and tags intact",
      icon: CheckCircle2,
    },
    {
      title: "Return Shipping",
      description:
        "Free return shipping on all returns. We provide a prepaid return label.",
      icon: RefreshCw,
    },
    {
      title: "Refund Processing",
      description:
        "Refund processed within 7-10 business days after item inspection",
      icon: Percent,
    },
  ];

  const faqItems = [
    {
      q: "What items are non-returnable?",
      a: "Certain items like digital products, personalized/custom items, and items purchased under special promotions may not be returnable. Check the product page or your order confirmation for specific details.",
    },
    {
      q: "Can I return an item if I changed my mind?",
      a: "Yes, you can return any item within 14 days of delivery if it's in original, unused condition with all original packaging and tags. The item must not show any signs of use.",
    },
    {
      q: "What if the item arrived damaged?",
      a: "If your item arrived damaged, please report it within 48 hours of delivery with photos of the damage and packaging. We'll arrange for a replacement or full refund immediately.",
    },
    {
      q: "How long will my refund take?",
      a: "After we receive and inspect your returned item, we process the refund within 7-10 business days. However, it may take an additional 5-10 business days for the amount to reflect in your bank account or payment method.",
    },
    {
      q: "Can I exchange an item instead of returning it?",
      a: "Yes, we offer exchanges for items in original condition. Select 'Exchange' instead of 'Return' in your order history, and we'll help you exchange it for the same item in a different size, color, or a different product of equal value.",
    },
    {
      q: "What if my item was defective?",
      a: "If your item is defective or not as described, please contact us immediately with photos and description of the defect. We'll provide a full refund or replacement without requiring you to return the item first in most cases.",
    },
    {
      q: "Do you accept returns for worn or used items?",
      a: "No, items that have been worn, used, washed, or show any signs of use cannot be returned. The item must be in brand new condition with original tags and packaging intact.",
    },
    {
      q: "Can I cancel a return after initiating it?",
      a: "Yes, you can cancel a return request up to 24 hours before the item is picked up. After pickup, you can contact customer support to request cancellation, but it may result in additional charges.",
    },
  ];

  const exchangeProcess = [
    "Login to your Elysoria account",
    "Go to 'Your Orders' in your profile",
    "Find the product you want to exchange",
    "Click 'Exchange' and select the new size, color, or product",
    "Confirm the exchange request",
    "We'll send you a return label via email",
    "Ship the original item back using the label",
    "Once received, we'll ship your new item",
    "You'll be notified when your new item is on the way",
  ];

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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <RefreshCw className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Returns & Refunds
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We want you to be completely satisfied with your purchase. Learn
              about our hassle-free return and refund policy.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {returnPolicy.map((policy, index) => {
              const IconComponent = policy.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">
                    {policy.title}
                  </h3>
                  <p className="text-sm text-slate-600">{policy.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              How to Return an Item
            </h2>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {returnProcess.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={index}
                      className="relative"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {index < returnProcess.length - 1 && (
                        <div className="hidden md:block absolute top-12 left-[60%] w-[40%] h-0.5 bg-gradient-to-r from-green-400 to-slate-200"></div>
                      )}

                      <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                            <span className="font-bold text-green-600">
                              {item.step}
                            </span>
                          </div>
                          <IconComponent className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                How to Exchange an Item
              </h2>
              <p className="text-slate-700 mb-8">
                Not happy with your purchase? You can exchange it for a
                different size, color, or product within 14 days of delivery.
                Here's how:
              </p>
              <ol className="space-y-3">
                {exchangeProcess.map((step, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                What We Accept
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    Unused items in original packaging
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    Items with original tags attached
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    Damaged items (will process immediately)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    Defective or not as described items
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                What We Don't Accept
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Used or worn items</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    Items without original tags or packaging
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    Items beyond the 14-day return window
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    Digital products or services
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                  whileHover={{ y: -2 }}
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900">
                      {item.q}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-slate-50"
                      >
                        <p className="p-6 text-slate-600">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-center mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Need Help with Your Return?
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Our customer support team is available 24/7 to assist you with
              returns, exchanges, or refunds.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-50 transition-colors"
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

export default ReturnsPage;
