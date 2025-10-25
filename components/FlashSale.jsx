"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import useCountdown from "@/hooks/useCountdown";
import "@/app/_styles/global.css";

export default function FlashSale() {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
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
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 flash-sale-container">
      <div className="relative group">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 md:w-20 md:h-20 cursor-pointer"
          onClick={() => setIsContentVisible(!isContentVisible)}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <motion.div
            animate={{
              rotate: isHovering ? 360 : 0,
              opacity: isHovering ? 1 : 0.7,
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600"
          />

          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg flex items-center justify-center">
            <Image
              src="/bell.png"
              alt="Flash Sale"
              width={60}
              height={60}
              className="w-8 md:w-10 h-8 md:h-10"
            />

            {isHovering && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-red-500"
              />
            )}
          </div>

          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 shadow-md">
            HOT
          </div>
        </motion.div>

        <AnimatePresence>
          {isContentVisible && (
            <motion.div
              className="fixed right-20 top-1/2 transform -translate-y-1/2 w-[85vw] max-w-md bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-2xl p-6 border border-slate-700"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                onClick={() => setIsContentVisible(false)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-700 transition-colors text-slate-300"
                aria-label="Close flash sale panel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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

              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Image
                    src="/lightning.png"
                    alt="Flash"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </motion.div>
                <motion.h2
                  className="text-xl md:text-2xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  FLASH SALE ACTIVATED!
                </motion.h2>
              </div>

              <motion.div
                className={`flex flex-col items-center gap-3 mb-5 ${
                  timeLeft.hours === 0 &&
                  timeLeft.minutes === 0 &&
                  timeLeft.seconds === 0
                    ? "animate-pulse"
                    : ""
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-sm text-slate-300">Offer ends in:</div>
                <div className="flex items-center justify-center gap-2 bg-slate-800/80 px-6 py-3 rounded-lg border border-slate-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold tabular-nums">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-slate-400">HOURS</div>
                  </div>
                  <div className="text-2xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold tabular-nums">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-slate-400">MINUTES</div>
                  </div>
                  <div className="text-2xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold tabular-nums">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-slate-400">SECONDS</div>
                  </div>
                </div>
              </motion.div>

              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Sale ending soon!</span>
                  <span>{Math.round(progress)}% remaining</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-full"
                    initial={{ width: `${progress}%` }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>SHOP NOW & SAVE</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>

              <p className="text-xs text-slate-400 text-center mt-3">
                Limited quantities available. Discount auto-applied at checkout.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
