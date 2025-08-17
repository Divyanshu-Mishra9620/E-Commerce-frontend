"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck, Home, CheckCircle } from "lucide-react";

const stages = [
  { name: "Ordered", status: "Processing", icon: CheckCircle },
  { name: "Shipped", status: "Shipped", icon: Truck },
  { name: "Delivered", status: "Delivered", icon: Home },
];

const getStageIndex = (orderStatus) => {
  const index = stages.findIndex((stage) => stage.status === orderStatus);
  return index > -1 ? index : 0;
};

export function OrderStatusTracker({ order }) {
  const currentStageIndex = getStageIndex(order.status);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Order Tracker
      </h2>
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{
              width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {stages.map((stage, index) => (
          <div key={stage.name} className="z-10 text-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                index <= currentStageIndex
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-300"
              }`}
            >
              <stage.icon
                size={16}
                className={
                  index <= currentStageIndex ? "text-white" : "text-gray-400"
                }
              />
            </div>
            <p
              className={`mt-2 text-xs font-medium ${
                index <= currentStageIndex ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {stage.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
