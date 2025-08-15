"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(
    product.image?.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
      "images/lamp.jpg"
  );
  const [showModal, setShowModal] = useState(false);
  const images = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <div>
      <div className="relative rounded-xl p-6 shadow-2xl">
        <button
          onClick={() => setShowModal(true)}
          className="w-full h-96 relative rounded-xl overflow-hidden cursor-zoom-in"
        >
          <Image
            src={selectedImage}
            alt={product.product_name}
            fill
            className="object-contain hover:scale-105 transition-transform duration-300"
          />
        </button>
        <div className="flex gap-4 mt-4">
          {images.slice(0, 5).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === img
                  ? "border-emerald-400"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <Image
                src={selectedImage}
                alt={product.product_name}
                width={1200}
                height={1200}
                className="object-contain w-full h-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
