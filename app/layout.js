"use client";
import BottomNavigation from "@/components/BottomNavigation";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { NavigationProvider } from "@/context/NavigationContext";

export default function RootLayout({ children, session }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.push("/api/auth/signin");
      }
    }
  }, [router]);

  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        <NavigationProvider>
          <SessionProvider session={session}>
            <ProductProvider>
              <CartProvider>
                <WishlistProvider>
                  {!isAdminRoute && <Navbar user={user} />}
                  {children}
                  {!isAdminRoute && <BottomNavigation />}
                </WishlistProvider>
              </CartProvider>
            </ProductProvider>
          </SessionProvider>
        </NavigationProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
            success: {
              style: { background: "#4caf50" },
            },
            error: {
              style: { background: "#f44336" },
            },
          }}
        />
      </body>
    </html>
  );
}
