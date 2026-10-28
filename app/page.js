"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import Hero from "@/components/Hero";
import MarqueeBand from "@/components/MarqueeBand";
import Explore from "@/components/Explore";
import BestDeals from "@/components/BestDeals";
import PerksBento from "@/components/PerksBento";
import Deals from "@/components/Deals";
import WishlistSection from "@/components/Wishlist";
import MostVisitedSection from "@/components/MostVisitedSection";
import Footer from "@/components/Footer";
import Reveal from "@/components/fx/Reveal";
import { useState } from "react";
import PageLoader from "@/components/PageLoader";
import TabNavigation from "@/components/TabNavigation";
import ProductSeller from "@/components/ProductSeller";
import { useSession } from "next-auth/react";
import { useHomepageData } from "@/hooks/useHomepageData";
import { useRouter } from "next/navigation";

export default function Page() {
  const { products, isLoading, error, retry } = useHomepageData();
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [activeTab, setActiveTab] = useState("Home");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Products are public, so render as soon as they arrive instead of also
  // waiting on the session check (which can be slow while a token refreshes).
  if (status === "unauthenticated" || isLoading) {
    return <PageLoader />;
  }

  if (error && products.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-rose-500">Failed to load products.</p>
        <button type="button" onClick={retry} className="btn-primary">
          <span>Try again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-brand-gradient"
        style={{ scaleX }}
      />

      {/* overflow-x-clip (not hidden) keeps the sticky tab bar working */}
      <main className="relative overflow-x-clip pt-[72px]">
        <TabNavigation activeTab={activeTab} handleTabChange={handleTabChange} />

        {activeTab === "Home" && (
          <>
            <Hero products={products} />

            <MarqueeBand />

            <Reveal>
              <Explore />
            </Reveal>

            <Reveal>
              <BestDeals products={products} />
            </Reveal>

            <Reveal>
              <PerksBento products={products} />
            </Reveal>

            <Reveal>
              <Deals products={products} />
            </Reveal>

            <Reveal>
              <WishlistSection />
            </Reveal>

            <Reveal>
              <MostVisitedSection products={products} />
            </Reveal>
          </>
        )}
        {activeTab === "ProductSeller" && <ProductSeller />}
      </main>

      <Footer />
    </div>
  );
}
