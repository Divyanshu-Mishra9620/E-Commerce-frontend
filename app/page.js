"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import FlashSale from "@/components/FlashSale";
import Hero from "@/components/Hero";
import Explore from "@/components/Explore";
import BestDeals from "@/components/BestDeals";
import Deals from "@/components/Deals";
import WishlistSection from "@/components/Wishlist";
import MostVisitedSection from "@/components/MostVisitedSection";
import Footer from "@/components/Footer";
import { useContext, useEffect, useState } from "react";
import ProductContext from "@/context/ProductContext";
import CyberLoader from "@/components/CyberLoader";
import TabNavigation from "@/components/TabNavigation";
import ProductSeller from "@/components/ProductSeller";
import { useRouter } from "next/navigation";

export default function Page() {
  const { products, isLoading, error } = useContext(ProductContext);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [activeTab, setActiveTab] = useState("Home");
  const [user, setUser] = useState(null);

  const router = useRouter();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) router.push("/api/auth/signin");
    setUser(storedUser);
  }, []);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-screen text-xl font-bold text-red-500"
      >
        Failed to load products. Please try again later.
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <CyberLoader />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX }}
      />

      <main>
        <SectionWrapper>
          <TabNavigation handleTabChange={handleTabChange} />
        </SectionWrapper>

        {activeTab === "Home" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <FlashSale />
            </motion.div>

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
    className="overflow-hidden"
  >
    {children}
  </motion.div>
);
