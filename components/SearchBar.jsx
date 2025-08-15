"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Spinner from "./Spinner";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
        className="w-full px-4 py-2 text-sm text-gray-200 bg-gray-800 border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-300"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        aria-label="Search"
      >
        {isPending ? (
          <Spinner size="sm" className="text-blue-500" />
        ) : (
          <Search size={20} />
        )}
      </button>
    </form>
  );
};
