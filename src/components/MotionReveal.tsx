"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type MotionRevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
};

export default function MotionReveal({
  children,
  delay = 0,
  duration = 0.7,
  y = 30,
  className,
}: MotionRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
