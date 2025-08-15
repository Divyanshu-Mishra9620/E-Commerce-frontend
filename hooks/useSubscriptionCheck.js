"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const authedFetcher = async ([url, token]) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "An error occurred.");
  }
  return res.json();
};

export function useSubscriptionCheck() {
  const { data: session, status } = useSession();

  const userId = session?.user?._id;
  const token = session?.user?.accessToken;

  const swrKey =
    userId && token
      ? [`${BACKEND_URI}/api/payments/payment/${userId}`, token]
      : null;

  const { data, error, isLoading } = useSWR(swrKey, authedFetcher, {
    revalidateOnFocus: false,
  });

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
