"use client";
import useSWR from "swr";
import { useAuth } from "./useAuth";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function useUserProfile() {
  const { user, isLoading: authLoading } = useAuth();
  if (authLoading) return null;

  const userId = user?._id;

  const swrKey = userId ? `${BACKEND_URI}/api/users/${userId}` : null;

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher);

  return {
    profile: data,
    isLoading,
    error,
    mutate,
  };
}
