"use client";
import FlashSale from "@/components/FlashSale";
import Navbar from "../components/Navbar";
import Hero from "@/components/Hero";
import Explore from "@/components/Explore";
import BestDeals from "@/components/BestDeals";
import Deals from "@/components/Deals";
import WishlistSection from "@/components/Wishlist";
import MostVisitedSection from "@/components/MostVisitedSection";
import Footer from "@/components/Footer";
import BottomNavigation from "@/components/BottomNavigation";
import { useEffect, useState, useContext } from "react";
import ProductContext from "@/context/ProductContext";

export default function Page() {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);

  const { products, isLoading } = useContext(ProductContext);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      setIsBottomNavVisible(scrollY + windowHeight < fullHeight - 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Navbar />

      <main>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen text-xl font-bold">
            Loading Products...
          </div>
        ) : (
          <>
            <FlashSale />
            <Hero products={products} />
            <Explore />
            <BestDeals products={products} />
            <Deals products={products} />
            <WishlistSection />
            <MostVisitedSection products={products} />
            <BottomNavigation visible={isBottomNavVisible} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
