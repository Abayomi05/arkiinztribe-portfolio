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

export default function LogisticsCaseStudy() {
  return (
    <main className="case-study">
      <nav className="navbar">
        <Link href="/" className="logo">
          ARKIINZ<span>TRIBE</span>
        </Link>

        <Link href="/#work" className="back-link">
          ← Back to work
        </Link>
      </nav>

      <section className="case-hero">
        <div className="section-label">CASE STUDY / 001</div>

        <h1>
          ARKIINZTRIBE
          <br />
          <em>Logistics.</em>
        </h1>

        <p>
          A modern logistics platform designed to connect customers, riders
          and communities through one seamless digital experience.
        </p>

        <div className="case-meta">
          <div>
            <span>ROLE</span>
            <strong>Product Design + Development</strong>
          </div>

          <div>
            <span>PLATFORM</span>
            <strong>Mobile + Web</strong>
          </div>

          <div>
            <span>STATUS</span>
            <strong>Product Development</strong>
          </div>
        </div>
      </section>

      <section className="case-visual">
        <div className="case-screen">
          <div className="screen-top">
            <span>ARKIINZTRIBE</span>
            <span>LOGISTICS</span>
          </div>

          <div className="screen-center">
            <div className="map-circle">
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>

            <div className="delivery-card">
              <small>ACTIVE DELIVERY</small>
              <strong>Order #AIT-2048</strong>
              <span>Rider is 8 mins away</span>
            </div>
          </div>
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">01 / OVERVIEW</div>

        <div className="case-copy">
          <h2>Making logistics feel simple.</h2>

          <p>
            ARKIINZTRIBE Logistics was conceived as a digital platform for
            community-driven delivery. The goal was to bring customers,
            riders and administrators into a single connected ecosystem.
          </p>

          <p>
            Instead of relying on disconnected calls, messages and manual
            coordination, the platform brings delivery requests, communication,
            tracking and payments into one experience.
          </p>
        </div>
      </section>

      <section className="case-section split">
        <div>
          <div className="case-label">02 / THE CHALLENGE</div>
          <h2>Disconnected logistics creates friction.</h2>
        </div>

        <div className="case-copy">
          <p>
            Customers need to know where their delivery is. Riders need clear
            instructions. Administrators need visibility across operations.
          </p>

          <p>
            The product therefore needed to solve several problems at once
            without making the experience complicated for everyday users.
          </p>
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">03 / THE SOLUTION</div>

        <div className="case-copy">
          <h2>One connected logistics ecosystem.</h2>

          <p>
            We designed the platform around three core experiences: customer,
            rider and administration. Each role gets the tools needed to
            complete its part of the delivery journey.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <div className="feature-item" key={feature}>
              <span>0{index + 1}</span>
              <strong>{feature}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="case-section stack-section">
        <div className="case-label">04 / TECHNOLOGY</div>

        <h2>Built to scale.</h2>

        <div className="stack-grid">
          {stack.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </section>

      <section className="case-cta">
        <div className="section-label">NEXT PROJECT</div>

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
