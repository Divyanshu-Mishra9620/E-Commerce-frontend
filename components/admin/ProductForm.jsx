"use client";
import React, { useState, useEffect } from "react";

const FormInput = ({ id, label, value, onChange, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      name={id}
      value={value || ""}
      onChange={onChange}
      {...props}
      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export function ProductForm({
  onSubmit,
  onCancel,
  initialData = {},
  isProcessing,
}) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto p-1"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="product_name"
          label="Product Name"
          value={formData.product_name}
          onChange={handleChange}
          required
        />
        <FormInput
          id="brand"
          label="Brand"
          value={formData.brand}
          onChange={handleChange}
        />
        <FormInput
          id="retail_price"
          label="Retail Price (₹)"
          value={formData.retail_price}
          onChange={handleChange}
          type="number"
          required
        />
        <FormInput
          id="discounted_price"
          label="Discounted Price (₹)"
          value={formData.discounted_price}
          onChange={handleChange}
          type="number"
          required
        />
        <div className="md:col-span-2">
          <FormInput
            id="image"
            label="Image URL"
            value={formData.image}
            onChange={handleChange}
            type="url"
          />
        </div>
        <div className="md:col-span-2">
          <FormInput
            id="product_category_tree"
            label="Category"
            value={formData.product_category_tree}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description..."
            rows={4}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          {isProcessing ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
