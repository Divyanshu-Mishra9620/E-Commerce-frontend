"use client";

import { Children, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const DEFAULT_SLIDE =
  "basis-[82%] sm:basis-[46%] lg:basis-[31.5%] xl:basis-[24%]";

// Drag-free Embla rail with keyboard support, a scroll-linked progress bar and
// prev/next controls. Each child becomes one slide.
export default function SliderRail({
  children,
  label = "Product carousel",
  slideClassName = DEFAULT_SLIDE,
  options,
  className,
}) {
  const [viewportRef, embla] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
    ...options,
  });
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!embla) return undefined;

    const syncProgress = () => {
      setProgress(Math.min(1, Math.max(0, embla.scrollProgress())));
    };
    const syncButtons = () => {
      setCanPrev(embla.canScrollPrev());
      setCanNext(embla.canScrollNext());
    };
    const syncAll = () => {
      syncProgress();
      syncButtons();
    };

    syncAll();
    embla.on("scroll", syncProgress);
    embla.on("select", syncButtons);
    embla.on("settle", syncButtons);
    embla.on("reInit", syncAll);

    return () => {
      embla.off("scroll", syncProgress);
      embla.off("select", syncButtons);
      embla.off("settle", syncButtons);
      embla.off("reInit", syncAll);
    };
  }, [embla]);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  };

  const isScrollable = canPrev || canNext;

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        ref={viewportRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="-my-6 cursor-grab overflow-hidden rounded-[1.75rem] focus-visible:outline-offset-4 active:cursor-grabbing"
      >
        <div className="-ml-5 flex touch-pan-y py-6">
          {Children.map(children, (child) => (
            <div
              role="group"
              aria-roledescription="slide"
              className={cn("min-w-0 shrink-0 grow-0 pl-5", slideClassName)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {isScrollable && (
        <div className="mt-6 flex items-center gap-5">
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
            <div
              className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-brand-gradient"
              style={{ transform: `scaleX(${Math.max(progress, 0.06)})` }}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canPrev}
              className="icon-btn"
              aria-label="Previous slides"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canNext}
              className="icon-btn"
              aria-label="Next slides"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
