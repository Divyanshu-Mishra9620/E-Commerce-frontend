"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SellerPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl px-4"
      >
        <div className="relative mb-8">
          <Image
            src="/underConstruction.gif"
            alt="Coming Soon"
            width={400}
            height={300}
            className="filter grayscale contrast-125"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-light text-gray-100 mb-4 tracking-wider"
        >
          Seller Portal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-gray-400 mb-8"
        >
          Currently unavailable - Our seller platform is under development
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => router.back()}
            className="px-8 py-3 border border-gray-600 rounded-lg text-gray-300 hover:border-gray-400 hover:text-white transition-all duration-300 text-lg"
          >
            Return to Store
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-gray-500 text-sm"
        >
          For seller inquiries, please contact support@elysoria.com
        </motion.p>
      </motion.div>
    </div>
  );
}
