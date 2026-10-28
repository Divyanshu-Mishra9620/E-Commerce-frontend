"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

import { EASE_OUT_EXPO } from "@/lib/motion";

const formatValue = (value, decimals) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

export default function CountUp({
  value,
  decimals = 0,
  duration = 1.8,
  prefix = "",
  suffix = "",
  className,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!isInView || !node) return undefined;

    const render = (current) => {
      node.textContent = `${prefix}${formatValue(current, decimals)}${suffix}`;
    };

    if (reduceMotion) {
      render(value);
      return undefined;
    }

    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT_EXPO,
      onUpdate: render,
    });

    return () => controls.stop();
  }, [isInView, value, decimals, duration, prefix, suffix, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatValue(0, decimals)}
      {suffix}
    </span>
  );
}
