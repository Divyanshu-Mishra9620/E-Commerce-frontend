"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import Spinner from "./Spinner";
import { cn } from "@/lib/utils";

const isTypingTarget = (element) =>
  element?.isContentEditable ||
  ["INPUT", "TEXTAREA", "SELECT"].includes(element?.tagName);

export const SearchBar = ({ className = "" }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const inputRef = useRef(null);

  // "/" or Ctrl/Cmd + K focuses the search from anywhere on the page.
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) {
      setShortcutLabel("⌘K");
    }


    const handleShortcut = (event) => {
      const isCommandK =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const isSlash = event.key === "/" && !isTypingTarget(document.activeElement);

      if (isCommandK || isSlash) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className={cn("w-full", className)} role="search">
      <div className="storefront-input group flex h-11 items-center gap-2.5 pl-4 pr-1.5 transition-all duration-500 ease-out-expo focus-within:border-brand-300 focus-within:shadow-[0_0_0_5px_rgba(118,85,250,0.12)] dark:focus-within:border-brand-400/50">
        <Search className="h-4 w-4 flex-shrink-0 text-slate-400 transition-colors group-focus-within:text-brand-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          aria-label="Search products"
          className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {!query && !isFocused && (
          <kbd className="hidden shrink-0 rounded-md border border-slate-200 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-slate-400 lg:inline-block">
            {shortcutLabel}
          </kbd>
        )}
        <button
          type="submit"
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f0d1f] text-[#fff] transition-all duration-500 ease-out-expo hover:bg-brand-600 disabled:cursor-not-allowed dark:bg-[#f0eeff] dark:text-[#0f0d1f] dark:hover:bg-brand-300",
            query ? "scale-100 opacity-100" : "scale-75 opacity-60"
          )}
          aria-label="Search"
          disabled={isPending}
        >
          {isPending ? (
            <Spinner size="xs" className="text-current" />
          ) : (
            <ArrowRight size={15} />
          )}
        </button>
      </div>
    </form>
  );
};
