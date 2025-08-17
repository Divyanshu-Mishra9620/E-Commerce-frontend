import useSWR from "swr";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useOrderDetail(slug) {
  const swrKey = slug ? `${BACKEND_URI}/api/orders/order/${slug}` : null;

  const { data, error, isLoading } = useSWR(swrKey, fetcher);

  return {
    order: data,
    isLoading,
    error,
  };
}
