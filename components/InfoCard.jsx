"use client";
import React from "react";
import { motion } from "framer-motion";

export function InfoCard({ icon: Icon, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}
