"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Compass } from "lucide-react";

import SectionHeading from "@/components/fx/SectionHeading";
import SliderRail from "@/components/fx/SliderRail";
import { cn } from "@/lib/utils";
import Spinner from "./Spinner";

const categories = [
  {
    title: "Fashion",
    image: "/clothes.jpg",
    description: "Trendy apparel for all occasions",
    accent: "from-rose-500/70",
  },
  {
    title: "Home & Living",
    image: "/utensils.jpg",
    description: "Everything for your home",
    accent: "from-amber-500/70",
  },
  {
    title: "Beauty & Health",
    image: "/beauty.jpg",
    description: "Self-care essentials",
    accent: "from-fuchsia-500/70",
  },
  {
    title: "Sports & Outdoors",
    image: "/sports.jpg",
    description: "Gear for active lifestyles",
    accent: "from-emerald-500/70",
  },
  {
    title: "Electronics",
    image: "/electronics.jpg",
    description: "Cutting-edge tech",
    accent: "from-brand-500/70",
  },
];

const pad = (value) => String(value).padStart(2, "0");

export default function ExploreGrid() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCategory = (category, event) => {
    event.preventDefault();
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(category)}`);
    });
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm">
          <Spinner size="lg" className="text-white" />
        </div>
      )}

      <section className="storefront-section py-12 md:py-16">
        <SectionHeading
          kicker="Explore"
          icon={Compass}
          title="Shop by"
          highlight="category"
          description="Pick a lane and jump straight into a curated edit, from wardrobe staples to the latest tech."
          action={
            <span className="storefront-chip">
              <span className="font-display text-base font-bold text-slate-950">
                {pad(categories.length)}
              </span>
              curated categories
            </span>
          }
        />

        {/* Desktop: expanding accordion panels */}
        <div className="hidden h-[32rem] gap-3 lg:flex">
          {categories.map((category, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={category.title}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={(event) => handleCategory(category.title, event)}
                aria-label={`Shop ${category.title}`}
                className={cn(
                  "group relative min-w-0 overflow-hidden rounded-[1.75rem] text-left ring-1 ring-black/5 transition-[flex-grow] duration-700 ease-out-expo dark:ring-white/10",
                  isActive ? "flex-[4.5]" : "flex-[1]"
                )}
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority={index < 2}
                  className={cn(
                    "object-cover transition-all duration-1000 ease-out-expo",
                    isActive ? "scale-100 grayscale-0" : "scale-125 grayscale-[0.5]"
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t to-transparent transition-opacity duration-700",
                    category.accent,
                    isActive ? "opacity-70" : "opacity-0"
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-[#0b0a14]/90 via-[#0b0a14]/35 to-[#0b0a14]/10 transition-opacity duration-700",
                    isActive ? "opacity-80" : "opacity-100"
                  )}
                />

                <span className="absolute left-5 top-5 font-display text-sm font-bold text-[#fff]/70">
                  {pad(index + 1)}
                </span>

                {/* Collapsed label */}
                <span
                  className={cn(
                    "absolute bottom-6 left-1/2 -translate-x-1/2 rotate-180 whitespace-nowrap font-display text-xl font-bold text-[#fff] transition-opacity duration-300 [writing-mode:vertical-rl]",
                    isActive ? "opacity-0" : "opacity-100"
                  )}
                >
                  {category.title}
                </span>

                {/* Expanded content */}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 w-[24rem] p-7 transition-all ease-out-expo",
                    isActive
                      ? "translate-y-0 opacity-100 delay-200 duration-700"
                      : "pointer-events-none translate-y-6 opacity-0 duration-200"
                  )}
                >
                  <h3 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-[#fff]">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#fff]/75">
                    {category.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#fff] py-1.5 pl-4 pr-1.5 text-sm font-semibold text-[#0b0a14]">
                    Shop now
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b0a14] text-[#fff] transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Touch: swipeable cards */}
        <div className="lg:hidden">
          <SliderRail
            label="Shop by category"
            slideClassName="basis-[72%] sm:basis-[42%]"
          >
            {categories.map((category, index) => (
              <button
                key={category.title}
                type="button"
                onClick={(event) => handleCategory(category.title, event)}
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] text-left"
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 72vw, 42vw"
                  className="object-cover transition-transform duration-700 group-active:scale-105"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t via-[#0b0a14]/30 to-transparent",
                    category.accent
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a14]/85 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 font-display text-sm font-bold text-[#fff]/75">
                  {pad(index + 1)}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-[#fff]">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#fff]/75">{category.description}</p>
                </div>
              </button>
            ))}
          </SliderRail>
        </div>
      </section>
    </>
  );
}
