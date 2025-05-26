import { motion } from "framer-motion";

export default function NavigationLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-0 left-0 w-full z-[9999]"
    >
      <div className="h-1 w-full bg-gray-900">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          initial={{ width: "0%" }}
          animate={{
            width: "100%",
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
        />
      </div>
    </motion.div>
  );
}
