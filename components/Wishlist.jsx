"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const WishlistSection = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) {
          throw new Error("User not found in localStorage");
        }

        const response = await fetch(`${BACKEND_URI}/api/wishlist/${user._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }

        const data = await response.json();
        console.log("Wishlist Data:", data);

        console.log(data.items);

        setWishlistItems(data.items || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-bold">
        Loading Wishlist...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-bold text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex-col mt-8 p-4 bg-pink-50 dark:bg-pink-900 rounded-lg shadow-sm">
      <h3 className="px-4 text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Your Wishlist ❤️
      </h3>

      {wishlistItems.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item, index) => (
            <ProductCard key={index} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistSection;
