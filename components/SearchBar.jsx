"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Spinner from "./Spinner";
import { cn } from "@/lib/utils";

export const SearchBar = ({ className = "" }) => {
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
    <form onSubmit={handleSearch} className={cn("w-full", className)}>
      <div className="storefront-input group flex h-12 items-center gap-3 pl-4 pr-2 transition-all duration-300 focus-within:-translate-y-0.5 focus-within:border-blue-200 focus-within:shadow-lg focus-within:shadow-blue-100/80 dark:focus-within:border-amber-500/30 dark:focus-within:shadow-[0_18px_40px_-24px_rgba(161,98,7,0.42)]">
        <Search className="h-4 w-4 flex-shrink-0 text-slate-400 transition-colors group-focus-within:text-blue-500 dark:group-focus-within:text-amber-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="h-full w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:scale-105 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-80 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400"
          aria-label="Search"
          disabled={isPending}
        >
          {isPending ? (
            <Spinner size="xs" className="text-white" />
          ) : (
            <Search size={16} />
          )}
        </button>
      </div>
    </form>
  );
};
