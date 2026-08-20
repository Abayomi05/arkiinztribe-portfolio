"use client";

import { motion } from "motion/react";

type ServiceCardProps = {
  number: string;
  title: string;
  text: string;
};

export default function ServiceCard({
  number,
  title,
  text,
}: ServiceCardProps) {
  return (
    <motion.article
      className="service-card cinema-card"
      initial={{
        opacity: 0,
        y: 45,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className="service-number text-gold">
        {number}
      </span>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>

      <motion.span
        className="card-arrow"
        whileHover={{
          x: 5,
          y: -5,
        }}
      >
        ↗
      </motion.span>
    </motion.article>
  );
}
