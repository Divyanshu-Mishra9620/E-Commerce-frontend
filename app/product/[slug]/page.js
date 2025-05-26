"use client";

import { useParams, useRouter } from "next/navigation";
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useTransition,
} from "react";
import "@/app/_styles/global.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Star,
} from "lucide-react";
import ReviewSection from "@/components/ReviewSection";
import ProductContext from "@/context/ProductContext";
import Image from "next/image";
import CyberLoader from "@/components/CyberLoader";
import ProductLoader from "@/components/ProductLoader";
import toast from "react-hot-toast";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug;
  const router = useRouter();
  const containerRef = useRef(null);

  const [qty, setQty] = useState(0);
  const [user, setUser] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [product, setProduct] = useState(null);
  const { products, isLoading } = useContext(ProductContext);
  const [expandedSection, setExpandedSection] = useState(null);
  const [loader, setLoader] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const processImageUrl = (imageUrl) => {
    if (!imageUrl) return "/lamp.jpg";
    try {
      if (imageUrl.startsWith("[") && imageUrl.endsWith("]")) {
        const urls = JSON.parse(imageUrl);
        return urls[0] || "/lamp.jpg";
      }
      const cleanedUrl = imageUrl.replace(/\s+/g, "").replace(/[\[\]"']/g, "");
      if (!cleanedUrl || cleanedUrl === "null" || cleanedUrl === "undefined") {
        return "/lamp.jpg";
      }
      return cleanedUrl;
    } catch (error) {
      console.error("Error processing image URL:", error);
      return "/lamp.jpg";
    }
  };

  const handleView = (uniq_id) => {
    setIsNavigating(true);
    startTransition(() => {
      router.push(`/product/${uniq_id}`);
      setIsNavigating(false);
    });
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/api/auth/signin");
    }
  }, [router]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const foundProduct = products.find((p) => p.uniq_id === slug);
        if (foundProduct) {
          const processedProduct = {
            ...foundProduct,
            image: processImageUrl(foundProduct.image),
            images: foundProduct.images?.map(processImageUrl) || [
              processImageUrl(foundProduct.image),
            ],
          };
          setProduct(processedProduct);
          localStorage.setItem(
            "lastVisitedProduct",
            JSON.stringify(processedProduct)
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchProductData();
  }, [slug, products]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("lastVisitedProduct");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!user || !product) return;

      try {
        const res = await fetch(`${BACKEND_URI}/api/wishlist/${user._id}`);
        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const wishlist = await res.json();
        const isProductInWishlist = wishlist.items.some(
          (item) => item.product.toString() === product._id.toString()
        );

        setIsInWishlist(isProductInWishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlistStatus();
  }, [user, product]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist");
      router.push("/api/auth/signin");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URI}/api/wishlist/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsInWishlist(!isInWishlist);
        toast.success(
          isInWishlist ? "Removed from wishlist" : "Added to wishlist"
        );
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update wishlist");
      }
    } catch (error) {
      toast.error("Error updating wishlist");
    }
  };

  const handleCartClick = async (change) => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      router.push("/api/auth/signin");
      return;
    }

    const parsedChange = Number(change);
    if (isNaN(parsedChange)) {
      toast.error("Invalid quantity change");
      return;
    }

    const newQuantity = Number(qty) + change;

    try {
      const res = await fetch(`${BACKEND_URI}/api/cart/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: newQuantity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedCartItem = data.cart.items.find(
          (item) => item.product === product._id
        );
        setQty(updatedCartItem?.quantity || 0);

        toast.success(
          qty === 0 ? "Product added to cart" : "Cart updated successfully"
        );
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update cart");
      }
    } catch (error) {
      toast.error("Error updating cart");
    }
  };

  const currentProductKeywords = [
    ...(product?.product_name || "").toLowerCase().split(" "),
    ...(product?.description || "").toLowerCase().split(" "),
    ...(product?.product_category_tree || "").toLowerCase().split(" >> "),
  ].filter(Boolean);

  const similarProducts =
    products
      ?.filter((prod) => {
        if (prod.uniq_id === product?.uniq_id) return false;

        const prodKeywords = [
          ...(prod.product_name || "").toLowerCase().split(" "),
          ...(prod.description || "").toLowerCase().split(" "),
          ...(prod.product_category_tree || "").toLowerCase().split(" >> "),
        ].filter(Boolean);

        const matchCount = currentProductKeywords.reduce((count, keyword) => {
          if (
            prodKeywords.some((prodKeyword) => prodKeyword.includes(keyword))
          ) {
            return count + 1;
          }
          return count;
        }, 0);

        return matchCount > 0;
      })
      .sort((a, b) => {
        const countA = currentProductKeywords.reduce((count, keyword) => {
          if (
            (a.product_name || "").toLowerCase().includes(keyword) ||
            (a.description || "").toLowerCase().includes(keyword) ||
            (a.product_category_tree || "").toLowerCase().includes(keyword)
          ) {
            return count + 1;
          }
          return count;
        }, 0);

        const countB = currentProductKeywords.reduce((count, keyword) => {
          if (
            (b.product_name || "").toLowerCase().includes(keyword) ||
            (b.description || "").toLowerCase().includes(keyword) ||
            (b.product_category_tree || "").toLowerCase().includes(keyword)
          ) {
            return count + 1;
          }
          return count;
        }, 0);

        return countB - countA;
      })
      .slice(0, 20)
      .map((prod) => {
        const imageUrl = prod.image?.replace(/\s+/g, "").replace(/[\[\]]/g, "");
        return {
          ...prod,
          image: imageUrl,
        };
      }) || [];
  const [isPending, startTransition] = useTransition();

  if (isLoading || loader || isPending || isNavigating) {
    return <CyberLoader />;
  }

  const PriceDisplay = ({ price, className }) => (
    <div className={`flex items-center ${className}`}>
      <span className="text-2xl font-bold text-emerald-400">₹{price}</span>
      {product.retail_price > product.discounted_price && (
        <span className="ml-3 text-gray-400 line-through text-sm">
          ₹{product.retail_price}
        </span>
      )}
    </div>
  );

  const RatingDisplay = ({ rating = 4.5 }) => (
    <div className="flex items-center mt-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-amber-400 fill-amber-400" : "text-gray-600"
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-400">({rating})</span>
    </div>
  );

  const ImageGallery = ({ images }) => (
    <div className="flex gap-4 mt-4">
      {images.map((img, index) => (
        <button
          key={index}
          onClick={() => setSelectedImage(index)}
          className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
            selectedImage === index ? "border-emerald-400" : "border-gray-700"
          }`}
        >
          <Image
            src={img.replace(/\s+/g, "").replace(/[\[\]]/g, "")}
            alt={`Thumbnail ${index + 1}`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );

  if (!product && !loader && !isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => router.push("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 mt-14">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative group bg-gray-800 rounded-xl p-6 shadow-2xl">
              <button
                onClick={() => setShowImageModal(true)}
                className="w-full h-96 relative rounded-xl overflow-hidden"
              >
                <Image
                  src={
                    product?.image.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
                    "/images/lamp.jpg"
                  }
                  alt={product?.product_name || "Product"}
                  fill
                  className="object-contain hover:scale-105 transition-transform"
                  onError={(e) => {
                    console.log("Image load error:", e);
                    e.target.src = "/images/lamp.jpg";
                  }}
                  priority={true}
                />
              </button>
              <ImageGallery
                images={[
                  product?.image?.replace(/\s+/g, "").replace(/[\[\]]/g, ""),
                ]
                  .filter(Boolean)
                  .map(processImageUrl)}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {product.product_name}
              </h1>
              <RatingDisplay />
              <PriceDisplay price={product.discounted_price} className="mt-4" />

              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection("details")}
                className="flex items-center justify-between w-full p-4 hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-lg font-semibold">Product Details</h3>
                {expandedSection === "details" ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>

              <AnimatePresence>
                {expandedSection === "details" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Category:</span>
                          <span className="text-right max-w-[60%] truncate">
                            {product.category || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Brand:</span>
                          <span className="text-right max-w-[60%] truncate">
                            {product.brand || "Unknown"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Availability:</span>
                          <span className="text-emerald-400">In Stock</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">SKU:</span>
                          <span className="text-right max-w-[60%] truncate">
                            #{product.uniq_id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="text-gray-400 mb-2">Specifications:</h4>
                      <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {product.specifications?.map((spec, i) => {
                          const [key, ...valueParts] = spec.split(":");
                          const value = valueParts.join(":").trim();

                          return (
                            <li key={i} className="flex justify-between gap-2">
                              <span className="text-gray-400 flex-shrink-0">
                                {key || "Spec"}:
                              </span>
                              <span className="text-right break-words">
                                {value || "N/A"}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-4 mt-8">
              <div className="flex items-center bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => handleCartClick(-1)}
                  className="px-4 py-2 hover:bg-gray-700 rounded-lg"
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-[40px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => handleCartClick(1)}
                  className="px-4 py-2 hover:bg-gray-700 rounded-lg"
                >
                  +
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                onClick={() => handleCartClick(qty === 0 ? 1 : 0)}
              >
                <ShoppingCart className="w-5 h-5" />
                {qty === 0 ? "Add to Cart" : "Update Cart"}
              </motion.button>

              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-4 rounded-lg transition-colors ${
                  isInWishlist
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${isInWishlist ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Similar Products */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similarProducts.map((product) => {
              const processedImage = processImageUrl(product.image);
              return (
                <motion.div
                  key={product.uniq_id}
                  whileHover={{ y: -5 }}
                  className="group bg-gray-800 rounded-xl p-4 hover:shadow-xl transition-all"
                >
                  {isNavigating && <ProductLoader />}
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={processedImage}
                      alt={product.product_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium truncate">
                      {product.product_name}
                    </h3>
                    <PriceDisplay
                      price={product.discounted_price}
                      className="mt-2"
                    />
                    <button
                      onClick={() => handleView(product.uniq_id)}
                      className="mt-4 w-full py-2 text-sm bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <ReviewSection productId={product._id} className="mt-16" />
      </div>
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative max-w-4xl w-full">
              <Image
                src={
                  product.image?.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
                  "images/lamp.jpg"
                }
                alt={product.product_name}
                width={1200}
                height={1200}
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
