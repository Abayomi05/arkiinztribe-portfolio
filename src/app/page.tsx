import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Web Development",
    text: "Fast, responsive and conversion-focused websites built around your business goals.",
  },
  {
    number: "02",
    title: "Software Solutions",
    text: "Scalable digital products, dashboards and business systems designed for real-world use.",
  },
  {
    number: "03",
    title: "UI / UX Design",
    text: "Clean interfaces and thoughtful user experiences that make complex products feel simple.",
  },
  {
    number: "04",
    title: "Brand Identity",
    text: "Distinctive visual identities that give businesses a recognizable and professional presence.",
  },
];

const projects = [
  {
    type: "LOGISTICS PLATFORM",
    title: "ARKIINZTRIBE Logistics",
    description:
      "A community-driven logistics platform bringing delivery coordination, tracking, payments and communication into one experience.",
    tags: ["Flutter", "Node.js", "MongoDB"],
    href: "/work/arkiinztribe-logistics",
  },
  {
    type: "DIGITAL EXPERIENCE",
    title: "Business Website",
    description:
      "A modern digital presence designed to turn visitors into customers while communicating trust and professionalism.",
    tags: ["Next.js", "TypeScript", "UI/UX"],
    href: "/work/business-systems",
  },
  {
    type: "BRAND SYSTEM",
    title: "Creative Brand Identity",
    description:
      "A complete visual direction created to give a growing brand a stronger, more memorable identity.",
    tags: ["Branding", "Creative", "Design"],
    href: "/work/arkiinztribe",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="navbar">
        <Link href="/" className="logo">
          ARKIINZ<span>TRIBE</span>
        </Link>

        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <a href="#contact" className="nav-button">
          Start a project <span>↗</span>
        </a>
      </nav>

      <section className="hero">
        <div className="hero-glow" />

        <div className="hero-content">
          <div className="eyebrow">
            <span className="status-dot" />
            DIGITAL STUDIO · NIGERIA
          </div>

          <h1>
            We build
            <br />
            <em>digital experiences</em>
            <br />
            that move businesses.
          </h1>

          <p className="hero-description">
            ARKIINZTRIBE creates modern websites, software and digital
            experiences for businesses ready to look different and operate
            better.
          </p>

          <div className="hero-actions">
            <a href="#work" className="primary-button">
              Explore our work <span>↗</span>
            </a>

            <a href="#contact" className="secondary-button">
              Let's talk
            </a>
          </div>
        </div>

        <div className="hero-meta">
          <span>DIFFERENT TOGETHER</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      <section className="statement">
        <div className="section-label">01 / THE STUDIO</div>

        <div className="statement-content">
          <h2>
            Technology should make your business
            <span> stronger, not more complicated.</span>
          </h2>

          <p>
            We combine technology, design and business thinking to create
            digital products that are beautiful on the surface and useful
            underneath.
          </p>
        </div>
      </section>

      <section id="services" className="services section">
        <div className="section-heading">
          <div>
            <div className="section-label">02 / WHAT WE DO</div>
            <h2>Built around your ambition.</h2>
          </div>

          <p>
            From your first idea to a finished digital product, we help turn
            ambitious concepts into experiences people can actually use.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <span className="service-number">{service.number}</span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
              <span className="card-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="work" className="work section">
        <div className="section-heading">
          <div>
            <div className="section-label">03 / SELECTED WORK</div>
            <h2>Ideas, turned real.</h2>
          </div>

          <a href="#contact" className="text-link">
            Have a project? ↗
          </a>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <Link
              href={project.href}
              className="project-card"
              key={project.title}
            >
              <div className={`project-visual project-${index + 1}`}>
                <div className="visual-grid" />
                <div className="visual-content">
                  <span>{project.type}</span>
                  <strong>{project.title}</strong>
                </div>
                <div className="visual-orb" />
              </div>

              <div className="project-info">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>

                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="about section">
        <div className="section-label">04 / OUR APPROACH</div>

        <div className="about-layout">
          <h2>
            Different
            <br />
            <em>together.</em>
          </h2>

          <div className="about-copy">
            <p className="large-copy">
              ARKIINZTRIBE is built on a simple belief: the best digital work
              happens when technology and creativity work as one.
            </p>

            <p>
              We don't just build things because they look good. We think
              about the people using them, the business behind them and the
              result they need to produce.
            </p>

            <div className="process">
              <div>
                <span>01</span>
                Discover
              </div>
              <div>
                <span>02</span>
                Design
              </div>
              <div>
                <span>03</span>
                Build
              </div>
              <div>
                <span>04</span>
                Launch
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact section">
        <div className="contact-glow" />

        <div className="section-label">05 / START A PROJECT</div>

        <div className="contact-content">
          <h2>
            Have an idea?
            <br />
            <em>Let's build it.</em>
          </h2>

          <p>
            Tell us what you're working on, what you're trying to achieve and
            where you want to go next.
          </p>

          <a href="mailto: johnsonarkiinz@gmail.com" className="primary-button">
            johnsonarkiinz@gmail.com <span>↗</span>
          </a>
        </div>
      </section>

      <footer className="footer">
        <div>
          <Link href="/" className="logo">
            ARKIINZ<span>TRIBE</span>
          </Link>
          <p>DIFFERENT TOGETHER.</p>
        </div>

        <div className="footer-links">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-bottom">
          © 2026 ARKIINZTRIBE. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
