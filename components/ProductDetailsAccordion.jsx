"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ProductDetailsAccordion({ product }) {
  const [isOpen, setIsOpen] = useState(false);

  const validSpecifications =
    product.specifications?.filter((spec) => spec && spec.includes(":")) || [];

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 transition-colors"
      >
        <h3 className="text-lg font-semibold">Product Details</h3>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Brand:</span>
                    <span>{product.brand || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-right truncate">
                      {product.category || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SKU:</span>
                    <span>#{product.uniq_id}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {validSpecifications.slice(0, 3).map((spec, i) => {
                    const [key, ...valueParts] = spec.split(":");
                    const value = valueParts.join(":").trim();
                    return (
                      <div key={i} className="flex justify-between">
                        <span className="text-gray-400">{key}:</span>
                        <span className="text-right truncate">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
