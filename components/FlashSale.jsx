"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import useCountdown from "@/hooks/useCountdown";
import "@/app/_styles/global.css";

export default function FlashSale() {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const handleFinish = () => console.log("Flash Sale has ended!");
  const timeLeft = useCountdown(2, 15, 30, handleFinish);

  const totalSeconds = 2 * 3600 + 15 * 60 + 30;
  const remainingSeconds =
    timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
  const progress = (remainingSeconds / totalSeconds) * 100;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isContentVisible && !e.target.closest(".flash-sale-container")) {
        setIsContentVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isContentVisible]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hero-section"
    >
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 flash-sale-container">
        <div className="relative group w-24 h-24 md:w-32 md:h-32">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-full h-full rounded-full bg-gradient-to-r from-black to-gray-800 flex items-center justify-center shadow-xl cursor-pointer opacity-30 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => setIsContentVisible(!isContentVisible)}
          >
            <Image
              src="/bell.png"
              alt="Flash Sale"
              width={60}
              height={60}
              className="w-10 md:w-14 h-10 md:h-14"
            />
          </motion.div>

          <AnimatePresence>
            {isContentVisible && (
              <motion.div
                className="fixed right-24 top-1/2 transform -translate-y-1/2 w-[80vw] max-w-md bg-gradient-to-r from-black to-gray-900 text-white rounded-lg shadow-xl p-6 flex flex-col items-center gap-4"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <button
                  onClick={() => setIsContentVisible(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <motion.h2
                  className="text-lg md:text-2xl font-bold tracking-wide text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ⚡ Flash Sale - Limited Time Offer!
                </motion.h2>

                <motion.div
                  className={`flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-md font-semibold shadow-md ${
                    timeLeft.hours === 0 &&
                    timeLeft.minutes === 0 &&
                    timeLeft.seconds === 0
                      ? "animate-pulse"
                      : ""
                  }`}
                >
                  ⏳ <span className="hidden sm:inline">Time Left:</span>{" "}
                  <time>
                    {`${String(timeLeft.hours).padStart(2, "0")}:${String(
                      timeLeft.minutes
                    ).padStart(2, "0")}:${String(timeLeft.seconds).padStart(
                      2,
                      "0"
                    )}`}
                  </time>
                </motion.div>

                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
