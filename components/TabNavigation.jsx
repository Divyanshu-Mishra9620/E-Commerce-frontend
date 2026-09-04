"use client";
import { motion } from "framer-motion";
import { Home, Sparkles } from "lucide-react";
import Spinner from "./Spinner";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "Home", label: "Home", icon: Home, activeIconColor: "text-blue-500" },
  {
    id: "ProductSeller",
    label: "Popular",
    icon: Sparkles,
    activeIconColor: "text-emerald-500",
  },
];

const TabNavigation = ({ activeTab = "Home", handleTabChange, isTabLoading }) => {
  const handleTabClick = (tab) => {
    handleTabChange(tab);
  };

  return (
    <div className="storefront-section pt-20 sm:pt-24">
      <div className="sticky top-[76px] z-40 sm:top-[88px]">
        <div className="storefront-panel relative p-2">
          {isTabLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[1.75rem] bg-white/75 backdrop-blur-sm">
              <Spinner size="sm" className="text-blue-600" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {tabs.map(({ id, label, icon: Icon, activeIconColor }) => {
              const isActive = activeTab === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTabClick(id)}
                  className={cn(
                    "relative overflow-hidden rounded-[1.35rem] px-4 py-3 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "text-slate-950"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-[1.35rem] bg-white shadow-lg shadow-slate-200/70"
                      initial={false}
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? activeIconColor : "text-slate-400"
                      )}
                    />
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
