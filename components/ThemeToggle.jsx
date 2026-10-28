"use client";

import { flushSync } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MoonStar, SunMedium } from "lucide-react";

import { useTheme } from "@/context/ThemeContext";
import { EASE_OUT_EXPO } from "@/lib/motion";

export default function ThemeToggle() {
  const { mounted, resolvedTheme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  // Circular reveal from the button via the View Transitions API, falling back
  // to an instant switch where it is unsupported.
  const handleToggle = (event) => {
    const nextTheme = isDark ? "light" : "dark";
    const applyTheme = () => {
      flushSync(() => setTheme(nextTheme));
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      document.documentElement.style.colorScheme = nextTheme;
    };

    if (!document.startViewTransition || reduceMotion) {
      applyTheme();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(applyTheme);
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 right-4 z-[70] inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white/85 text-slate-700 shadow-[0_20px_40px_-20px_rgba(35,18,79,0.55)] backdrop-blur-xl transition-colors duration-300 hover:text-brand-600 dark:text-brand-200 md:bottom-6 md:right-6"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ y: 24, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -24, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="flex"
        >
          {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
