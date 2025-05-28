"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function useSubscriptionCheck() {
  const BACKEND_URI =
    process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:5000";
  const router = useRouter();

  const [subscription, setSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSubscription = async () => {
      setSubLoading(true);
      setError(null);

      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
          router.push("/api/auth/signin");
          return;
        }

        const response = await fetch(
          `${BACKEND_URI}/api/payments/payment/${storedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch subscription");
        }

        const data = await response.json();

        if (!data.subscription) {
          throw new Error("No active subscription found");
        }

        const now = new Date();
        const endDate = new Date(data.subscription.endDate);

        if (endDate < now) {
          throw new Error("Subscription has expired");
        }

        setSubscription(data.subscription);
        setIsValid(true);
      } catch (err) {
        console.error("Subscription check error:", err);
        setError(err.message);
        setIsValid(false);
        toast.error(err.message || "Subscription verification failed");
      } finally {
        setSubLoading(false);
      }
    };

    checkSubscription();
  }, [router, BACKEND_URI]);

  return { subscription, subLoading, isValid, error };
}
