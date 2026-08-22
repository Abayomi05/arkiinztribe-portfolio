import Image from "next/image";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import MotionReveal from "@/components/MotionReveal";
import SystemBoot from "@/components/SystemBoot";
import AgentPanel from "@/components/AgentPanel";

const services = [
  {
    number: "01",
    title: "Web Development",
    text: "Fast, responsive and conversion-focused websites built around your business goals.",
  },
  {
    number: "02",
    title: "Software Systems",
    text: "Scalable digital products, dashboards and business systems designed for real-world use.",
  },
  {
    number: "03",
    title: "UI / UX Design",
    text: "Interfaces and experiences engineered to make complex products feel simple.",
  },
  {
    number: "04",
    title: "Brand Systems",
    text: "Distinctive identities and digital systems built to make businesses recognizable.",
  },
];

const projects = [
  {
    id: "01",
    type: "LOGISTICS PLATFORM",
    title: "ARKIINZTRIBE Logistics",
    description:
      "A community-driven logistics platform bringing delivery coordination, tracking, payments and communication into one experience.",
    tags: ["Flutter", "Node.js", "MongoDB"],
    href: "/work/arkiinztribe-logistics",
    image: "/projects/arkiinztribe.svg",
    status: "BUILDING",
  },
  {
    id: "02",
    type: "DIGITAL EXPERIENCE",
    title: "Business Systems",
    description:
      "Purpose-built digital systems designed to simplify operations, connect workflows and help ambitious businesses scale.",
    tags: ["Next.js", "TypeScript", "UI/UX"],
    href: "/work/business-systems",
    image: "/projects/business-systems.svg",
    status: "COMPLETED",
  },
  {
    id: "03",
    type: "BRAND SYSTEM",
    title: "ARKIINZTRIBE Brand",
    description:
      "A distinctive brand experience combining fashion, culture and digital design into one recognizable system.",
    tags: ["Branding", "Creative", "Design"],
    href: "/work/arkiinztribe",
    image: "/projects/arkiinztribe-brand.svg",
    status: "ACTIVE",
  },
];

export default function Home() {
  return (
    <main className="system-page">
      <SystemBoot />

      <nav className="system-navbar">
        <Link href="/" className="system-logo">
          <span className="logo-mark">A</span>
          <span>
            ARKIINZ<span>TRIBE</span>
          </span>
        </Link>

        <div className="system-nav-links">
          <a href="#work">WORK</a>
          <a href="#services">SYSTEMS</a>
          <a href="#lab">LAB</a>
          <a href="#about">ABOUT</a>
        </div>

        <div className="system-nav-status">
          <span className="pulse-dot" />
          SYSTEM ONLINE
        </div>

        <MobileNav />
      </nav>

      <section className="system-hero">
        <div className="system-grid" />
        <div className="hero-scanline" />

        <div className="system-hero-content">
          <div className="system-eyebrow">
            <span>ARKIINZTRIBE // DIGITAL STUDIO</span>
            <span>NG / 2026</span>
          </div>

          <div className="hero-status">
            <span className="pulse-dot" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>

          <h1>
            DIGITAL
            <br />
            <em>SYSTEMS</em>
            <br />
            FOR DIFFERENT
            <br />
            BUSINESSES.
          </h1>

          <p className="system-hero-copy">
            We design and engineer websites, software, brands and intelligent
            digital experiences that help ambitious businesses operate better.
          </p>

          <div className="system-actions">
            <a href="#work" className="system-button primary">
              ENTER PROJECT DATABASE <span>↗</span>
            </a>

            <a href="#contact" className="system-button">
              START A PROJECT
            </a>
          </div>
        </div>

        <div className="hero-telemetry">
          <div>
            <span>LOCATION</span>
            <strong>NIGERIA / NG</strong>
          </div>
          <div>
            <span>BUILD</span>
            <strong>ARK-2.0.0</strong>
          </div>
          <div>
            <span>STATUS</span>
            <strong className="green-text">ONLINE</strong>
          </div>
        </div>
      </section>

      <MotionReveal>
        <section className="system-intro">
          <div className="system-section-label">
            <span>01</span>
            CORE DIRECTIVE
          </div>

          <div className="intro-content">
            <h2>
              Technology should make your business
              <span> stronger.</span>
            </h2>

            <p>
              ARKIINZTRIBE combines engineering, design and business thinking to
              build digital systems that are useful underneath and unmistakable
              on the surface.
            </p>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="work" className="system-section">
          <div className="system-section-heading">
            <div>
              <div className="system-section-label">
                <span>02</span>
                PROJECT DATABASE
              </div>
              <h2>Systems we&apos;ve built.</h2>
            </div>

            <div className="database-status">
              <span className="pulse-dot" />
              DATABASE ONLINE
            </div>
          </div>

          <div className="system-project-grid">
            {projects.map((project, index) => (
              <Link
                href={project.href}
                className={`system-project project-${index + 1}`}
                key={project.title}
              >
                <div className="project-topline">
                  <span>
                    {project.id} / {project.type}
                  </span>
                  <span className="project-status">{project.status}</span>
                </div>

                <div className="system-project-visual">
                  <div className="project-grid-bg" />

                  <Image
                    src={project.image}
                    alt={`${project.title} project preview`}
                    fill
                    sizes="(max-width: 800px) 100vw, 60vw"
                    className="project-image"
                  />

                  <div className="project-overlay">
                    <span>ACCESS PROJECT ↗</span>
                  </div>
                </div>

                <div className="system-project-info">
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>

                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="services" className="system-section services-system">
          <div className="system-section-heading">
            <div>
              <div className="system-section-label">
                <span>03</span>
                CAPABILITIES
              </div>
              <h2>What the system can build.</h2>
            </div>
          </div>

          <div className="system-service-grid">
            {services.map((service) => (
              <article className="system-service" key={service.number}>
                <div className="service-top">
                  <span>{service.number}</span>
                  <span>AVAILABLE</span>
                </div>

                <h3>{service.title}</h3>
                <p>{service.text}</p>

                <div className="service-line">
                  <span />
                </div>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="lab" className="system-section lab-section">
          <div className="system-section-heading">
            <div>
              <div className="system-section-label">
                <span>04</span>
                ARKIINZTRIBE LAB
              </div>
              <h2>Experiments in progress.</h2>
            </div>
          </div>

          <div className="lab-console">
            <div className="lab-console-head">
              <span>~/arkiinztribe/lab</span>
              <span>LIVE</span>
            </div>

            <div className="lab-body">
              <p>
                <span className="green-text">01</span> AI AGENTS
                <strong>RESEARCH</strong>
              </p>
              <p>
                <span className="green-text">02</span> LOGISTICS SYSTEMS
                <strong>BUILDING</strong>
              </p>
              <p>
                <span className="green-text">03</span> BUSINESS AUTOMATION
                <strong>EXPLORING</strong>
              </p>
              <p>
                <span className="green-text">04</span> DIGITAL EXPERIENCES
                <strong>ACTIVE</strong>
              </p>

              <div className="lab-command">
                <span>&gt;</span> observing current experiments
                <span className="typing-cursor">_</span>
              </div>
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="about" className="system-section about-system">
          <div className="system-section-label">
            <span>05</span>
            SYSTEM PHILOSOPHY
          </div>

          <div className="about-system-grid">
            <h2>
              DIFFERENT
              <br />
              <em>TOGETHER.</em>
            </h2>

            <div>
              <p className="about-lead">
                The best digital work happens when technology and creativity
                operate as one system.
              </p>

              <p>
                We think about the people using the product, the business behind
                it and the result it needs to produce.
              </p>

              <div className="process-system">
                <span>
                  <b>01</b> DISCOVER
                </span>
                <span>
                  <b>02</b> DESIGN
                </span>
                <span>
                  <b>03</b> BUILD
                </span>
                <span>
                  <b>04</b> LAUNCH
                </span>
              </div>
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="contact" className="system-contact">
          <div className="contact-grid-bg" />

          <div className="system-section-label">
            <span>06</span>
            INCOMING PROJECT
          </div>

          <h2>
            HAVE AN IDEA?
            <br />
            <em>INITIALIZE IT.</em>
          </h2>

          <p>
            Tell us what you&apos;re building, what problem you&apos;re solving
            and where you want the system to go.
          </p>

          <a
            href="mailto:johnsonarkiinz@gmail.com"
            className="system-button primary"
          >
            TRANSMIT PROJECT BRIEF ↗
          </a>

          <div className="contact-email">johnsonarkiinz@gmail.com</div>
        </section>
      </MotionReveal>

      <footer className="system-footer">
        <div className="system-logo">
          <span className="logo-mark">A</span>
          <span>
            ARKIINZ<span>TRIBE</span>
          </span>
        </div>

        <div className="footer-system-status">
          <span className="pulse-dot" />
          SYSTEM ONLINE / DIFFERENT TOGETHER
        </div>

        <span>© 2026 ARKIINZTRIBE</span>
      </footer>

      <AgentPanel />
    </main>
  );
}
