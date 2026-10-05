"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/*
 * Lightweight intro sequence.
 *
 * Deliberately cheap:
 *  - only transform/opacity, so everything stays on the compositor
 *  - one rAF-ish timer instead of a per-line interval
 *  - capped duration (~1s) then fully unmounts, leaving zero JS behind
 *  - honours prefers-reduced-motion by skipping straight to the end
 *  - plays once per session, not on every navigation
 */

const STEPS = [
  "INITIALISING CREATIVE ENGINE",
  "LOADING DIGITAL SYSTEMS",
  "AGENT SUPPORT ONLINE",
];

const TOTAL_MS = 1500;
const STEP_MS = 320;

function alreadySeen(): boolean {
  if (typeof window === "undefined") return true;

  try {
    return sessionStorage.getItem("arkiinztribe-intro") === "true";
  } catch {
    // Private mode: treat as unseen so the intro still plays.
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem("arkiinztribe-intro", "true");
  } catch {
    /* ignore */
  }
}

export default function MotionIntro() {
  const reducedMotion = useReducedMotion();

  // Read once during the first render so returning visitors never flash
  // the overlay. Setting state in an effect here would cascade renders.
  const [skipped] = useState(alreadySeen);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(skipped);

  useEffect(() => {
    if (reducedMotion || skipped) return;

    markSeen();

    const stepTimer = window.setInterval(() => {
      setStep((current) => {
        if (current >= STEPS.length - 1) {
          window.clearInterval(stepTimer);
          return current;
        }
        return current + 1;
      });
    }, STEP_MS);

    const doneTimer = window.setTimeout(() => setDone(true), TOTAL_MS);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(doneTimer);
    };
  }, [reducedMotion, skipped]);

  // Unmount entirely so the overlay costs nothing after the intro.
  if (reducedMotion || done) return null;

  return (
    <motion.div
      className="motion-intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-hidden="true"
    >
      <div className="motion-intro-inner">
        <motion.div
          className="motion-intro-brand"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          ARKIINZTRIBE
        </motion.div>

        <div className="motion-intro-lines">
          {STEPS.slice(0, step + 1).map((line, index) => (
            <motion.div
              key={line}
              className="motion-intro-line"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <span className="motion-intro-dot" />
              {line}
              {index === step && (
                <motion.span
                  className="motion-intro-cursor"
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        <div className="motion-intro-progress">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: TOTAL_MS / 1000, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}