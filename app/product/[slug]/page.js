"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef, useContext } from "react";
import "@/app/_styles/global.css";
import BottomNavigation from "@/components/BottomNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";
import ReviewSection from "@/components/ReviewSection";
import ProductContext from "@/context/ProductContext";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug;
  const router = useRouter();
  const containerRef = useRef(null);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [qty, setQty] = useState(0);
  const [user, setUser] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [product, setProduct] = useState(null);
  const { products, isLoading } = useContext(ProductContext);
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if (scrollY + windowHeight < fullHeight - 50) {
        setIsBottomNavVisible(true);
      } else {
        setIsBottomNavVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      const storedProduct = JSON.parse(
        localStorage.getItem("lastVisitedProduct")
      );
      if (storedProduct && storedProduct.uniq_id === slug) {
        console.log(storedProduct);

        setProduct(storedProduct);
        return;
      }

      try {
        const foundProduct = products.find((p) => p.uniq_id === slug);
        if (foundProduct) {
          foundProduct.image = foundProduct.image
            .replace(/\s+/g, "")
            .replace(/[\[\]]/g, "");
          foundProduct.description = foundProduct.description
            .replace(/\s+/g, "")
            .replace(/[\[\]]/g, "");
          if (foundProduct.image.length < 20)
            foundProduct.image = foundProduct.description;

          setProduct(foundProduct);
          localStorage.setItem(
            "lastVisitedProduct",
            JSON.stringify(foundProduct)
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
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
      alert("Please log in to add items to your wishlist");
      router.push("/api/auth/signin");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URI}/api/wishlist/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsInWishlist(!isInWishlist);
        console.log("Wishlist updated:", data);
      } else {
        const errorData = await res.json();
        console.error("Failed to update wishlist:", errorData);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const handleCartClick = async (change) => {
    if (!user) {
      alert("Please log in to add items to your cart");
      router.push("/api/auth/signin");
      return;
    }

    const parsedChange = Number(change);
    if (isNaN(parsedChange)) {
      console.error("Invalid change value:", change);
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
        console.log("Cart Update Response:", data);

        const updatedCartItem = data.cart.items.find(
          (item) => item.product === product._id
        );
        console.log(updatedCartItem, "updated cart");

        if (updatedCartItem) {
          setQty(updatedCartItem.quantity);
        } else {
          setQty(0);
        }

        console.log("Cart updated successfully");
      } else {
        const errorData = await res.json();
        console.error("Failed to update cart:", errorData);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
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
        const imageUrl = (prod.image = prod.image
          .replace(/\s+/g, "")
          .replace(/[\[\]]/g, ""));

        return {
          ...prod,
          image: imageUrl,
        };
      }) || [];

  console.log(similarProducts);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!product) {
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative group bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 shadow-2xl"
            >
              <Image
                src={
                  product.image.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
                  "/lamp.jpg"
                }
                alt={product.product_name}
                width={600}
                height={600}
                className="w-full h-96 object-contain rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-4xl font-bold mb-4">
                  {product.product_name}
                </h1>
                <p className="text-gray-400 text-lg">{product.description}</p>
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                    ₹{product.discounted_price}
                  </span>
                  <span className="text-gray-400 line-through">
                    ₹{product.retail_price}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <button
                  onClick={() => toggleSection("about")}
                  className="flex items-center justify-between w-full group"
                >
                  <h3 className="text-xl font-semibold">Product Details</h3>
                  <ChevronDown
                    className={`w-6 h-6 transition-transform ${
                      expandedSection === "about" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSection === "about" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 text-gray-300 space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400">Category:</span>
                          <p>{product.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Brand:</span>
                          <p>{product.brand || "Unknown"}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Specifications:</span>
                        <ul className="list-disc pl-6 mt-2">
                          {product.specifications?.map((spec, i) => (
                            <li key={i}>{spec}</li>
                          )) || "No specifications available"}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 px-8 py-4 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-500 transition-all"
                  onClick={() => handleCartClick(qty === 0 ? 1 : 0)}
                >
                  {qty === 0 ? "Add to Cart" : "Update Cart"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors"
                  onClick={() => toggleWishlist(product._id)}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isInWishlist
                        ? "text-red-400 fill-red-400"
                        : "text-gray-300"
                    }`}
                  />
                </motion.button>
              </div>

              {qty > 0 && (
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => handleCartClick(-1)}
                    className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    -
                  </button>
                  <span className="text-xl font-medium">{qty}</span>
                  <button
                    onClick={() => handleCartClick(1)}
                    className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    +
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Similar Products</h2>
            <div className="relative group">
              <div
                ref={containerRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
              >
                {similarProducts.map((product) => (
                  <motion.div
                    key={product.uniq_id}
                    whileHover={{ scale: 1.02 }}
                    className="flex-shrink-0 w-72 bg-gray-800 rounded-xl p-4 hover:shadow-xl transition-all"
                  >
                    <Image
                      src={product.image}
                      alt={product.product_name}
                      width={400}
                      height={400}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold truncate">
                        {product.product_name}
                      </h3>
                      <p className="text-gray-400 mt-2">
                        ₹{product.discounted_price}
                      </p>
                      <button
                        onClick={() =>
                          router.push(`/product/${product.uniq_id}`)
                        }
                        className="mt-4 w-full py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                      >
                        View Product
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16">
            <ReviewSection productId={product._id} />
          </div>
        </div>
      </div>
      <BottomNavigation visible={isBottomNavVisible} />
    </>
  );
}
