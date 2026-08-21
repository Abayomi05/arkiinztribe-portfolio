"use client";

import { useEffect, useState } from "react";

const bootLines = [
  "[ARKIINZTRIBE] initializing system...",
  "[OK] loading creative engine",
  "[OK] loading digital systems",
  "[OK] connecting project intelligence",
  "[OK] agent support online",
  "[READY] DIFFERENT TOGETHER",
];

export default function SystemBoot() {
  const [visible, setVisible] = useState(false);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const startTimer = window.setTimeout(() => {
      if (sessionStorage.getItem("arkiinztribe-booted")) {
        return;
      }

      sessionStorage.setItem("arkiinztribe-booted", "true");
      setVisible(true);
    }, 0);

    return () => window.clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const interval = window.setInterval(() => {
      setLine((current) => {
        if (current >= bootLines.length - 1) {
          window.clearInterval(interval);

          window.setTimeout(() => {
            setVisible(false);
          }, 500);

          return current;
        }

        return current + 1;
      });
    }, 350);

    return () => window.clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="system-boot"
      aria-label="ARKIINZTRIBE system initialization"
    >
      <div className="system-boot-inner">
        <div className="system-boot-brand">ARKIINZTRIBE // SYSTEM</div>

        <div className="system-boot-terminal">
          {bootLines.slice(0, line + 1).map((bootLine, index) => (
            <div key={bootLine} className={index === line ? "active" : ""}>
              {bootLine}
            </div>
          ))}
        </div>

        <div className="system-boot-progress">
          <span
            style={{
              width: `${((line + 1) / bootLines.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
