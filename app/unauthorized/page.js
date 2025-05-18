"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="h-16 w-16 text-yellow-500 mx-auto" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          403 - Unauthorized Access
        </h1>
        <p className="mt-4 text-gray-600">
          You don't have permission to view this page.
        </p>
        <p className="mt-2 text-gray-600">
          Redirecting to homepage in 5 seconds...
        </p>
      </div>
    </div>
  );
}
