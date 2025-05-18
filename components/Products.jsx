"use client";

import ProductContext from "@/context/ProductContext";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function Products() {
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
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    discounted_price: "",
    retail_price: "",
    product_rating: "",
    reviews: "",
    description: "",
    product_specifications: "",
    product_category_tree: "",
    brand: "",
    id: "",
    image_url: "",
    pid: "",
    uniq_id: "",
  });

  useEffect(() => {
    if (products) {
      setFetchedProducts(products);
    }
  }, [products]);

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

    try {
      const res = await fetch(`${BACKEND_URI}/api/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newProduct }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "error adding product");
      console.log(data);

      setFetchedProducts((prev) => [...prev, data.product]);
      setAddModal(false);
    } catch (error) {
      console.error("Error editing product", error);
      setAddModal(false);
    }
  };

  const handleAdd = (e) => {
    const { id, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [id]: value }));
  };

  if (isLoading) {
    return <p className="text-center mt-8 text-lg">Loading products...</p>;
  }

  return (
    <div className="px-4 sm:px-6 py-6 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen">
      {/* Search and Add Button Section */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="w-full md:flex-1 max-w-2xl space-y-3 md:space-y-4">
          <motion.input
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            type="text"
            placeholder="Search by product name..."
            onChange={handleChange}
            className="w-full px-4 md:px-6 py-2 md:py-3 bg-slate-800 border border-slate-700 rounded-xl md:rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
          />
          <motion.input
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            type="text"
            placeholder="Search by product ID..."
            onChange={handleIdChange}
            className="w-full px-4 md:px-6 py-2 md:py-3 bg-slate-800 border border-slate-700 rounded-xl md:rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAddModal(true)}
          className="p-3 md:p-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl md:rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-colors duration-300 self-end"
        >
          <CirclePlus className="text-white h-5 w-5 md:h-6 md:w-6" />
          <span className="text-white font-medium text-sm md:text-base hidden md:inline">
            Add Product
          </span>
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto flex justify-center items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLeft}
          disabled={currentPage === 1}
          className={`p-2 md:p-3 rounded-lg md:rounded-xl ${
            currentPage === 1
              ? "bg-slate-800 text-slate-600"
              : "bg-slate-800 hover:bg-slate-700 text-emerald-500"
          }`}
        >
          <HiArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
        </motion.button>

        <motion.span
          key={currentPage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xs md:text-sm font-medium text-slate-400"
        >
          Page {currentPage} of {totalPages}
        </motion.span>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRight}
          disabled={currentPage === totalPages}
          className={`p-2 md:p-3 rounded-lg md:rounded-xl ${
            currentPage === totalPages
              ? "bg-slate-800 text-slate-600"
              : "bg-slate-800 hover:bg-slate-700 text-emerald-500"
          }`}
        >
          <HiArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </motion.button>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 sm:px-0">
        <AnimatePresence>
          {finalProduct?.map((pdt) => (
            <motion.div
              key={pdt?._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-700/50 hover:border-emerald-500/30"
            >
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <Image
                  src={
                    pdt?.image?.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
                    "/placeholder.svg"
                  }
                  alt={pdt?.product_name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditModal(pdt)}
                    className="p-1.5 md:p-2 bg-emerald-600/80 hover:bg-emerald-700 rounded-md md:rounded-lg backdrop-blur-sm"
                  >
                    <Pencil className="text-white h-4 w-4 md:h-[18px] md:w-[18px]" />
                  </motion.button>
                  <motion.button
                    className="p-1.5 md:p-2 bg-rose-600/80 hover:bg-rose-700 rounded-md md:rounded-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDeleteModalProduct(pdt)}
                  >
                    <Trash2 className="text-white h-4 w-4 md:h-[18px] md:w-[18px]" />
                  </motion.button>
                </div>
              </div>

              <div className="p-4 md:p-6 space-y-2 md:space-y-3">
                <h2 className="text-base md:text-xl font-bold text-white truncate">
                  {pdt?.product_name}
                </h2>
                <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-slate-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <span className="font-medium">Price:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">
                        ₹{pdt?.discounted_price}
                      </span>
                      {pdt?.retail_price && (
                        <span className="text-xs line-through text-slate-500">
                          ₹{pdt?.retail_price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <span className="font-medium">Rating:</span>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                      <span className="text-emerald-400">
                        {pdt?.product_rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <span className="font-medium">Reviews:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">
                        {pdt?.reviews.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <span className="font-medium">Category:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">
                        {pdt?.product_category_tree}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <span className="font-medium">uniq ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">{pdt?.uniq_id}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <span className="font-medium">Specifications:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">
                        {pdt?.product_specifications}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <span className="font-medium">pid:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">{pdt?.pid}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <span className="font-medium">id:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">{pdt?.id}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <span className="font-medium">Description:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">
                        {pdt?.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <span className="font-medium">CreateAt:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">{pdt?.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <span className="font-medium">UpdatedAt:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">{pdt?.updatedAt}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">ID: {pdt?._id}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Product Modal */}
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
              <form
                onSubmit={handleAddSubmit}
                className="grid grid-cols-1 gap-4 md:gap-6"
              >
                {Object.keys(newProduct).map((key) => (
                  <div key={key} className="space-y-1 md:space-y-2">
                    <label className="text-xs md:text-sm font-medium text-slate-300 capitalize">
                      {key.replace(/_/g, " ")}
                    </label>
                    <input
                      type={
                        typeof newProduct[key] === "number" ? "number" : "text"
                      }
                      id={key}
                      value={newProduct[key]}
                      onChange={handleAdd}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg md:rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm md:text-base"
                      placeholder={`Enter ${key.replace(/_/g, " ")}...`}
                    />
                  </div>
                ))}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 md:mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setAddModal(false)}
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
                    Add Product
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
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
                  {deleteModalProduct.product_name}
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
