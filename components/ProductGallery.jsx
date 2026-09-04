"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { sanitizeProductImage } from "@/lib/product-display";

export function ProductGallery({ product }) {
  const images = useMemo(() => {
    const imageList = [
      product?.image,
      ...(Array.isArray(product?.images)
        ? product.images
        : product?.images
          ? [product.images]
          : []),
    ]
      .map((image) => sanitizeProductImage(image, ""))
      .filter(Boolean);

    return [...new Set(imageList)];
  }, [product?.image, product?.images]);

  const fallbackImage = sanitizeProductImage(null);
  const [selectedImage, setSelectedImage] = useState(images[0] || fallbackImage);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setSelectedImage(images[0] || fallbackImage);
  }, [images, fallbackImage]);

  return (
    <div>
      <div className="relative rounded-xl p-6 shadow-2xl">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="relative h-96 w-full cursor-zoom-in overflow-hidden rounded-xl"
        >
          <Image
            src={selectedImage}
            alt={product?.product_name || "Product image"}
            fill
            className="object-contain transition-transform duration-300 hover:scale-105"
          />
        </button>

        <div className="mt-4 flex gap-4">
          {images.slice(0, 5).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                selectedImage === image
                  ? "border-emerald-400"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowModal(false)}
          >
            <div className="relative max-h-[90vh] w-full max-w-4xl">
              <Image
                src={selectedImage}
                alt={product?.product_name || "Product image"}
                width={1200}
                height={1200}
                className="h-full w-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
