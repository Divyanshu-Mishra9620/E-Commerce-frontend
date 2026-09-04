"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import Hero from "@/components/Hero";
import Explore from "@/components/Explore";
import BestDeals from "@/components/BestDeals";
import Deals from "@/components/Deals";
import WishlistSection from "@/components/Wishlist";
import MostVisitedSection from "@/components/MostVisitedSection";
import Footer from "@/components/Footer";
import { useState } from "react";
import PageLoader from "@/components/PageLoader";
import TabNavigation from "@/components/TabNavigation";
import ProductSeller from "@/components/ProductSeller";
import { useSession } from "next-auth/react";
import { useHomepageData } from "@/hooks/useHomepageData";
import { useRouter } from "next/navigation";

export default function Page() {
  const { products, isLoading, error } = useHomepageData();
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

  if (status === "loading" || isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-rose-500">
        Failed to load products.
      </div>
    );
  }

  return (
    <div className="relative pb-24 md:pb-0">
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400"
        style={{ scaleX }}
      />

      <main className="relative">
        <SectionWrapper delay={0.05}>
          <TabNavigation activeTab={activeTab} handleTabChange={handleTabChange} />
        </SectionWrapper>

        {activeTab === "Home" && (
          <>
            <SectionWrapper>
              <Hero products={products} />
            </SectionWrapper>

            <SectionWrapper delay={0.2}>
              <Explore />
            </SectionWrapper>

            <SectionWrapper delay={0.3}>
              <BestDeals products={products} />
            </SectionWrapper>

            <SectionWrapper delay={0.4}>
              <Deals products={products} />
            </SectionWrapper>

            <SectionWrapper delay={0.5}>
              <WishlistSection />
            </SectionWrapper>

            <SectionWrapper delay={0.6}>
              <MostVisitedSection products={products} />
            </SectionWrapper>
          </>
        )}
        {activeTab === "ProductSeller" && <ProductSeller />}
      </main>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}

const SectionWrapper = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
    className="relative overflow-visible"
  >
    {children}
  </motion.div>
);
