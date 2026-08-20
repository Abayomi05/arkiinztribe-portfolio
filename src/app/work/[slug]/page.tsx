import Link from "next/link";
import { notFound } from "next/navigation";

const caseStudies = {
  arkiinztribe: {
    number: "01",
    title: "ARKIINZTRIBE",
    category: "Fashion / Digital",
    intro:
      "A digital experience built around identity, culture, fashion and modern technology.",
    challenge:
      "ARKIINZTRIBE needed a digital presence that could communicate its creative identity while making its fashion and technology services feel like one cohesive ecosystem.",
    solution:
      "We designed a cinematic digital experience focused on strong typography, visual hierarchy, responsive layouts and a premium interaction system.",
    services: [
      "Creative Direction",
      "UI/UX Design",
      "Web Development",
      "Brand Experience",
    ],
  },

  "business-systems": {
    number: "03",
    title: "Business Systems",
    category: "Software / Development",
    intro:
      "Purpose-built digital systems designed to simplify operations and help ambitious businesses scale.",
    challenge:
      "Businesses often rely on disconnected tools and manual processes that make growth unnecessarily complicated.",
    solution:
      "We create focused software systems that connect workflows, data and customer experiences into a single digital environment.",
    services: [
      "Product Architecture",
      "Web Applications",
      "Automation",
      "System Development",
    ],
  },
} as const;

type Slug = keyof typeof caseStudies;

export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({
    slug,
  }));
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
    <main className="case-study-page">
      <section className="case-study-hero section">
        <Link href="/#work" className="case-back">
          ← Back to work
        </Link>

        <div className="case-study-meta">
          <span>{project.number}</span>
          <span>{project.category}</span>
        </div>

        <h1>{project.title}</h1>

        <p className="case-study-intro">
          {project.intro}
        </p>
      </section>

      <section className="case-study-visual section">
        <div className="case-visual-frame">
          <div className="case-browser">
            <div className="case-browser-bar">
              <span />
              <span />
              <span />
            </div>

            <div className="case-browser-content">
              <div className="case-browser-label">
                ARKIINZTRIBE / {project.category}
              </div>

              <div className="case-browser-title">
                {project.title}
              </div>

              <div className="case-browser-grid">
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="case-study-content section">
        <div className="case-copy">
          <span className="section-label">01 / THE CHALLENGE</span>
          <h2>The problem worth solving.</h2>
          <p>{project.challenge}</p>
        </div>

        <div className="case-copy">
          <span className="section-label">02 / THE APPROACH</span>
          <h2>Designed with purpose.</h2>
          <p>{project.solution}</p>
        </div>

        <div className="case-copy">
          <span className="section-label">03 / CAPABILITIES</span>
          <h2>What we delivered.</h2>

          <div className="case-services">
            {project.services.map((service) => (
              <span key={service}>
                {service}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="case-study-footer section">
        <Link href="/#work">
          Explore more work ↗
        </Link>
      </section>
    </main>
  );
}
