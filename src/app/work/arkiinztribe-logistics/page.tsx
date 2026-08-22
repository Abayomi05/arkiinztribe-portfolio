import type { Metadata } from "next";
import Link from "next/link";

const features = [
  "Real-time logistics chat",
  "Rider delivery coordination",
  "Live GPS tracking",
  "Wallet & escrow payments",
  "Community feed",
  "Push notifications",
  "Ratings & reviews",
  "Admin dashboard",
];

const stack = [
  "Flutter",
  "Node.js",
  "Express",
  "MongoDB",
  "Socket.IO",
  "Firebase",
  "Google Maps",
  "Paystack",
];

export const metadata: Metadata = {
  title: "ARKIINZTRIBE Logistics — ARKIINZTRIBE",
  description:
    "A logistics platform connecting businesses, riders and customers through delivery coordination, tracking, communication and payments.",
  openGraph: {
    title: "ARKIINZTRIBE Logistics — ARKIINZTRIBE",
    description:
      "A logistics platform connecting businesses, riders and customers through delivery coordination, tracking, communication and payments.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARKIINZTRIBE Logistics — ARKIINZTRIBE",
    description:
      "A logistics platform connecting businesses, riders and customers through delivery coordination, tracking, communication and payments.",
  },
};

export default function LogisticsCaseStudy() {
  return (
    <main className="premium-case-study">
      <nav className="navbar case-navbar">
        <Link href="/" className="logo">
          ARKIINZ<span>TRIBE</span>
        </Link>

        <Link href="/#work" className="back-link">
          ← Back to work
        </Link>
      </nav>

      <section className="premium-case-hero">
        <div className="premium-case-label">
          <span>01</span>
          <span>LOGISTICS PLATFORM</span>
          <span>Mobile / Web / Operations</span>
        </div>

        <h1>
          ARKIINZTRIBE Logistics<em>.</em>
        </h1>

        <p>
          A logistics platform connecting businesses, riders and customers
          through delivery coordination, tracking, communication and payments.
        </p>
      </section>

      <section className="premium-case-showcase">
        <div className="showcase-window">
          <div className="showcase-topbar">
            <div className="showcase-dots">
              <i />
              <i />
              <i />
            </div>
            <span>ARKIINZTRIBE / LOGISTICS PLATFORM</span>
          </div>

          <div className="showcase-body">
            <div className="showcase-grid" />

            <div className="showcase-copy">
              <small>01 / PRODUCT SYSTEM</small>
              <strong>LOGISTICS.</strong>
              <span>DELIVERY / TRACKING / PAYMENTS / CHAT</span>
            </div>

            <div className="showcase-orbit" />
            <div className="showcase-orbit showcase-orbit-two" />
          </div>
        </div>
      </section>

      <section className="premium-case-overview">
        <div className="premium-section-label">01 / THE CHALLENGE</div>

        <div className="premium-overview-copy">
          <h2>Disconnected logistics creates friction.</h2>

          <p>
            Customers need visibility into deliveries. Riders need clear
            instructions and reliable communication. Businesses need control
            across orders, payments and operations. The platform brings those
            moving parts into one connected digital environment.
          </p>
        </div>
      </section>

      <section className="premium-case-solution">
        <div className="premium-section-label">02 / THE APPROACH</div>

        <div className="premium-solution-grid">
          <div>
            <h2>One connected logistics ecosystem.</h2>
          </div>

          <div>
            <p>
              ARKIINZTRIBE Logistics is designed around three core experiences:
              customer, rider and administration. Each role gets the tools it
              needs while the underlying system keeps delivery activity,
              communication, tracking and payments connected.
            </p>

            <div className="premium-capabilities">
              {features.map((feature, index) => (
                <div key={feature}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{feature}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-metrics">
        <div className="premium-section-label">03 / THE SYSTEM</div>

        <div className="premium-metric-grid">
          <div className="premium-metric">
            <span>01</span>
            <h3>Coordination</h3>
            <p>
              Connect customers, riders and operators around every delivery.
            </p>
          </div>

          <div className="premium-metric">
            <span>02</span>
            <h3>Visibility</h3>
            <p>
              Give users clearer delivery status, communication and location
              context.
            </p>
          </div>

          <div className="premium-metric">
            <span>03</span>
            <h3>Infrastructure</h3>
            <p>
              Build a foundation for payments, notifications, maps and future
              scale.
            </p>
          </div>
        </div>
      </section>

      <section className="premium-stack">
        <div className="premium-section-label">04 / TECHNOLOGY</div>

        <h2>The foundation.</h2>

        <div className="premium-stack-grid">
          {stack.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </section>

      <section className="premium-case-cta">
        <span className="premium-section-label">NEXT STEP</span>

        <h2>
          Have something
          <br />
          <em>worth building?</em>
        </h2>

        <Link href="/#contact" className="primary-button">
          Start a project <span>↗</span>
        </Link>
      </section>

      <footer className="footer">
        <div>
          <Link href="/" className="logo">
            ARKIINZ<span>TRIBE</span>
          </Link>
          <p>DIFFERENT TOGETHER.</p>
        </div>

        <div className="footer-bottom">
          © 2026 ARKIINZTRIBE. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
