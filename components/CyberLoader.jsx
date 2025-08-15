"use client";
import { motion } from "framer-motion";

const particleData = Array.from({ length: 20 }, () => ({
  x: Math.random() * 100 - 50,
  y: Math.random() * 100 - 50,
  blur: Math.random() * 4,
}));

const dashVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: (i) => ({
    scale: 1,
    opacity: 1,
    rotate: [0, 360, 360],
    transition: {
      duration: 2.5,
      delay: i * 0.15,
      repeat: Infinity,
      repeatType: "loop",
      ease: "anticipate",
    },
  }),
};

const particleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (custom) => ({
    opacity: [0, 1, 0],
    scale: [0, 1.2, 0],
    x: custom.x,
    y: custom.y,
    transition: {
      duration: 1.5,
      delay: custom.i * 0.1,
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  }),
};

const CyberLoader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 backdrop-blur-xl">
      <div className="relative flex items-center justify-center">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={dashVariants}
            initial="initial"
            animate="animate"
            className="absolute h-4 w-12 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-lg shadow-glow"
            style={{
              rotateX: i * 90,
              rotateY: i * 45,
              originX: i % 2 === 0 ? 1 : 0,
              filter: `hue-rotate(${i * 90}deg)`,
            }}
          />
        ))}

        <div className="absolute inset-0">
          {particleData.map((particle, i) => (
            <motion.div
              key={i}
              custom={{ ...particle, i }}
              variants={particleVariants}
              initial="hidden"
              animate="visible"
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{ filter: `blur(${particle.blur}px)` }}
            />
          ))}
        </div>

        <motion.div
          className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-fuchsia-600 rounded-full shadow-2xl shadow-cyan-300/50"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            filter: [
              "hue-rotate(0deg) blur(0px)",
              "hue-rotate(180deg) blur(2px)",
              "hue-rotate(360deg) blur(0px)",
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default CyberLoader;
