import Image from "next/image";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import MotionReveal from "@/components/MotionReveal";
import MotionIntro from "@/components/MotionIntro";
import AgentPanel from "@/components/AgentPanel";
import ProjectBriefMailButton from "@/components/ProjectBriefMailButton";
import { ArrowRight, Mail, Code2, Palette, Layers, Zap, Monitor, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    number: "01",
    title: "Web Development",
    icon: <Code2 className="w-6 h-6" />,
    color: "var(--neon-purple)",
    text: "Fast, responsive and conversion-focused websites built around your business goals.",
  },
  {
    number: "02",
    title: "Software Systems",
    icon: <Cpu className="w-6 h-6" />,
    color: "var(--neon-cyan)",
    text: "Scalable digital products, dashboards and business systems designed for real-world use.",
  },
  {
    number: "03",
    title: "UI / UX Design",
    icon: <Palette className="w-6 h-6" />,
    color: "var(--neon-pink)",
    text: "Interfaces and experiences engineered to make complex products feel simple.",
  },
  {
    number: "04",
    title: "Brand Systems",
    icon: <Layers className="w-6 h-6" />,
    color: "var(--neon-purple)",
    text: "Distinctive identities and digital systems built to make businesses recognizable.",
  },
];

const projects = [
  {
    id: "01",
    type: "LOGISTICS PLATFORM",
    title: "ARKIINZTRIBE Logistics",
    description:
      "A logistics platform connecting businesses, riders and customers through delivery coordination, tracking, communication and payments.",
    tags: ["Flutter", "Node.js", "MongoDB"],
    href: "/work/arkiinztribe-logistics",
    image: "/projects/arkiinztribe.svg",
    status: "BUILDING",
    color: "var(--neon-cyan)",
  },
  {
    id: "02",
    type: "BUSINESS OPERATIONS",
    title: "Business Systems",
    description:
      "A focused digital operations system built to replace disconnected workflows with clearer data, automation and centralized business control.",
    tags: ["Next.js", "TypeScript", "UI/UX"],
    href: "/work/business-systems",
    image: "/projects/business-systems.svg",
    status: "COMPLETED",
    color: "var(--neon-purple)",
  },
  {
    id: "03",
    type: "BRAND SYSTEM",
    title: "ARKIINZTRIBE Brand",
    description:
      "A fashion and digital brand system bringing identity, culture, creative direction and technology into one recognizable experience.",
    tags: ["Branding", "Creative", "Design"],
    href: "/work/arkiinztribe",
    image: "/brand/Arkiinztribe.png",
    status: "ACTIVE",
    color: "var(--neon-pink)",
  },
];

export default function Home() {
  return (
    <main className="system-page min-h-screen bg-[var(--background)] text-[var(--text)]">
      <MotionIntro />

      <nav className="system-navbar">
        <Link href="/" className="system-logo" aria-label="ARKIINZTRIBE home">
          <Image
            src="/brand/Arkiinztribe.png"
            alt="ARKIINZTRIBE"
            width={160}
            height={54}
            priority
            className="brand-logo"
          />
          <span className="text-gradient font-bold text-xl tracking-tight ml-2 hidden md:inline">
            ARKIINZTRIBE
          </span>
        </Link>

        <div className="system-nav-links hidden md:flex items-center gap-8">
          <a href="#work" className="text-sm font-medium transition-colors hover:text-[var(--text)]">
            WORK
          </a>
          <a href="#services" className="text-sm font-medium transition-colors hover:text-[var(--text)]">
            SYSTEMS
          </a>
          <a href="#lab" className="text-sm font-medium transition-colors hover:text-[var(--text)]">
            LAB
          </a>
          <a href="#about" className="text-sm font-medium transition-colors hover:text-[var(--text)]">
            ABOUT
          </a>
        </div>

        <div className="system-nav-actions flex items-center gap-4">
          <Link
            href="/auth/sign-in"
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--neon-cyan)] transition-colors hidden md:inline"
          >
            Sign in
          </Link>
          <Link
            href="#contact"
            className="px-5 py-2.5 bg-gradient-to-r from-[var(--neon-purple)] via-[var(--neon-cyan)] to-[var(--neon-pink)] text-white text-sm font-bold rounded-full shadow-lg hover:shadow-[var(--neon-purple-glow)] hover:shadow-[var(--neon-cyan-glow)] transition-all"
          >
            Start a project
          </Link>
        </div>

        <MobileNav />
      </nav>

      <section className="system-hero relative">
        <div className="system-grid absolute inset-0 z-0" />
        <div className="hero-scanline absolute inset-0 z-0 opacity-30" />

        <div className="system-hero-content relative z-2">
          <div className="system-eyebrow flex items-center gap-3 mb-6">
            <span className="status-dot" />
            <span>ARKIINZTRIBE // DIGITAL STUDIO</span>
            <span className="text-xs opacity-50">NG / 2026</span>
          </div>

          <h1 className="mb-6 leading-[0.9]">
            Full-stack digital
            <br />
            <em className="text-gradient">experiences</em>
            <br />
            that move businesses.
          </h1>

          <p className="hero-description mb-8 max-w-2xl">
            We design and build websites, software systems and brand
            experiences for ambitious companies. From concept to launch,
            every pixel is intentional.
          </p>

          <div className="hero-actions flex flex-wrap gap-4">
            <Link
              href="#work"
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[var(--neon-purple)] via-[var(--neon-cyan)] to-[var(--neon-pink)] text-white font-bold rounded-full shadow-lg hover:shadow-[var(--neon-purple-glow)] hover:shadow-[var(--neon-cyan-glow)] transition-all text-sm"
            >
              <ArrowRight className="w-5 h-5" /> View our work
            </Link>
            <Link
              href="/auth/sign-up"
              className="flex items-center gap-2 px-6 py-3.5 border border-[var(--line)] bg-[var(--surface)] rounded-full text-[var(--text)] font-bold hover:bg-[var(--surface-2)] transition-all text-sm"
            >
              <span>Join studio</span>
            </Link>
          </div>
        </div>
      </section>

      <MotionReveal delay={0.1}>
        <section id="services" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-widest mb-4 block">
                04 core systems
              </span>
              <h2 className="text-4xl font-bold text-gradient mb-6">We build what matters.</h2>
              <p className="text-[var(--muted)] max-w-2xl mx-auto">
                Four dedicated practice areas, each engineered for real-world
                impact and scalable growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <div
                  key={service.number}
                  className="glass rounded-2xl p-8 border border-[var(--line)] hover:border-[var(--neon-cyan)]/50 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[var(--neon-purple)] font-bold text-sm tracking-tight">
                      {service.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">
                    {service.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal delay={0.2}>
        <section id="work" className="py-24 relative border-t border-[var(--line)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
              <div>
                <span className="text-[var(--neon-pink)] text-xs font-bold uppercase tracking-widest mb-4 block">
                  Selected works
                </span>
                <h2 className="text-4xl font-bold text-gradient mb-4">
                  Our digital systems
                </h2>
              </div>
              <Link
                href="/#contact"
                className="px-5 py-2.5 border border-[var(--line)] bg-[var(--surface)] rounded-full text-[var(--text)] font-bold hover:bg-[var(--surface-2)] hover:border-[var(--neon-pink)]/50 transition-all text-sm"
              >
                Start a project <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={project.href}
                  className="group block glass rounded-2xl border border-[var(--line)] overflow-hidden hover:border-[var(--neon-cyan)]/50 transition-all"
                >
                  <div className="relative h-48 overflow-hidden bg-[var(--surface-2)]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width={400}
                      height={250}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/90 via-[var(--background)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border text-[${project.color}] border-[${project.color}]/30`}>
                          {project.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[var(--text)]">{project.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2 block">
                      {project.type}
                    </span>
                    <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                    <p className="text-[var(--muted)] text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded bg-[var(--surface-2)] border border-[var(--line)] text-[var(--muted)] text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal delay={0.1}>
        <section id="lab" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[var(--neon-purple)] text-xs font-bold uppercase tracking-widest mb-4 block">
                03 current experiments
              </span>
              <h2 className="text-4xl font-bold text-gradient mb-6">The lab.</h2>
              <p className="text-[var(--muted)] max-w-2xl mx-auto">
                Experimental projects, R&D and speculative design work we're
                exploring right now.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  number: "01",
                  title: "AI Agents",
                  status: "RESEARCH",
                  color: "var(--neon-purple)",
                },
                {
                  number: "02",
                  title: "Logistics Systems",
                  status: "BUILDING",
                  color: "var(--neon-cyan)",
                },
                {
                  number: "03",
                  title: "Business Automation",
                  status: "EXPLORING",
                  color: "var(--neon-pink)",
                },
                {
                  number: "04",
                  title: "Digital Experiences",
                  status: "ACTIVE",
                  color: "var(--neon-purple)",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="glass rounded-2xl p-8 border border-[var(--line)] hover:border-[var(--neon-purple)]/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[var(--neon-purple)] font-bold text-sm">{item.number}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border text-[${item.color}] border-[${item.color}]/30`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <div className="lab-command mt-8 pt-4 border-t border-[var(--line)]">
                    <span className="text-[var(--neon-cyan)] text-sm">&gt;</span>
                    <span className="text-[var(--muted)] text-sm"> observing current experiments</span>
                    <span className="typing-cursor text-[var(--neon-pink)]">_</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal delay={0.2}>
        <section id="about" className="py-24 relative border-t border-[var(--line)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-widest mb-4 block">
                  05 system philosophy
                </span>
                <h2 className="text-4xl font-bold text-gradient mb-6">
                  Different
                  <br />
                  <em>together.</em>
                </h2>
                <p className="text-[var(--muted)] text-lg leading-relaxed mb-8">
                  The best digital work happens when technology and creativity
                  operate as one system. We think about the people using the
                  product, the business behind it and the result it needs to
                  produce.
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { number: "01", label: "Discover" },
                    { number: "02", label: "Design" },
                    { number: "03", label: "Build" },
                    { number: "04", label: "Launch" },
                  ].map((step) => (
                    <div
                      key={step.number}
                      className="flex items-center gap-3 text-xs font-bold text-[var(--muted)] uppercase tracking-wider"
                    >
                      <span className="text-[var(--neon-purple)]">{step.number}</span>
                      {step.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-8 border border-[var(--line)]">
                <div className="flex items-center justify-between mb-6">
                  <span className="w-2 h-2 rounded-full bg-[var(--neon-pink)]" />
                  <span className="w-2 h-2 rounded-full bg-[var(--neon-purple)]" />
                  <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-[var(--neon-cyan)]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text)]">Responsive by default</h4>
                      <p className="text-[var(--muted)] text-sm">Every system works flawlessly across all devices.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[var(--neon-pink)]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text)]">Performance focused</h4>
                      <p className="text-[var(--muted)] text-sm">Optimized for speed, Core Web Vitals and conversion.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-[var(--neon-purple)]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text)]">Full-stack capable</h4>
                      <p className="text-[var(--muted)] text-sm">From frontend to database, we own the entire stack.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="contact" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--surface)]/30 blurred" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="text-[var(--neon-pink)] text-xs font-bold uppercase tracking-widest mb-4 block">
                06 incoming project
              </span>
              <h2 className="text-4xl font-bold text-gradient mb-6">
                Have an idea?
                <br />
                <em>initialize it.</em>
              </h2>
              <p className="text-[var(--muted)] max-w-2xl mx-auto">
                Tell us what you&apos;re building, what problem you&apos;re solving
                and where you want the system to go.
              </p>
            </div>

            <div className="max-w-3xl mx-auto glass rounded-2xl border border-[var(--line)] p-8 shadow-2xl">
              <ProjectBriefMailButton />
            </div>
          </div>
        </section>
      </MotionReveal>

      <footer className="border-t border-[var(--line)] bg-[var(--surface)]/50">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/Arkiinztribe.png"
              alt="ARKIINZTRIBE"
              width={140}
              height={47}
              className="brand-logo"
            />
          </div>
          <div className="text-[var(--muted)] text-sm">
            © 2026 ARKIINZTRIBE. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-[var(--muted)] text-sm">
            <a href="/" className="hover:text-[var(--neon-cyan)] transition-colors">Home</a>
            <a href="#work" className="hover:text-[var(--neon-cyan)] transition-colors">Work</a>
            <a href="#about" className="hover:text-[var(--neon-cyan)] transition-colors">About</a>
            <a href="/auth/sign-in" className="hover:text-[var(--neon-cyan)] transition-colors">Sign in</a>
          </div>
        </div>
      </footer>

      <AgentPanel />
    </main>
  );
}
