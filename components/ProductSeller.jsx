import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CyberLoader from "./CyberLoader";

export default function ProductSeller() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CyberLoader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-14"
    >
      ProductSeller Content
    </motion.div>
  );
}
