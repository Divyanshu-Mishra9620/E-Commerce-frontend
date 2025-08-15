"use client";
import useSWR from "swr";
import { useAuth } from "./useAuth";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function useUserReviews() {
  const { user } = useAuth();

  const swrKey = user?._id
    ? `${BACKEND_URI}/api/reviews/user/${user?._id}`
    : null;
  const { data, error, isLoading } = useSWR(swrKey, fetcher);

  return {
    reviews: data || [],
    isLoading,
    error,
  };
}
