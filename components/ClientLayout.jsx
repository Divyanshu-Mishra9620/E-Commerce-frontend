"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NavigationProvider } from "@/context/NavigationContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

import Navbar from "@/components/Navbar";
import BottomNavigation from "@/components/BottomNavigation";
import ThemeToggle from "@/components/ThemeToggle";

function AppShell({ children, session }) {
  const pathname = usePathname();
  const { resolvedTheme, mounted } = useTheme();
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/api/auth");
  const isPaymentRoute = pathname.startsWith("/payment");
  const passwordRoutes = pathname.startsWith(
    "/reset-password" || "/forgot-password"
  );
  const isDarkTheme = mounted && resolvedTheme === "dark";

  return (
    <SessionProvider
      session={session}
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            {!isAdminRoute &&
              !isLoginRoute &&
              !isPaymentRoute &&
              !passwordRoutes && <Navbar />}

            <main className="min-h-screen">{children}</main>

            {!isAdminRoute &&
              !isLoginRoute &&
              !isPaymentRoute &&
              !passwordRoutes && <BottomNavigation />}

            <ThemeToggle />

            <Toaster
              position="bottom-right"
              toastOptions={{
                style: isDarkTheme
                  ? {
                      background: "rgba(24, 24, 27, 0.96)",
                      color: "#f5f5f4",
                      border: "1px solid rgba(120, 113, 108, 0.35)",
                    }
                  : {
                      background: "#ffffff",
                      color: "#0f172a",
                      border: "1px solid rgba(226, 232, 240, 1)",
                    },
                iconTheme: isDarkTheme
                  ? { primary: "#d6a14a", secondary: "#18181b" }
                  : { primary: "#2563eb", secondary: "#ffffff" },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </SessionProvider>
  );
}

export function ClientLayout({ children, session }) {
  return (
    <NavigationProvider>
      <ThemeProvider>
        <AppShell session={session}>{children}</AppShell>
      </ThemeProvider>
    </NavigationProvider>
  );
}
