"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Truck,
  MapPin,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ShippingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const shippingMethods = [
    {
      name: "Standard Delivery",
      duration: "5-7 Business Days",
      price: "₹50 (Free over ₹500)",
      description:
        "Perfect for most orders. Your package will be safely delivered to your doorstep.",
      icon: Package,
    },
    {
      name: "Express Delivery",
      duration: "2-3 Business Days",
      price: "₹150",
      description:
        "For urgent orders. Fast and reliable delivery to your location.",
      icon: Truck,
    },
    {
      name: "Same Day Delivery",
      duration: "Same Day (Before 9 PM)",
      price: "₹250",
      description: "Available for selected areas in metro cities only.",
      icon: Clock,
    },
  ];

  const faqItems = [
    {
      q: "How do I track my order?",
      a: "Once your order is dispatched, you'll receive a tracking number via email. You can use this number to track your shipment in real-time on our website or the carrier's website.",
    },
    {
      q: "What if my package is lost?",
      a: "We insure all shipments. If your package is lost or damaged during transit, please contact our customer support team within 48 hours with photos and proof of delivery address, and we'll arrange a replacement or refund.",
    },
    {
      q: "Can I change my delivery address after ordering?",
      a: "If your order hasn't been dispatched yet, you can request an address change through our customer support. However, if it's already in transit, the address cannot be changed.",
    },
    {
      q: "Do you offer international shipping?",
      a: "Currently, we only ship within India. We're expanding our international shipping capabilities and will announce updates soon.",
    },
    {
      q: "What areas do you deliver to?",
      a: "We deliver to most cities and towns across India. However, some remote areas may take longer or have limited service. You can check if your area is serviceable at checkout.",
    },
    {
      q: "How are my items packaged?",
      a: "All items are carefully packed with protective materials to ensure they arrive in perfect condition. We use eco-friendly packaging whenever possible.",
    },
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Shipping Information
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Fast, reliable, and secure delivery to your doorstep. Learn about
              our shipping methods, delivery times, and policies.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {shippingMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-lg mb-4">
                    <IconComponent className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {method.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {method.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-slate-700">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">
                        {method.duration}
                      </span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium">
                        {method.price}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-8 mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Delivery Coverage
                </h3>
                <p className="text-slate-700 mb-4">
                  We currently deliver to most cities and towns across India
                  including:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-slate-700">
                  <div>✓ All Metro Cities</div>
                  <div>✓ Tier 1 Cities</div>
                  <div>✓ Tier 2 Cities</div>
                  <div>✓ Most Towns</div>
                  <div>✓ Suburban Areas</div>
                  <div>✓ Rural Areas (Additional charges may apply)</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Order Processing & Dispatch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-slate-200 p-8"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Processing Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Order Confirmation
                      </p>
                      <p className="text-sm text-slate-600">Immediate</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Payment Verification
                      </p>
                      <p className="text-sm text-slate-600">Within 1 hour</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Order Processing
                      </p>
                      <p className="text-sm text-slate-600">
                        1-2 Business Days
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Dispatch</p>
                      <p className="text-sm text-slate-600">
                        Ready for shipping
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-slate-200 p-8"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Shipping & Handling
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>All packages are insured during transit</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Professional packaging with protective materials
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time tracking updates via SMS and email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Signature required on delivery for high-value items
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Easy returns and replacements</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Important Notes
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>
                    • Delivery dates are estimates and may vary during peak
                    seasons
                  </li>
                  <li>
                    • Weekend and holiday deliveries are available in select
                    areas
                  </li>
                  <li>
                    • Please ensure someone is available to receive the package
                  </li>
                  <li>
                    • Contact us immediately if your package is damaged or
                    missing items
                  </li>
                  <li>
                    • Shipping charges are calculated based on weight and
                    delivery zone
                  </li>
                </ul>
              </div>
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
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.details
                  key={index}
                  className="bg-white rounded-lg border border-slate-200 p-6 cursor-pointer hover:shadow-md transition-all"
                  whileHover={{ y: -2 }}
                >
                  <summary className="flex items-center justify-between font-semibold text-slate-900 text-lg hover:text-blue-600 transition-colors">
                    {item.q}
                    <span className="text-blue-600 ml-4">+</span>
                  </summary>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    {item.a}
                  </p>
                </motion.details>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our customer support team is here to help. Reach out to us at any
              time.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default ShippingPage;
