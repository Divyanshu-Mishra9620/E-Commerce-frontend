"use client";

import Link from "next/link";
import { Heart, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import SectionHeading from "@/components/fx/SectionHeading";
import SliderRail from "@/components/fx/SliderRail";
import { authedFetch } from "@/utils/authedFetch";
import ProductCard from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";

const heading = {
  kicker: "Wishlist",
  icon: Heart,
  title: "Your saved",
  highlight: "selections",
};

const WishlistSection = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?._id;
  const swrKey = userId ? `/api/wishlist/${userId}` : null;

  const { data, error } = useSWR(swrKey, authedFetch, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  if (status === "loading" || (!data && !error && status === "authenticated")) {
    return (
      <section className="storefront-section py-12 md:py-16">
        <SectionHeading {...heading} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (status === "unauthenticated") {
    return (
      <section className="storefront-section py-12">
        <div className="storefront-empty flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <Lock className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-bold text-slate-950">
              Sign in to view your wishlist
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
              Your saved products will appear here once you log in and start
              bookmarking items.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="storefront-section py-12">
        <div className="storefront-empty px-6 py-12 text-center text-rose-500">
          Error loading wishlist: {error.message}
        </div>
      </div>
    );
  }

  const wishlistItems = (data?.items || []).filter((item) => item.product);

  return (
    <section className="storefront-section py-12 md:py-16">
      <SectionHeading
        {...heading}
        description="A neat shelf of the products you want to revisit later."
        action={
          <Link href="/profile/wishlist" className="storefront-chip transition-colors hover:text-brand-600">
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
            {wishlistItems.length} item{wishlistItems.length === 1 ? "" : "s"} saved
          </Link>
        }
      />

      {wishlistItems.length === 0 ? (
        <div className="storefront-empty flex flex-col items-center gap-3 px-6 py-14 text-center">
          <Heart className="h-8 w-8 text-rose-400" />
          <p className="text-slate-500">
            No items saved yet. Tap the heart on anything you love.
          </p>
        </div>
      ) : (
        <SliderRail label="Wishlist">
          {wishlistItems.map((item, index) => (
            <ProductCard key={item.product?._id || index} product={item.product} />
          ))}
        </SliderRail>
      )}
    </section>
  );
};

export default WishlistSection;
