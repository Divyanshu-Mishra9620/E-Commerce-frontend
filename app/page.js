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
import BottomNavigation from "@/components/BottomNavigation";
import { useContext } from "react";
import ProductContext from "@/context/ProductContext";
import useScrollDirection from "@/hooks/useScrollDirection";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function Page() {
  const { products, isLoading, error } = useContext(ProductContext);
  const isBottomNavVisible = useScrollDirection();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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

  return (
    <div>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX }}
      />

      <main>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <SkeletonLoader />
          </motion.div>
        ) : (
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <BottomNavigation visible={isBottomNavVisible} />
            </motion.div>
          </>
        )}
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
