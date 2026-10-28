"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

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
                    background: "rgba(20, 18, 33, 0.96)",
                    color: "#f6f5ff",
                    border: "1px solid rgba(84, 76, 130, 0.45)",
                  }
                : {
                    background: "#ffffff",
                    color: "#0f0d1f",
                    border: "1px solid rgba(226, 224, 245, 1)",
                  },
              iconTheme: isDarkTheme
                ? { primary: "#b8a9ff", secondary: "#0b0a14" }
                : { primary: "#6338ee", secondary: "#ffffff" },
            }}
          />
        </WishlistProvider>
      </CartProvider>
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
