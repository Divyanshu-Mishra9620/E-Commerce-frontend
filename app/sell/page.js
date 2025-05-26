"use client";

import ProductContext from "@/context/ProductContext";
import { CirclePlus, Pencil, Search, Star, Tag, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const getImageUrl = (imageString) => {
  if (!imageString) return "/images/lamp.jpg";
  try {
    const cleanedUrl = imageString.replace(/\s+/g, "").replace(/[\[\]]/g, "");
    if (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://")) {
      return cleanedUrl;
    }
    return `/images/${cleanedUrl}` || "/images/lamp.jpg";
  } catch (error) {
    console.error("Error processing image URL:", error);
    return "/images/lamp.jpg";
  }
};

export default function SellerPage() {
  const BACKEND_URI =
    process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:5000";
  const { products, isLoading } = useContext(ProductContext);
  const [searched, setSearched] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalProduct, setDeleteModalProduct] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);

  const [newProduct, setNewProduct] = useState({
    product_name: "",
    discounted_price: "",
    retail_price: "",
    description: "",
    product_specifications: "",
    product_category_tree: "",
    brand: "",
    image_url: "",
  });

  useEffect(() => {
    const initializeSellerData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/api/auth/signin");
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);

      try {
        const response = await fetch(
          `${BACKEND_URI}/api/products/seller/${userData._id}`
        );
        if (!response.ok) throw new Error("Failed to fetch seller products");
        const data = await response.json();

        setFetchedProducts(data || []);
      } catch (error) {
        console.error("Error fetching seller products:", error);
        setActionError("Failed to load your products");
      }
    };

    initializeSellerData();
  }, []);

  const totalPages = Math.ceil((fetchedProducts?.length || 0) / 50);

  const handleChange = (e) => {
    setSearched(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleIdChange = (e) => {
    setSearchedId(e.target.value.trim());
    setCurrentPage(1);
  };

  const handleRight = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleLeft = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const filteredProducts = fetchedProducts?.filter((pdt) =>
    pdt?.product_name?.toLowerCase().includes(searched)
  );

  const filteredById = fetchedProducts?.filter(
    (pdt) => pdt?._id === searchedId
  );

  const paginatedProducts = filteredProducts?.slice(
    50 * (currentPage - 1),
    50 * currentPage
  );

  const finalProduct = searchedId ? filteredById : paginatedProducts;

  const handleDelete = async (productId) => {
    try {
      const res = await fetch(`${BACKEND_URI}/api/products/${productId}`, {
        method: "DELETE",
      });

      const contentType = res.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) throw new Error(data.message || "Failed to delete product");

      setDeleteModalProduct(null);
      setFetchedProducts((prev) =>
        prev?.filter((pdt) => pdt._id !== productId)
      );
    } catch (err) {
      setDeleteModalProduct(null);
      console.error("Error deleting product:", err);
    }
  };

  const handleEdit = (e) => {
    const { id, value } = e.target;
    setEditModal((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(editModal);

    try {
      const res = await fetch(`${BACKEND_URI}/api/products/${editModal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editModal }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to edit product");
      setFetchedProducts((prev) =>
        prev.map((pdt) => (pdt?._id === editModal._id ? editModal : pdt))
      );
      setEditModal(null);
    } catch (error) {
      setEditModal(null);
      console.error("Error editing product", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setActionError(null);

    try {
      if (!user?._id) {
        throw new Error("Please login to add products");
      }

      const productData = {
        ...newProduct,
        creator: user._id,
        createdBy: user.role === "admin" ? "admin" : "seller",
        image: newProduct.image_url,
      };

      const res = await fetch(`${BACKEND_URI}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setFetchedProducts((prev) => [...prev, data.product]);
      setAddModal(false);
      toast.success("Product added successfully!");
      setNewProduct({
        product_name: "",
        discounted_price: "",
        retail_price: "",
        description: "",
        product_specifications: "",
        product_category_tree: "",
        brand: "",
        image_url: "",
      });
    } catch (error) {
      setActionError(error.message);
      toast.error(error.message || "Failed to add product");
      console.error("Error adding product:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdd = (e) => {
    const { id, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const renderAddForm = () => (
    <form
      onSubmit={handleAddSubmit}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <div className="space-y-4 md:col-span-2">
        <h3 className="text-lg font-semibold text-emerald-400">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Product Name*
            </label>
            <input
              type="text"
              id="product_name"
              value={newProduct.product_name}
              onChange={handleAdd}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300"
              placeholder="Enter product name..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Brand</label>
            <input
              type="text"
              id="brand"
              value={newProduct.brand}
              onChange={handleAdd}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300"
              placeholder="Enter brand..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 md:col-span-2">
        <h3 className="text-lg font-semibold text-emerald-400">Pricing</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Retail Price*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ₹
              </span>
              <input
                type="number"
                id="retail_price"
                value={newProduct.retail_price}
                onChange={handleAdd}
                className="w-full pl-8 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300"
                placeholder="Enter retail price..."
                required
                min="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Discounted Price*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ₹
              </span>
              <input
                type="number"
                id="discounted_price"
                value={newProduct.discounted_price}
                onChange={handleAdd}
                className="w-full pl-8 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300"
                placeholder="Enter discounted price..."
                required
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 md:col-span-2">
        <h3 className="text-lg font-semibold text-emerald-400">Details</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Description*
            </label>
            <textarea
              id="description"
              value={newProduct.description}
              onChange={handleAdd}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg h-32 text-slate-300"
              placeholder="Enter product description..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Image URL
            </label>
            <input
              type="url"
              id="image_url"
              value={newProduct.image_url}
              onChange={handleAdd}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300"
              placeholder="Enter image URL..."
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => setAddModal(false)}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2 transition-colors"
          disabled={isProcessing}
        >
          {isProcessing && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          Add Product
        </button>
      </div>
    </form>
  );

  const ProductCard = ({ pdt }) => (
    <motion.div
      key={pdt?._id}
      className="group bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-slate-700/50 hover:border-emerald-500/30"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={getImageUrl(pdt?.image)}
          alt={pdt?.product_name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

        <div className="absolute top-2 right-2 flex gap-2">
          <motion.button
            onClick={() => setEditModal(pdt)}
            className="p-2 bg-emerald-600/80 hover:bg-emerald-700 rounded-lg backdrop-blur-sm"
          >
            <Pencil className="text-white h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={() => setDeleteModalProduct(pdt)}
            className="p-2 bg-rose-600/80 hover:bg-rose-700 rounded-lg backdrop-blur-sm"
          >
            <Trash2 className="text-white h-4 w-4" />
          </motion.button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h2 className="text-lg font-bold text-white truncate">
          {pdt?.product_name}
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-lg font-semibold">
              ₹{pdt?.discounted_price}
            </span>
            {pdt?.retail_price && (
              <span className="text-sm line-through text-slate-500">
                ₹{pdt?.retail_price}
              </span>
            )}
          </div>
          <span className="text-sm bg-emerald-600/20 text-emerald-400 px-2 py-1 rounded">
            {pdt?.product_category_tree?.split(">>")[0]?.trim() ||
              "Uncategorized"}
          </span>
        </div>

        <div className="text-sm text-slate-300 line-clamp-3">
          {pdt?.description || "No description available"}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{pdt?.product_rating || "N/A"}</span>
          </div>
          <span>{new Date(pdt?.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );

  const PaginationControls = () => (
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div className="text-sm text-slate-400">
        Showing {(currentPage - 1) * 50 + 1} -{" "}
        {Math.min(currentPage * 50, fetchedProducts.length)} of{" "}
        {fetchedProducts.length} products
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleLeft}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
        >
          <HiArrowLeft className="h-5 w-5" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === i + 1
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={handleRight}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
        >
          <HiArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return <p className="text-center mt-8 text-lg">Loading products...</p>;
  }

  let flag = true;
  if (!flag) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-100 px-4">
        <h2 className="text-3xl font-semibold mb-4">Become a Seller</h2>
        <p className="text-gray-400 text-lg mb-6 text-center max-w-xl">
          To access the seller portal and list your products, please subscribe
          to our seller plan.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white text-lg mb-4"
          onClick={() => router.push("/subscribe")}
        >
          Subscribe Now
        </button>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-200 underline text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Seller Dashboard</h1>
            <p className="text-slate-400 mt-1">
              Manage your products and inventory
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg"
          >
            <CirclePlus className="h-5 w-5" />
            <span>Add New Product</span>
          </motion.button>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by product ID..."
                onChange={handleIdChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300"
              />
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        <PaginationControls />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {finalProduct?.map((pdt) => (
              <ProductCard key={pdt?._id} pdt={pdt} />
            ))}
          </AnimatePresence>
        </div>

        <PaginationControls />
      </div>

      <AnimatePresence>
        {addModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="
    bg-slate-800 p-6 md:p-8 rounded-xl md:rounded-2xl border
    w-full max-w-md md:max-w-2xl
    max-h-[90vh] overflow-y-auto
  "
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                Add New Product
              </h2>
              {renderAddForm()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="
    bg-slate-800 p-6 md:p-8 rounded-xl md:rounded-2xl border
    w-full max-w-md md:max-w-2xl
    max-h-[90vh] overflow-y-auto
  "
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                Edit Product
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 md:gap-6"
              >
                {Object.keys(editModal).map(
                  (key) =>
                    key !== "_id" && (
                      <div key={key} className="space-y-1 md:space-y-2">
                        <label
                          htmlFor={key}
                          className="text-xs md:text-sm font-medium text-slate-300 capitalize"
                        >
                          {key.replace(/_/g, " ")}
                        </label>
                        <input
                          type={
                            typeof editModal[key] === "number"
                              ? "number"
                              : "text"
                          }
                          id={key}
                          value={editModal[key]}
                          onChange={handleEdit}
                          className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg md:rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm md:text-base"
                        />
                      </div>
                    )
                )}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 md:mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setEditModal(null)}
                    className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModalProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-slate-800 p-6 md:p-8 rounded-xl md:rounded-2xl border border-slate-700/50 w-full max-w-md md:max-w-2xl"
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                Delete Product?
              </h2>
              <p className="text-slate-400 mb-6">
                Confirm deletion of{" "}
                <span className="text-emerald-400">
                  {deleteModalProduct?.product_name}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteModalProduct(null)}
                  className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(deleteModalProduct._id)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
