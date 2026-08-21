import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import ProjectCard from "@/components/ProjectCard";

const services = [
  {
    number: "01",
    title: "Web Development",
    text: "High-performance websites and digital experiences built around your brand.",
  },
  {
    number: "02",
    title: "E-Commerce",
    text: "Modern online stores designed to convert visitors into loyal customers.",
  },
  {
    number: "03",
    title: "UI / UX Design",
    text: "Intuitive interfaces with thoughtful experiences across every screen.",
  },
  {
    number: "04",
    title: "Full-Stack Systems",
    text: "Scalable applications engineered from the interface to the infrastructure.",
  },
];

const projects = [
  {
    number: "01",
    title: "ARKIINZTRIBE",
    category: "Fashion / Digital",
    description:
      "A fashion-forward digital experience combining culture, identity and modern technology.",
    href: "/work/arkiinztribe",
  },
  {
    number: "02",
    title: "ARKIINZTRIBE Logistics",
    category: "Technology / Logistics",
    description:
      "A connected logistics ecosystem designed for delivery coordination, communication and tracking.",
    href: "/work/logistics",
  },
  {
    number: "03",
    title: "Business Systems",
    category: "Software / Development",
    description:
      "Purpose-built digital systems that simplify operations and help ambitious businesses scale.",
    href: "/work/business-systems",
  },
];

export default function Home() {
  return (
    <main>
      {/* Navigation */}
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/" className="brand">
            ARKIINZTRIBE
          </Link>

          <div className="nav-links">
            <Link href="#services">Services</Link>
            <Link href="#work">Work</Link>
            <Link href="#about">About</Link>
            <Link href="#contact">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero section">
        <div className="hero-content">
          <div className="section-label">01 / DIGITAL STUDIO</div>

          <h1>
            Different
            <br />
            <span>Together.</span>
          </h1>

          <p className="hero-description">
            We build distinctive digital experiences, brands and software
            systems for people with ambitious ideas.
          </p>

          <div className="hero-actions">
            <Link href="#work" className="button button-primary">
              Explore our work
            </Link>

            <Link href="#contact" className="button button-secondary">
              Start a project
            </Link>
          </div>
        </div>

        <div className="hero-meta">
          <span>Lagos, Nigeria</span>
          <span>Available worldwide</span>
        </div>
      </section>

      {/* About */}
      <section id="about" className="intro section">
        <div className="section-label">WHO WE ARE</div>

        <div className="intro-content">
          <h2>
            Ideas deserve
            <br />
            <span>precision.</span>
          </h2>

          <p>
            ARKIINZTRIBE is a creative technology studio focused on turning
            ambitious ideas into memorable digital products. From strategy
            and design to development and deployment, we build with purpose,
            precision and character.
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="services section">
        <div className="section-heading">
          <div>
            <div className="section-label">02 / CAPABILITIES</div>

            <h2>Built around your ambition.</h2>
          </div>

          <p>
            From initial concept to full-scale rollout, we transform bold
            ideas into software people love to use.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.number}
              number={service.number}
              title={service.title}
              text={service.text}
            />
          ))}
        </div>
      </section>

      {/* Selected Work */}
      <section id="work" className="work section">
        <div className="section-heading">
          <div>
            <div className="section-label">03 / SELECTED WORK</div>

            <h2>Built to leave a mark.</h2>
          </div>

          <p>
            A selection of digital experiences, systems and ideas crafted
            through design and technology.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.number}
              number={project.number}
              title={project.title}
              category={project.category}
              description={project.description}
              href={project.href}
            />
          ))}
        </div>
      </section>

      {/* Statement */}
      <section className="statement section">
        <div className="statement-inner">
          <div className="section-label">THE APPROACH</div>

          <h2>
            Technology should feel
            <br />
            <span>human.</span>
          </h2>

          <p>
            We care about the details people notice and the ones they never
            have to think about. Every interaction, screen and system should
            have a reason to exist.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact section">
        <div className="section-label">04 / LET&apos;S BUILD</div>

        <div className="contact-content">
          <h2>
            Have an idea?
            <br />
            <span>Let&apos;s make it real.</span>
          </h2>

          <p>
            Tell us what you&apos;re building, what you&apos;re trying to
            solve, or where you want to go next.
          </p>

          <a
            href="mailto:hello@arkiinztribe.com"
            className="button button-primary"
          >
            Start a conversation ↗
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div>
          <strong>ARKIINZTRIBE</strong>
          <span>DIFFERENT TOGETHER.</span>
        </div>

        <div>
          <span>© {new Date().getFullYear()} ARKIINZTRIBE</span>
        </div>
      </footer>
    </main>
  );
}
