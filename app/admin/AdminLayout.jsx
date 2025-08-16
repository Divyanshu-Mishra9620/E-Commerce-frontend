"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/PageLoader";

export default function AdminLayout({ children }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router, user]);
  if (isLoading || user?.role !== "admin") {
    return <PageLoader />;
  }
  return <>{children}</>;
}
