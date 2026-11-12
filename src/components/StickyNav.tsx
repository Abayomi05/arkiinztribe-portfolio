"use client";

import { useEffect, useState } from "react";

/**
 * Wraps the site navbar so it sticks to the top of the viewport and
 * gains a drop shadow once the user scrolls past the initial hero.
 * Keeps the rest of the page's markup as children so this has no
 * layout footprint on its own.
 */
export default function StickyNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 6);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`system-navbar ${scrolled ? "is-scrolled" : ""}`}
      aria-label="Main"
    >
      {children}
    </nav>
  );
}
