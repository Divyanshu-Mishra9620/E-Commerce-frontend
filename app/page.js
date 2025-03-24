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
// import CyberLoader from "@/components/CyberLoader";
import Image from "next/image";

export default function Page() {
  const { products, isLoading, error } = useContext(ProductContext);
  const [showLoader, setShowLoader] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoading]);

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

  // Show loader if either loading or within first 5 seconds
  if (showLoader || isLoading) {
    return (
      // <div className="min-h-screen">
      //   <CyberLoader />
      // </div> (
      <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
        <Image
          src="/underConstruction.gif"
          alt="Loading..."
          width={200}
          height={200}
          priority
          unoptimized
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gray-800 opacity-30 mix-blend-multiply" />
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
