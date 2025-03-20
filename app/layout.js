"use client";

import { ProductProvider } from "@/context/ProductContext";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <ProductProvider>{children}</ProductProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
