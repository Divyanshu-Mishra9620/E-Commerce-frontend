"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Footer from "@/components/Footer";

const faqData = [
  {
    category: "Ordering & Payment",
    questions: [
      {
        q: "How do I place an order?",
        a: "Simply browse our collections, select the items you love, add them to your cart, and proceed to checkout. Follow the on-screen instructions to enter your shipping and payment information to complete your purchase.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and other secure online payment methods. All payments are processed through a secure gateway to ensure your information is safe.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Unfortunately, once an order is placed, it is processed immediately to ensure quick delivery. Therefore, we are unable to modify or cancel orders. Please review your order carefully before confirming your purchase.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How long will it take to receive my order?",
        a: "Standard shipping typically takes 5-7 business days. Expedited shipping options are available at checkout for faster delivery. You will receive a tracking number via email as soon as your order is shipped.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order has shipped, we will send you a confirmation email containing a tracking number and a link to the carrier's website. You can use this to track your package's journey to your doorstep.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we only ship within India. We are working on expanding our shipping to international destinations in the near future. Stay tuned for updates!",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 14-day return policy for most items in their original, unused condition. If you are not completely satisfied with your purchase, you can initiate a return for a full refund or an exchange.",
      },
      {
        q: "How do I start a return?",
        a: "To start a return, please visit your order history page in your profile and select the order you wish to return. Follow the instructions to generate a return label. If you have any issues, our customer support team is here to help.",
      },
    ],
  },
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full py-5 text-left"
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let questionCounter = 0;

  return (
    <>
      <div className="min-h-screen bg-gray-50 mt-4 pt-4">
        <div className="container mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Can't find the answer you're looking for? Reach out to our
              customer support team.
            </p>
          </div>

          <div className="space-y-10">
            {faqData.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {category.category}
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  {category.questions.map((q) => {
                    const currentIndex = questionCounter++;
                    return (
                      <AccordionItem
                        key={currentIndex}
                        question={q.q}
                        answer={q.a}
                        isOpen={openIndex === currentIndex}
                        onClick={() => handleToggle(currentIndex)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
