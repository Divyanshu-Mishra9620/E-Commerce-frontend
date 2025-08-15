"use client";

import {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  use,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Calendar,
  CirclePlus,
  Clock,
  Pencil,
  Search,
  Star,
  Tag,
  Trash2,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import ProductContext from "@/context/ProductContext";
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;
const PRODUCTS_PER_PAGE = 50;

const getImageUrl = (imageString) => {
  if (!imageString) return "/images/lamp.jpg";
  try {
    const cleanedUrl = imageString.replace(/\s+/g, "").replace(/[\[\]]/g, "");
    return cleanedUrl.startsWith("http")
      ? cleanedUrl
      : `/images/${cleanedUrl}` || "/images/lamp.jpg";
  } catch {
    return "/images/lamp.jpg";
  }
};

const formatPrice = (price) => {
  return `₹${Number(price).toLocaleString()}`;
};

export default function SellerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: session } = useSession();
  const { products, isLoading } = useContext(ProductContext);
  const router = useRouter();

  const [searched, setSearched] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalProduct, setDeleteModalProduct] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [addModal, setAddModal] = useState(false);
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
    pid: "",
    uniq_id: "",
  });

  const { subscription, subLoading, isValid } = useSubscriptionCheck();
  const currentSubscription = useMemo(() => {
    return subLoading ? null : subscription;
  }, [subscription, subLoading]);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      if (!user?._id) return;

      try {
        const response = await fetch(
          `${BACKEND_URI}/api/products/seller/${user._id}`
        );

        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setFetchedProducts(data.products || []);
      } catch (error) {
        setActionError("Failed to load products");
        console.error("Fetch error:", error);
      }
    };

    fetchSellerProducts();
  }, [user]);

  const filteredProducts = useMemo(() => {
    if (searchedId) {
      return fetchedProducts.filter((pdt) => pdt?._id === searchedId);
    }

    return fetchedProducts.filter((pdt) =>
      pdt?.product_name?.toLowerCase().includes(searched.toLowerCase())
    );
  }, [fetchedProducts, searched, searchedId]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = PRODUCTS_PER_PAGE * (currentPage - 1);
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
    },
    [totalPages]
  );

  const handleDelete = async (productId) => {
    try {
      const res = await fetch(`${BACKEND_URI}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      setFetchedProducts((prev) => prev.filter((pdt) => pdt._id !== productId));
      setDeleteModalProduct(null);
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
      console.error("Delete error:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editModal) return;

    try {
      const res = await fetch(`${BACKEND_URI}/api/products/${editModal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        body: JSON.stringify(editModal),
      });

      if (!res.ok) throw new Error("Update failed");

      setFetchedProducts((prev) =>
        prev.map((pdt) => (pdt._id === editModal._id ? editModal : pdt))
      );
      setEditModal(null);
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
      console.error("Update error:", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setActionError(null);

    try {
      if (!user?._id) throw new Error("Authentication required");

      const productData = {
        ...newProduct,
        image: newProduct.image_url,
        creator: user._id,
        createdBy: user.role === "admin" ? "admin" : "seller",
      };

      const res = await fetch(`${BACKEND_URI}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Add failed");
      }

      const data = await res.json();
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
        pid: "",
        uniq_id: "",
      });
    } catch (error) {
      setActionError(error.message);
      toast.error(error.message || "Failed to add product");
    } finally {
      setIsProcessing(false);
    }
  };

  if (subLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-4">
        <h2 className="text-3xl font-semibold mb-4">Become a Seller</h2>
        <p className="text-gray-600 text-lg mb-6 text-center max-w-xl">
          To access the seller portal, please subscribe to our seller plan.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white text-lg mb-4"
          onClick={() => router.push("/paymentSub")}
        >
          Subscribe Now
        </button>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 underline text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <SubscriptionDetails
          subscription={currentSubscription}
          router={router}
        />

        <HeaderSection onAddProduct={() => setAddModal(true)} />

        <SearchSection onSearch={setSearched} onIdSearch={setSearchedId} />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={PRODUCTS_PER_PAGE}
          onPageChange={handlePageChange}
        />

        <ProductGrid
          products={paginatedProducts}
          onEdit={setEditModal}
          onDelete={setDeleteModalProduct}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={PRODUCTS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>

      <AddProductModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        product={newProduct}
        onChange={setNewProduct}
        onSubmit={handleAddSubmit}
        isProcessing={isProcessing}
      />

      <EditProductModal
        product={editModal}
        onClose={() => setEditModal(null)}
        onChange={setEditModal}
        onSubmit={handleEditSubmit}
      />

      <DeleteConfirmationModal
        product={deleteModalProduct}
        onClose={() => setDeleteModalProduct(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

const SubscriptionDetails = ({ subscription, router }) => {
  if (!subscription) return null;

  const { _doc: sub, daysRemaining } = subscription;
  const endDate = new Date(sub.endDate);
  const startDate = new Date(sub.startDate);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const calculateSavings = () => {
    const monthlyPrice = sub.amount / sub.duration;
    const basicMonthly = 299;
    return Math.round(((basicMonthly - monthlyPrice) / basicMonthly) * 100);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <Zap className="text-yellow-500" />
            Your Subscription
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your seller account and products
          </p>
        </div>

        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          {sub.planName}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DetailCard
          title="Status"
          value={
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  sub.status === "active" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="capitalize">{sub.status}</span>
            </div>
          }
        />

        <DetailCard title="Started On" value={formatDate(startDate)} />

        <DetailCard title="Expires On" value={formatDate(endDate)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailCard
          icon={<Clock className="w-4 h-4" />}
          title="Days Remaining"
          value={
            <span className="text-2xl font-bold text-blue-600">
              {daysRemaining}
            </span>
          }
        />

        <DetailCard
          icon={<Calendar className="w-4 h-4" />}
          title="Duration"
          value={
            <>
              <span className="text-xl font-bold text-gray-800">
                ₹{sub.amount}
              </span>
              <span className="text-gray-600 ml-2">
                for {sub.duration} months
              </span>
              {calculateSavings() > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  Saving {calculateSavings()}% vs monthly
                </p>
              )}
            </>
          }
        />
      </div>

      {daysRemaining <= 30 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
          <p>
            Your subscription expires soon. Renew to maintain seller privileges.
          </p>
          <button
            onClick={() => router.push("/app/paymentSub")}
            className="mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            Renew now
          </button>
        </div>
      )}
    </div>
  );
};

const DetailCard = ({ icon, title, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
    <h3 className="text-sm text-gray-600 mb-2 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    <div>{value}</div>
  </div>
);

const HeaderSection = ({ onAddProduct }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
      <p className="text-gray-600 mt-1">Manage your products and inventory</p>
    </div>

    <motion.button
      whileHover={{ scale: 1.05 }}
      onClick={onAddProduct}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white shadow-sm"
    >
      <CirclePlus className="h-5 w-5" />
      <span>Add New Product</span>
    </motion.button>
  </div>
);

const SearchSection = ({ onSearch, onIdSearch }) => (
  <div className="bg-white p-4 rounded-xl mb-8 shadow-sm border border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SearchInput
        placeholder="Search products..."
        icon={<Search className="h-4 w-4" />}
        onChange={(e) => onSearch(e.target.value)}
      />
      <SearchInput
        placeholder="Search by product ID..."
        icon={<Tag className="h-4 w-4" />}
        onChange={(e) => onIdSearch(e.target.value)}
      />
    </div>
  </div>
);

const SearchInput = ({ placeholder, icon, onChange }) => (
  <div className="relative">
    <input
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </div>
  </div>
);

const PaginationControls = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
      <div className="text-sm text-gray-600">
        Showing {startItem} - {endItem} of {totalItems} products
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700"
        >
          <HiArrowLeft className="h-5 w-5" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700"
        >
          <HiArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const ProductGrid = ({ products, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <AnimatePresence>
      {products.map((pdt) => (
        <ProductCard
          key={pdt._id}
          product={pdt}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </AnimatePresence>
  </div>
);

const ProductCard = ({ product, onEdit, onDelete }) => (
  <motion.div
    className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-200 hover:border-blue-300"
    whileHover={{ y: -5 }}
  >
    <div className="relative h-48 sm:h-56 overflow-hidden">
      <Image
        src={getImageUrl(product.image)}
        alt={product.product_name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

      <div className="absolute top-2 right-2 flex gap-2">
        <motion.button
          onClick={() => onEdit(product)}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
        >
          <Pencil className="text-white h-4 w-4" />
        </motion.button>
        <motion.button
          onClick={() => onDelete(product)}
          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
        >
          <Trash2 className="text-white h-4 w-4" />
        </motion.button>
      </div>
    </div>

    <div className="p-4 space-y-3">
      <h2 className="text-lg font-bold text-gray-800 truncate">
        {product.product_name}
      </h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 text-lg font-semibold">
            {formatPrice(product.discounted_price)}
          </span>
          {product.retail_price && (
            <span className="text-sm line-through text-gray-500">
              {formatPrice(product.retail_price)}
            </span>
          )}
        </div>
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {product.product_category_tree?.split(">>")[0]?.trim() ||
            "Uncategorized"}
        </span>
      </div>

      <div className="text-sm text-gray-600 line-clamp-3">
        {product.description || "No description available"}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>{product.product_rating || "N/A"}</span>
        </div>
        <span>{new Date(product.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  </motion.div>
);

const AddProductModal = ({
  isOpen,
  onClose,
  product,
  onChange,
  onSubmit,
  isProcessing,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    onChange((prev) => ({ ...prev, [id]: value }));
  };

  const formFields = [
    {
      id: "product_name",
      label: "Product Name*",
      type: "text",
      required: true,
    },
    { id: "brand", label: "Brand", type: "text" },
    {
      id: "retail_price",
      label: "Retail Price*",
      type: "number",
      required: true,
    },
    {
      id: "discounted_price",
      label: "Discounted Price*",
      type: "number",
      required: true,
    },
    {
      id: "description",
      label: "Description*",
      type: "textarea",
      required: true,
    },
    { id: "product_specifications", label: "Specifications", type: "textarea" },
    { id: "product_category_tree", label: "Category Tree", type: "text" },
    { id: "image_url", label: "Image URL", type: "url" },
    { id: "pid", label: "Product ID (PID)", type: "text" },
    { id: "uniq_id", label: "Unique ID", type: "text" },
  ];

  return (
    <Modal title="Add New Product" onClose={onClose}>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {formFields.map((field) => (
          <FormField
            key={field.id}
            id={field.id}
            label={field.label}
            value={product[field.id] || ""}
            onChange={handleChange}
            type={field.type}
            required={field.required}
            className={field.type === "textarea" ? "md:col-span-2" : ""}
          />
        ))}

        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-800"
          >
            Cancel
          </button>
          <SubmitButton label="Add Product" isProcessing={isProcessing} />
        </div>
      </form>
    </Modal>
  );
};

const EditProductModal = ({ product, onClose, onChange, onSubmit }) => {
  if (!product) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    onChange((prev) => ({ ...prev, [id]: value }));
  };

  const editableFields = [
    "product_name",
    "brand",
    "retail_price",
    "discounted_price",
    "description",
    "product_specifications",
    "product_category_tree",
    "image",
    "pid",
    "uniq_id",
  ];

  return (
    <Modal title="Edit Product" onClose={onClose}>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
        {editableFields.map((field) => (
          <FormField
            key={field}
            id={field}
            label={field.replace(/_/g, " ")}
            value={product[field] || ""}
            onChange={handleChange}
          />
        ))}

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

const DeleteConfirmationModal = ({ product, onClose, onConfirm }) => {
  if (!product) return null;

  return (
    <Modal title="Delete Product?" onClose={onClose}>
      <p className="text-gray-600 mb-6">
        Confirm deletion of{" "}
        <span className="text-blue-600 font-medium">
          {product.product_name}
        </span>
        ?
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(product._id)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

const Modal = ({ title, children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className="bg-white p-6 rounded-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      {children}
    </motion.div>
  </motion.div>
);

const FormField = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
}) => (
  <div className={`space-y-2 ${className}`}>
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[100px] text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required={required}
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required={required}
      />
    )}
  </div>
);

const SubmitButton = ({ label, isProcessing }) => (
  <button
    type="submit"
    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors text-white"
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
    {label}
  </button>
);
