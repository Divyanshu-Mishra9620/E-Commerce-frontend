"use client";

import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_EXPO } from "@/lib/motion";

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 48,
  amount = 0.15,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
