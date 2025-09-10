import useSWR from "swr";
import { useAuth } from "./useAuth";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const fetcher = async (url, token) => {
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
    console.error("Error fetching Order Details:", error);
  }
};

export function useOrderDetail(slug) {
  const { user } = useAuth();

  const swrKey = slug
    ? [`${BACKEND_URI}/api/orders/order/${slug}`, user?.accessToken]
    : null;

  const { data, error, isLoading } = useSWR(swrKey, ([url, token]) =>
    fetcher(url, token)
  );

  return {
    order: data,
    isLoading,
    error,
  };
}
