"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { motion } from "framer-motion";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { mounted, resolvedTheme, toggleTheme } = useTheme();

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-24 right-4 z-[70] inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 dark:border-stone-700/70 dark:bg-zinc-950/90 dark:text-stone-100 dark:shadow-black/60 dark:hover:border-amber-500/30 dark:hover:text-amber-200 md:bottom-6"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-amber-400 dark:text-stone-950">
        {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
      </span>
      <span className="hidden sm:inline">
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </motion.button>
  );
}
