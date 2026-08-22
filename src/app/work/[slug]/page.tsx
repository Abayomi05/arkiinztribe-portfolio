import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const caseStudies = {
  arkiinztribe: {
    number: "01",
    title: "ARKIINZTRIBE Brand",
    category: "Fashion / Brand Experience",
    eyebrow: "CREATIVE BRAND EXPERIENCE",
    intro:
      "A digital experience built around identity, culture, fashion and modern technology.",
    challenge:
      "ARKIINZTRIBE needed a digital presence capable of bringing its creative identity, fashion direction and technology services into one coherent ecosystem.",
    solution:
      "We created a bold digital system combining expressive typography, responsive layouts, visual storytelling and purposeful interaction.",
    capabilities: [
      "Creative Direction",
      "Brand Experience",
      "UI / UX Design",
      "Web Development",
    ],
    stack: ["Next.js", "TypeScript", "React", "CSS"],
    metrics: [
      ["01", "Identity", "Clearer brand positioning"],
      ["02", "Experience", "Responsive digital system"],
      ["03", "Technology", "Modern web foundation"],
    ],
  },

  "arkiinztribe-logistics": {
    number: "03",
    title: "ARKIINZTRIBE Logistics",
    category: "Logistics / Technology",
    eyebrow: "COMMUNITY LOGISTICS PLATFORM",
    intro:
      "A connected logistics experience bringing delivery coordination, tracking, payments and communication into one platform.",
    challenge:
      "Customers, riders and delivery coordinators need a faster way to communicate, coordinate deliveries and maintain visibility throughout the delivery journey.",
    solution:
      "We designed a mobile-first logistics platform focused on real-time communication, delivery coordination, tracking, payments and community-driven logistics operations.",
    capabilities: [
      "Product Architecture",
      "Mobile App Development",
      "Real-Time Communication",
      "Logistics Experience",
    ],
    stack: ["Flutter", "Node.js", "MongoDB", "Socket.IO"],
    metrics: [
      ["01", "Coordination", "Connected delivery workflows"],
      ["02", "Tracking", "Real-time delivery visibility"],
      ["03", "Communication", "Direct customer and rider interaction"],
    ],
  },

  "business-systems": {
    number: "02",
    title: "Business Systems",
    category: "Software / Development",
    eyebrow: "DIGITAL BUSINESS SYSTEM",
    intro:
      "Purpose-built digital systems designed to simplify operations and help ambitious businesses scale.",
    challenge:
      "Businesses often depend on disconnected tools, spreadsheets and manual processes that create unnecessary friction as operations grow.",
    solution:
      "We design focused software systems that connect workflows, data and customer experiences into a single digital environment.",
    capabilities: [
      "Product Architecture",
      "Web Applications",
      "Automation",
      "System Development",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
    metrics: [
      ["01", "Workflow", "Connected operations"],
      ["02", "Visibility", "Centralized business data"],
      ["03", "Scale", "Built for future growth"],
    ],
  },
} as const;

type Slug = keyof typeof caseStudies;

export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!(slug in caseStudies)) {
    return {};
  }

  const project = caseStudies[slug as Slug];

  return {
    title: project.title,
    description: project.intro,
    openGraph: {
      title: `${project.title} — ARKIINZTRIBE`,
      description: project.intro,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ARKIINZTRIBE`,
      description: project.intro,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!(slug in caseStudies)) {
    notFound();
  }

  const project = caseStudies[slug as Slug];

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
          <span>{project.number}</span>
          <span>{project.eyebrow}</span>
          <span>{project.category}</span>
        </div>

        <h1>
          {project.title}
          <em>.</em>
        </h1>

        <p>{project.intro}</p>
      </section>

      <section className="premium-case-showcase">
        <div className="showcase-window">
          <div className="showcase-topbar">
            <div className="showcase-dots">
              <i />
              <i />
              <i />
            </div>

            <span>ARKIINZTRIBE / {project.category}</span>
          </div>

          <div className="showcase-body">
            <div className="showcase-grid" />

            <div className="showcase-copy">
              <small>{project.number} / DIGITAL SYSTEM</small>
              <strong>{project.title}</strong>
              <span>DIFFERENT TOGETHER.</span>
            </div>

            <div className="showcase-orbit" />
            <div className="showcase-orbit showcase-orbit-two" />
          </div>
        </div>
      </section>

      <section className="premium-case-overview">
        <div className="premium-section-label">01 / THE CHALLENGE</div>

        <div className="premium-overview-copy">
          <h2>What needed to change.</h2>
          <p>{project.challenge}</p>
        </div>
      </section>

      <section className="premium-case-solution">
        <div className="premium-section-label">02 / THE APPROACH</div>

        <div className="premium-solution-grid">
          <div>
            <h2>Designed with purpose.</h2>
          </div>

          <div>
            <p>{project.solution}</p>

            <div className="premium-capabilities">
              {project.capabilities.map((item, index) => (
                <div key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-metrics">
        <div className="premium-section-label">03 / THE SYSTEM</div>

        <div className="premium-metric-grid">
          {project.metrics.map(([number, title, text]) => (
            <div key={number} className="premium-metric">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-stack">
        <div className="premium-section-label">04 / TECHNOLOGY</div>

        <h2>The foundation.</h2>

        <div className="premium-stack-grid">
          {project.stack.map((technology) => (
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
