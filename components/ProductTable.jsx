"use client";

import React from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function ProductTable({
  products,
  isLoading,
  page,
  totalPages,
  setPage,
  onEdit,
  onDeleteSuccess,
}) {
  const { data: session } = useSession();
  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${BACKEND_URI}/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted!");
      onDeleteSuccess();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-slate-400 py-16">No products found.</div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((pdt) => (
          <div
            key={pdt._id}
            className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700"
          >
            <Image
              src={
                pdt.image?.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
                "/images/lamp.jpg"
              }
              alt={pdt.product_name}
              width={400}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold truncate">{pdt.product_name}</h3>
              <p className="text-emerald-400">₹{pdt.discounted_price}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onEdit(pdt)}
                  className="flex-1 text-sm py-2 bg-blue-600/50 hover:bg-blue-600/80 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pdt._id)}
                  className="flex-1 text-sm py-2 bg-red-600/50 hover:bg-red-600/80 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page <= 1}
          className="px-4 py-2 bg-slate-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-slate-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-slate-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
