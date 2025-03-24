"use client";
import BottomNavigation from "@/components/BottomNavigation";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children, session }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        console.log(typeof window);
        router.push("/api/auth/signin");
      }
    }
  }, [router]);
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar user={user} />
                {children}
                <BottomNavigation />
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </SessionProvider>
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
