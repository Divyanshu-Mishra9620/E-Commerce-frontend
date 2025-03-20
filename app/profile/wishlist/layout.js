"use client";
import { WishlistProvider } from "@/context/WishlistContext";

export default function RootLayout({ children }) {
  return <WishlistProvider>{children}</WishlistProvider>;
}
