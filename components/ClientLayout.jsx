"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NavigationProvider } from "@/context/NavigationContext";

import Navbar from "@/components/Navbar";
import BottomNavigation from "@/components/BottomNavigation";

export function ClientLayout({ children, session }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/api/auth");
  const isPaymentRoute = pathname.startsWith("/payment");

  return (
    <NavigationProvider>
      <SessionProvider
        session={session}
        refetchInterval={5 * 60}
        refetchOnWindowFocus={true}
      >
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              {!isAdminRoute && !isLoginRoute && !isPaymentRoute && <Navbar />}

              <main>{children}</main>

              {!isAdminRoute && !isLoginRoute && !isPaymentRoute && (
                <BottomNavigation />
              )}

              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: { background: "#333", color: "#fff" },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </SessionProvider>
    </NavigationProvider>
  );
}
