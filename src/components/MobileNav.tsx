"use client";

import { useState } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className={`mobile-menu-button ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
      >
        <span />
        <span />
      </button>

      <div className={`mobile-menu ${open ? "is-open" : ""}`}>
        <nav>
          {links.map((link) => (
            <a
              href={link.href}
              key={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
              <span>↗</span>
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="mobile-menu-cta"
          onClick={() => setOpen(false)}
        >
          Start a project <span>↗</span>
        </a>
      </div>
    </div>
  );
}
