"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  paginationControls,
}) {
  if (products.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
        No products found.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {products.map((pdt) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={pdt._id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden group"
            >
              <Image
                src={pdt.image || "/lamp.jpg"}
                alt={pdt.product_name}
                width={400}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate">
                  {pdt.product_name}
                </h3>
                <p className="text-blue-600 font-semibold mt-1">
                  ₹{pdt.discounted_price}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => onEdit(pdt)}
                    className="flex-1 text-sm py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(pdt)}
                    className="flex-1 text-sm py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {paginationControls}
    </div>
  );
}
