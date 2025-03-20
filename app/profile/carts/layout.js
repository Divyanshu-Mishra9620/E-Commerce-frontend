"use client";
import { CartProvider } from "@/context/CartContext";

export default function Layout({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
