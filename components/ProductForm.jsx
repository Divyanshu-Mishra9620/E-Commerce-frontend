"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ProductForm({ onSubmit, onCancel, initialData, isProcessing }) {
  const [formData, setFormData] = useState({
    product_name: "",
    discounted_price: "",
    retail_price: "",
    description: "",
    brand: "",
    image: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        product_name: initialData.product_name || "",
        discounted_price: initialData.discounted_price || "",
        retail_price: initialData.retail_price || "",
        description: initialData.description || "",
        brand: initialData.brand || "",
        image: initialData.image || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto p-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div>
        <label
          htmlFor="product_name"
          className="text-sm font-medium text-slate-300 block mb-1"
        >
          Product Name
        </label>
        <input
          type="text"
          id="product_name"
          value={formData.product_name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="retail_price"
            className="text-sm font-medium text-slate-300 block mb-1"
          >
            Retail Price (₹)
          </label>
          <input
            type="number"
            id="retail_price"
            value={formData.retail_price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label
            htmlFor="discounted_price"
            className="text-sm font-medium text-slate-300 block mb-1"
          >
            Discounted Price (₹)
          </label>
          <input
            type="number"
            id="discounted_price"
            value={formData.discounted_price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="brand"
          className="text-sm font-medium text-slate-300 block mb-1"
        >
          Brand
        </label>
        <input
          type="text"
          id="brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg"
        />
      </div>

      <div>
        <label
          htmlFor="image"
          className="text-sm font-medium text-slate-300 block mb-1"
        >
          Image URL
        </label>
        <input
          type="url"
          id="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-300 block mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {isProcessing ? "Saving..." : "Save Product"}
        </button>
      </div>
    </motion.form>
  );
}
