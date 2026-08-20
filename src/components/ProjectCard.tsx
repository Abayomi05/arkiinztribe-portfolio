"use client";

import Link from "next/link";
import { motion } from "motion/react";

type ProjectCardProps = {
  number: string;
  title: string;
  category: string;
  description: string;
  href: string;
};

export default function ProjectCard({
  number,
  title,
  category,
  description,
  href,
}: ProjectCardProps) {
  return (
    <motion.article
      className="project-card cinema-card"
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={href} className="project-card-link">
        <div className="project-mockup">
          <div className="mockup-browser">
            <div className="mockup-topbar">
              <div className="mockup-dots">
                <span />
                <span />
                <span />
              </div>

              <div className="mockup-address">
                ARKIINZTRIBE / {category}
              </div>
            </div>

            <div className="mockup-screen">
              <div className="mockup-screen-label">
                {number} / {category}
              </div>

              <div className="mockup-screen-title">
                {title}
              </div>

              <div className="mockup-line mockup-line-wide" />
              <div className="mockup-line mockup-line-medium" />

              <div className="mockup-panels">
                <div className="mockup-panel mockup-panel-large" />
                <div className="mockup-panel" />
              </div>
            </div>
          </div>

          <motion.span
            className="project-view"
            whileHover={{
              scale: 1.05,
            }}
          >
            View project ↗
          </motion.span>
        </div>

        <div className="project-details">
          <div className="project-top">
            <span className="project-number">
              {number}
            </span>

            <span className="project-category">
              {category}
            </span>
          </div>

          <div className="project-content">
            <h3>{title}</h3>

            <p>{description}</p>
          </div>

          <motion.span
            className="card-arrow"
            whileHover={{
              x: 6,
              y: -6,
            }}
          >
            ↗
          </motion.span>
        </div>
      </Link>
    </motion.article>
  );
}
