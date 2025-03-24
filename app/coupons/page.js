"use client";
import { motion } from "framer-motion";
import { Gift, ShoppingBag, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CouponPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="relative mb-8 flex justify-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-light text-gray-100 mb-4 tracking-wider"
          >
            Your Coupon Wallet
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-400 mb-8"
          >
            Currently no coupons available. Shop now to unlock exclusive
            discounts!
          </motion.p>

          <div className="relative py-12">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 w-64 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 border border-gray-600/30 transform rotate-3"
                  >
                    <div className="flex flex-col justify-between h-full">
                      <span className="text-gray-400 text-sm">SAMPLE</span>
                      <div className="text-right">
                        <span className="text-2xl font-medium text-gray-300 line-through">
                          XX%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative z-10"
            >
              <button
                onClick={() => router.push("/")}
                className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl text-gray-300 hover:from-gray-600 hover:to-gray-500 hover:text-white transition-all duration-300 text-lg font-medium"
              >
                Start Shopping
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-16 border-t border-gray-700 pt-8"
          >
            <h2 className="text-2xl font-light text-gray-300 mb-4">
              How to Earn Coupons
            </h2>
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <span>Complete purchases</span>
              </div>
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5" />
                <span>Participate in seasonal offers</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
