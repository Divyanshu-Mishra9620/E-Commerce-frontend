"use client";
import { motion } from "framer-motion";
import { Flame, Home } from "lucide-react";
import Spinner from "./Spinner";
import { useScrollHandler } from "@/hooks/useScrollHandler";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "Home", label: "Home", icon: Home },
  { id: "ProductSeller", label: "Popular", icon: Flame },
];

// Sticky segmented control. It must be a direct child of a tall container
// (the page <main>) for `position: sticky` to hold while scrolling.
const TabNavigation = ({ activeTab = "Home", handleTabChange, isTabLoading }) => {
  const { isVisible } = useScrollHandler();

  return (
    <div
      className={cn(
        "pointer-events-none sticky top-[72px] z-40 flex justify-center px-4 py-3 transition-all duration-500 ease-out-expo",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-28 opacity-0"
      )}
    >
      <div
        role="tablist"
        aria-label="Storefront views"
        className={cn(
          "storefront-panel-soft relative flex gap-1 rounded-full p-1.5",
          isVisible && "pointer-events-auto"
        )}
      >
        {isTabLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-white/75 backdrop-blur-sm">
            <Spinner size="sm" />
          </div>
        )}
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(id)}
              className="relative rounded-full px-5 py-2 text-sm font-semibold sm:px-6"
            >
              {isActive && (
                <motion.span
                  layoutId="storefront-tab-indicator"
                  className="absolute inset-0 rounded-full bg-[#0f0d1f] shadow-lg shadow-brand-900/25 dark:bg-[#f0eeff]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex items-center gap-2 transition-colors duration-300",
                  isActive
                    ? "text-[#fff] dark:text-[#0f0d1f]"
                    : "text-slate-500 hover:text-slate-950"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive && "text-coral-400 dark:text-coral-500")} />
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
