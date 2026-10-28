"use client";

import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

import Magnetic from "@/components/fx/Magnetic";
import { EASE_OUT_EXPO } from "@/lib/motion";
import {
  formatCurrency,
  getCategoryLabel,
  getCleanDescription,
  getDiscountPercent,
  getDisplayPrices,
  getReviewSummary,
  pluralize,
  RUPEE_SYMBOL,
  sanitizeProductImage,
} from "@/lib/product-display";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6500;
const SWIPE_THRESHOLD = 80;
const MAX_TITLE_WORDS = 7;
const EASE_IN = [0.7, 0, 0.84, 0];

const pad = (value) => String(value).padStart(2, "0");

const titleWords = (name = "") => {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length <= MAX_TITLE_WORDS) return words;

  const trimmed = words.slice(0, MAX_TITLE_WORDS);
  trimmed[trimmed.length - 1] += "…";
  return trimmed;
};

const copyStagger = {
  enter: {},
  center: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const wordRise = {
  enter: { y: "110%" },
  center: { y: "0%", transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
  exit: { y: "-110%", transition: { duration: 0.35, ease: EASE_IN } },
};

const fadeUp = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: EASE_IN } },
};

const stageSlide = {
  enter: (direction) => ({
    x: direction > 0 ? 140 : -140,
    opacity: 0,
    scale: 0.9,
    rotate: direction > 0 ? 8 : -8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 1.1, ease: EASE_OUT_EXPO },
  },
  exit: (direction) => ({
    x: direction > 0 ? -140 : 140,
    opacity: 0,
    scale: 0.9,
    rotate: direction > 0 ? -8 : 8,
    transition: { duration: 0.45, ease: EASE_IN },
  }),
};

export default function Hero({ products }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { amount: 0.35 });

  const slides = useMemo(
    () => (Array.isArray(products) ? products.slice(0, 5) : []),
    [products]
  );
  const total = slides.length;

  const [[rawIndex, direction], setSlide] = useState([0, 1]);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const index = total ? rawIndex % total : 0;

  const paginate = useCallback(
    (step) => {
      if (total < 2) return;
      setSlide(([current]) => [(current + step + total) % total, step]);
    },
    [total]
  );

  const goTo = useCallback((target) => {
    setSlide(([current]) =>
      target === current ? [current, 1] : [target, target > current ? 1 : -1]
    );
  }, []);

  // Pointer parallax: -0.5..0.5 across the hero, smoothed with a spring.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 110, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 110, damping: 20 });
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const imageX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const imageY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);
  const chipX = useTransform(smoothX, [-0.5, 0.5], [28, -28]);
  const chipY = useTransform(smoothY, [-0.5, 0.5], [20, -20]);

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") paginate(1);
    if (event.key === "ArrowLeft") paginate(-1);
  };

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    const swipe = info.offset.x + info.velocity.x * 0.2;

    if (swipe < -SWIPE_THRESHOLD) paginate(1);
    else if (swipe > SWIPE_THRESHOLD) paginate(-1);
  };

  if (total === 0) {
    return null;
  }

  const product = slides[index];
  const slideKey = product?.uniq_id || product?._id || index;
  const { salePrice, originalPrice } = getDisplayPrices(product);
  const discount = getDiscountPercent(product);
  const { rating, count } = getReviewSummary(product);
  const words = titleWords(product?.product_name);
  const category = getCategoryLabel(product, "");
  const description = getCleanDescription(product);

  const autoplay = total > 1 && !reduceMotion;
  const isPaused = isHovered || isDragging || !isInView;

  return (
    <section className="storefront-section pt-2">
      <div
        ref={heroRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={(event) => event.pointerType === "mouse" && setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured products"
        className="relative isolate overflow-hidden rounded-[2rem] bg-[#0b0a14] text-white shadow-[0_60px_120px_-60px_rgba(35,18,79,0.85)] ring-1 ring-white/10 sm:rounded-[2.5rem]"
      >
        {/* Backdrop: drifting aurora, masked grid and a top hairline */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 -top-48 h-[36rem] w-[36rem] rounded-full bg-brand-600/45 blur-[120px] motion-safe:animate-aurora" />
          <div className="absolute -bottom-56 right-[-12%] h-[32rem] w-[32rem] rounded-full bg-coral-500/25 blur-[120px] motion-safe:animate-aurora [animation-delay:-7s]" />
          <div className="absolute left-1/2 top-1/3 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-[100px]" />
          <div className="bg-grid mask-radial absolute inset-0 opacity-60" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        <div className="grid grid-cols-1 items-center gap-6 px-6 pb-6 pt-8 sm:px-10 lg:min-h-[36rem] lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:px-14 lg:pt-14">
          {/* Copy */}
          <div
            className="relative z-10 order-2 lg:order-1"
            aria-live={isPaused ? "polite" : "off"}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slideKey}
                variants={copyStagger}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75 motion-safe:animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-400" />
                    </span>
                    Featured drop
                  </span>
                  {category && (
                    <span className="max-w-[14rem] truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                      {category}
                    </span>
                  )}
                </motion.div>

                <h1 className="mt-6 font-display text-[2.4rem] font-extrabold leading-[1] tracking-[-0.045em] sm:text-6xl lg:text-[4.1rem]">
                  {words.map((word, wordIndex) => (
                    <Fragment key={`${word}-${wordIndex}`}>
                      {/* Real spaces between words keep the title readable for screen readers and copy-paste */}
                      {wordIndex > 0 && " "}
                      <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                        <motion.span
                          variants={wordRise}
                          className={cn(
                            "inline-block",
                            wordIndex === words.length - 1 &&
                              "bg-gradient-to-r from-brand-300 via-fuchsia-300 to-coral-300 bg-clip-text text-transparent"
                          )}
                        >
                          {word}
                        </motion.span>
                      </span>
                    </Fragment>
                  ))}
                </h1>

                {description && (
                  <motion.p
                    variants={fadeUp}
                    className="mt-5 line-clamp-2 max-w-xl text-base leading-7 text-white/60 md:text-lg"
                  >
                    {description}
                  </motion.p>
                )}

                <motion.div
                  variants={fadeUp}
                  className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2"
                >
                  <p className="font-display text-4xl font-bold tracking-tight">
                    {RUPEE_SYMBOL}
                    {formatCurrency(salePrice)}
                  </p>
                  {originalPrice > salePrice && (
                    <p className="pb-1 text-lg text-white/40 line-through">
                      {RUPEE_SYMBOL}
                      {formatCurrency(originalPrice)}
                    </p>
                  )}
                  {discount > 0 && (
                    <span className="mb-1.5 rounded-full bg-coral-500 px-2.5 py-1 text-xs font-bold text-[#fff] shadow-lg shadow-coral-500/30">
                      &minus;{discount}%
                    </span>
                  )}
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="mt-8 flex flex-wrap items-center gap-3"
                >
                  <Magnetic>
                    <button
                      type="button"
                      onClick={() => router.push(`/product/${product?.uniq_id}`)}
                      className="group inline-flex items-center gap-4 rounded-full bg-[#fff] py-2 pl-6 pr-2 text-sm font-semibold text-[#0b0a14] transition-shadow duration-500 hover:shadow-[0_0_48px_-6px_rgba(149,123,255,0.85)]"
                    >
                      Shop this drop
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b0a14] text-[#fff] transition-transform duration-500 ease-out-expo group-hover:-rotate-45">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </button>
                  </Magnetic>
                  <Link
                    href="/categories"
                    className="inline-flex items-center rounded-full border border-white/15 px-5 py-3.5 text-sm font-semibold text-white/75 transition-colors duration-300 hover:border-white/40 hover:text-[#fff]"
                  >
                    Browse categories
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Product stage */}
          <div
            className="relative order-1 mx-auto w-full max-w-[15rem] sm:max-w-[22rem] lg:order-2 lg:max-w-[30rem]"
            style={{ perspective: 1200 }}
          >
            <motion.div
              style={{ rotateX, rotateY }}
              className="relative aspect-square w-full"
            >
              <div
                aria-hidden
                className="absolute inset-[6%] rounded-full bg-[conic-gradient(from_0deg,#7655fa,#ff6a3d,#c084fc,#7655fa)] opacity-55 blur-3xl motion-safe:animate-spin-slow"
              />
              <div
                aria-hidden
                className="absolute inset-[2%] rounded-full border border-dashed border-white/10 motion-safe:animate-spin-slow [animation-direction:reverse]"
              />
              <div aria-hidden className="absolute inset-[12%] rounded-full border border-white/10" />

              <AnimatePresence custom={direction}>
                <motion.div
                  key={slideKey}
                  custom={direction}
                  variants={stageSlide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag={total > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.45}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
                >
                  <motion.div
                    style={{ x: imageX, y: imageY }}
                    className="absolute inset-[14%] overflow-hidden rounded-[2rem] bg-[#fff] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/20"
                  >
                    <Image
                      src={sanitizeProductImage(product?.image)}
                      alt={product?.product_name || "Featured product"}
                      fill
                      sizes="(max-width: 1024px) 70vw, 30rem"
                      draggable={false}
                      className="select-none object-contain p-6"
                      priority={index === 0}
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Floating chips sit outside the tilted stage so they always layer on top */}
            <motion.div
              style={{ x: chipX, y: chipY }}
              className="pointer-events-none absolute left-0 top-[16%] z-10 sm:-left-6"
            >
              <div className="flex items-center gap-2 whitespace-nowrap rounded-2xl border border-white/15 bg-[#0b0a14]/60 px-3 py-2 text-xs font-semibold shadow-2xl backdrop-blur-xl motion-safe:animate-float sm:px-3.5 sm:py-2.5 sm:text-sm">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                {count > 0 ? (
                  <span>
                    {rating.toFixed(1)}
                    <span className="ml-1 font-normal text-white/60">
                      &middot; {pluralize(count, "review")}
                    </span>
                  </span>
                ) : (
                  <span>Fresh arrival</span>
                )}
              </div>
            </motion.div>

            {originalPrice > salePrice && (
              <motion.div
                style={{ x: chipX, y: chipY }}
                className="pointer-events-none absolute bottom-[12%] right-0 z-10 sm:-right-6"
              >
                <div className="rounded-2xl border border-white/15 bg-[#0b0a14]/60 px-3 py-2 shadow-2xl backdrop-blur-xl motion-safe:animate-float [animation-delay:-3s] sm:px-4 sm:py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    You save
                  </p>
                  <p className="font-display text-lg font-bold text-coral-300">
                    {RUPEE_SYMBOL}
                    {formatCurrency(originalPrice - salePrice)}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Controls: counter, story-style progress thumbnails, arrows */}
        {total > 1 && (
          <div className="flex items-center gap-4 border-t border-white/10 px-6 py-5 sm:gap-6 sm:px-10 lg:px-14">
            <div className="flex items-baseline gap-1.5 font-display tabular-nums">
              <span className="relative block h-8 w-[2ch] overflow-hidden text-2xl font-bold leading-8">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.span
                    key={index}
                    custom={direction}
                    initial={{ y: direction > 0 ? "100%" : "-100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: direction > 0 ? "-100%" : "100%" }}
                    transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                    className="absolute inset-0"
                  >
                    {pad(index + 1)}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-sm text-white/40">/ {pad(total)}</span>
            </div>

            <div className="flex flex-1 gap-2 sm:gap-3">
              {slides.map((slide, slideIndex) => {
                const isActive = slideIndex === index;

                return (
                  <button
                    key={slide?.uniq_id || slideIndex}
                    type="button"
                    onClick={() => goTo(slideIndex)}
                    aria-label={`Show ${slide?.product_name || `slide ${slideIndex + 1}`}`}
                    aria-current={isActive}
                    className="group flex-1 py-2 text-left"
                  >
                    <span className="mb-3 hidden items-center gap-3 lg:flex">
                      <span
                        className={cn(
                          "relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#fff] ring-1 transition duration-500",
                          isActive ? "ring-white/60" : "opacity-50 ring-white/10 group-hover:opacity-90"
                        )}
                      >
                        <Image
                          src={sanitizeProductImage(slide?.image)}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </span>
                      <span
                        className={cn(
                          "line-clamp-2 text-xs font-medium leading-snug transition-colors duration-300",
                          isActive ? "text-white" : "text-white/45 group-hover:text-white/75"
                        )}
                      >
                        {slide?.product_name}
                      </span>
                    </span>

                    <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/15">
                      {isActive && (
                        <span
                          key={`${index}-${autoplay}`}
                          className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-brand-300 to-coral-300"
                          style={
                            autoplay
                              ? {
                                  animation: `hero-progress ${AUTOPLAY_MS}ms linear forwards`,
                                  animationPlayState: isPaused ? "paused" : "running",
                                }
                              : undefined
                          }
                          onAnimationEnd={autoplay ? () => paginate(1) : undefined}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => paginate(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition duration-300 hover:border-white/50 hover:bg-white/10 hover:text-[#fff]"
                aria-label="Previous slide"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition duration-300 hover:border-white/50 hover:bg-white/10 hover:text-[#fff]"
                aria-label="Next slide"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
