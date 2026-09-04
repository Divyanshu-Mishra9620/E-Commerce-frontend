"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";

import Spinner from "./Spinner";

const categories = [
  {
    title: "Fashion",
    image: "/clothes.jpg",
    description: "Trendy apparel for all occasions",
    accent: "from-rose-500/80 to-orange-400/80",
  },
  {
    title: "Home & Living",
    image: "/utensils.jpg",
    description: "Everything for your home",
    accent: "from-amber-500/80 to-yellow-400/80",
  },
  {
    title: "Beauty & Health",
    image: "/beauty.jpg",
    description: "Self-care essentials",
    accent: "from-pink-500/80 to-rose-400/80",
  },
  {
    title: "Sports & Outdoors",
    image: "/sports.jpg",
    description: "Gear for active lifestyles",
    accent: "from-emerald-500/80 to-lime-400/80",
  },
  {
    title: "Electronics",
    image: "/electronics.jpg",
    description: "Cutting-edge tech",
    accent: "from-blue-600/80 to-cyan-400/80",
  },
];

export default function ExploreGrid() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hoveredIndex, setHoveredIndex] = useState(null);

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

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="storefront-section py-12"
      >
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="storefront-kicker">
              <Compass className="h-3.5 w-3.5 text-blue-500" />
              Explore
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-950 md:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              Discover products across thoughtfully curated categories built for
              faster browsing.
            </p>
          </div>
          <span className="storefront-chip">Tap any card to jump in</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {categories.map((category, index) => (
            <motion.button
              key={category.title}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 text-left shadow-[0_30px_70px_-48px_rgba(15,23,42,0.42)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_34px_90px_-44px_rgba(37,99,235,0.32)]"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(event) => handleCategory(category.title, event)}
            >
              <div className="relative aspect-[4/4.8]">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  quality={90}
                  priority={index < 3}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.accent} via-slate-950/25 to-slate-950/70`}
                />
              </div>

              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <div className="flex justify-between">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    Featured
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                    {index + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-white/80">
                    {category.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition-all duration-300">
                    Shop Now
                    <ArrowRight
                      className={`h-4 w-4 transition-transform duration-300 ${
                        hoveredIndex === index ? "translate-x-1 text-blue-500" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>
    </>
  );
}
