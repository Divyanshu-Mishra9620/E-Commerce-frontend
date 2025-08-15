"use client";
import { createContext, useState, useMemo } from "react";
import useSWR from "swr";
import { fetchProducts } from "@/utils/fetchData";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8000);

  const { data, error, isLoading } = useSWR(
    ["products", page, limit],
    () => fetchProducts(page, limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
    }
  );

  const value = useMemo(
    () => ({
      products: data?.products || [],
      totalPages: data?.totalPages || 1,
      currentPage: page,
      setPage,
      isLoading: isLoading && !data,
      error,
    }),
    [data, page, isLoading, error]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContext;
