"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import useSWR from "swr";
import { useAuth } from "./useAuth";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const authedFetcher = async (url, token) => {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "An error occurred.");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching sellers:", error);
  }
};

export function useSubscriptionCheck() {
  const { status } = useSession();
  const { user } = useAuth();

  const userId = user?._id;
  const token = user?.accessToken;

  const swrKey =
    userId && token
      ? [`${BACKEND_URI}/api/payments/payment/${userId}`, token]
      : null;

  const { data, error, isLoading } = useSWR(
    swrKey,
    ([url, token]) => authedFetcher(url, token),
    {
      revalidateOnFocus: false,
    }
  );

  const { subscription, isValid } = useMemo(() => {
    if (!data || !data.subscription) {
      return { subscription: null, isValid: false };
    }
    const now = new Date();
    const endDate = new Date(data.subscription._doc.endDate);
    if (endDate < now) {
      return { subscription: data.subscription, isValid: false };
    }
    return { subscription: data.subscription, isValid: true };
  }, [data]);

  return {
    subscription,
    isValid,
    error,
    subLoading:
      status === "loading" || (status === "authenticated" && isLoading),
  };
}
