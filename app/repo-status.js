"use client";

import { useContext } from 'react';
import { ProductContext } from '@/context/ProductContext';
import { CartContext } from '@/context/CartContext';
import { WishlistContext } from '@/context/WishlistContext';

export default function RepoStatus() {
  const { products, isLoading: productsLoading, error: productsError } = useContext(ProductContext);
  const { cartItems, loading: cartLoading, error: cartError } = useContext(CartContext);
  const { wishlistItems, loading: wishlistLoading, error: wishlistError } = useContext(WishlistContext);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Repository Status</h1>
      
      <div className="space-y-6">
        <StatusSection 
          title="Products Context"
          items={products?.length || 0}
          loading={productsLoading}
          error={productsError}
        />

        <StatusSection 
          title="Cart Context"
          items={cartItems?.length || 0}
          loading={cartLoading}
          error={cartError}
        />

        <StatusSection 
          title="Wishlist Context"
          items={wishlistItems?.length || 0}
          loading={wishlistLoading}
          error={wishlistError}
        />
      </div>
    </div>
  );
}

const StatusSection = ({ title, items, loading, error }) => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <div className="space-y-2">
      <p>Items: <span className="text-emerald-400">{items}</span></p>
      <p>Status: 
        {loading ? (
          <span className="text-yellow-400 ml-2">Loading...</span>
        ) : error ? (
          <span className="text-red-400 ml-2">Error: {error}</span>
        ) : (
          <span className="text-green-400 ml-2">Connected</span>
        )}
      </p>
    </div>
  </div>
);
