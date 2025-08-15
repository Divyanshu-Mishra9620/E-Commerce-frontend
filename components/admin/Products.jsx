"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { CirclePlus, Search } from "lucide-react";

import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useAuth } from "@/hooks/useAuth";
import { authedFetch } from "@/utils/authedFetch";

import { ProductsTable } from "@/components/admin/ProductTable";
import { ProductForm } from "@/components/admin/ProductForm";
import { Modal } from "@/components/Modals";
import PageLoader from "@/components/PageLoader";
import { FcNext, FcPrevious } from "react-icons/fc";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function ProductsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { products, totalPages, isLoading, error, mutate } = useAdminProducts(
    page,
    searchTerm
  );

  const [editModalContent, setEditModalContent] = useState(null);
  const [deleteModalContent, setDeleteModalContent] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleProductSubmit = async (formData) => {
    setIsProcessing(true);
    const isEditing = !!(editModalContent && editModalContent._id);
    const url = isEditing
      ? `/api/products/${editModalContent._id}`
      : `/api/products`;
    const method = isEditing ? "PUT" : "POST";

    try {
      await authedFetch(url, {
        method,
        body: { ...formData, creator: user._id },
      });

      toast.success(`Product ${isEditing ? "updated" : "added"}!`);
      mutate();
      setEditModalContent(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModalContent) return;
    setIsProcessing(true);
    try {
      await authedFetch(`/api/products/${deleteModalContent._id}`, {
        method: "DELETE",
      });
      toast.success("Product deleted successfully!");
      mutate();
      setDeleteModalContent(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) return <div>Failed to load products.</div>;
  if ((isLoading && products.length === 0) || authLoading)
    return <PageLoader />;

  const PaginationControls = (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page <= 1}
      >
        <FcPrevious />
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page >= totalPages}
      >
        <FcNext />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage all products in your store.
          </p>
        </div>
        <button
          onClick={() => setEditModalContent("add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold"
        >
          <CirclePlus size={18} /> Add Product
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg"
        />
      </div>

      <ProductsTable
        products={products}
        onEdit={setEditModalContent}
        onDelete={setDeleteModalContent}
        paginationControls={PaginationControls}
      />

      <Modal
        isOpen={!!editModalContent}
        onClose={() => setEditModalContent(null)}
        title={editModalContent === "add" ? "Add New Product" : "Edit Product"}
      >
        <ProductForm
          onSubmit={handleProductSubmit}
          onCancel={() => setEditModalContent(null)}
          initialData={editModalContent === "add" ? {} : editModalContent}
          isProcessing={isProcessing}
        />
      </Modal>

      <Modal
        isOpen={!!deleteModalContent}
        onClose={() => setDeleteModalContent(null)}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{deleteModalContent?.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setDeleteModalContent(null)}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isProcessing}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            {isProcessing ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
