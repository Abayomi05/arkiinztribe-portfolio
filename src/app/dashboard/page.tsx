"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Clock, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface Brief {
  id: string;
  name: string;
  email: string;
  project: string;
  problem: string | null;
  goals: string | null;
  timeline: string | null;
  budget: string | null;
  status: string;
  created_at: string;
  emailed_at: string | null;
}

export default function Dashboard() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0 });

  useEffect(() => {
    fetchBriefs();
  }, []);

  async function fetchBriefs() {
    try {
      const response = await fetch("/api/dashboard/briefs", {
        headers: { Accept: "application/json" },
      });
      const data = await response.json();
      setBriefs(data.briefs || []);
      setStats(data.stats || { total: 0, pending: 0, delivered: 0 });
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }

  async function deleteBrief(id: string) {
    if (!window.confirm("Delete this project brief?")) return;
    await fetch(`/api/dashboard/briefs/${id}`, { method: "DELETE" });
    setBriefs((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <nav className="glass border-b border-[var(--line)] sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/Arkiinztribe.png"
              alt="ARKIINZTRIBE"
              width={40}
              height={14}
              className="brand-logo"
            />
            <span className="text-gradient font-bold text-xl tracking-tight">
              ARKIINZTRIBE
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
            <Link href="/dashboard" className="text-[var(--neon-cyan)]">
              Dashboard
            </Link>
            <Link href="/#work" className="hover:text-[var(--text)] transition-colors">
              Work
            </Link>
            <Link href="/#services" className="hover:text-[var(--text)] transition-colors">
              Services
            </Link>
            <Link href="/#about" className="hover:text-[var(--text)] transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-[var(--text)] text-sm font-medium hover:bg-[var(--surface-2)] transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--neon-pink)] animate-pulse" />{" "}
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Dashboard</h1>
            <p className="text-[var(--muted)]">
              Manage your project briefs and studio activity
            </p>
          </div>

          <Link
            href="/#contact"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[var(--neon-purple)] via-[var(--neon-cyan)] to-[var(--neon-pink)] text-white font-bold rounded-xl shadow-lg hover:shadow-[var(--neon-purple-glow)] hover:shadow-[var(--neon-cyan-glow)] transition-all"
          >
            <ArrowRight className="w-5 h-5" /> New Brief
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Briefs" value={stats.total} icon={<Mail className="w-6 h-6 text-[var(--neon-cyan)]" />} color="var(--neon-cyan)" />
          <StatCard title="Pending" value={stats.pending} icon={<Clock className="w-6 h-6 text-[var(--neon-purple)]" />} color="var(--neon-purple)" />
          <StatCard title="Delivered" value={stats.delivered} icon={<CheckCircle className="w-6 h-6 text-[var(--neon-pink)]" />} color="var(--neon-pink)" />
        </div>

        <div className="glass rounded-2xl border border-[var(--line)] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--surface)]/50">
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">Loading briefs…</td></tr>
                ) : briefs.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">No project briefs yet.{" "}<Link href="/#contact" className="text-[var(--neon-cyan)] hover:text-[var(--neon-pink)] font-medium">Submit your first brief</Link>.</td></tr>
                ) : (
                  briefs.map((brief) => (
                    <tr key={brief.id} className="border-b border-[var(--line)] hover:bg-[var(--surface)]/30 transition-colors">
                      <td className="px-6 py-4"><div className="font-medium text-[var(--text)]">{brief.project}</div><div className="text-xs text-[var(--muted)] mt-1">{brief.problem?.slice(0, 60)}…</div></td>
                      <td className="px-6 py-4"><div className="font-medium text-[var(--text)]">{brief.name}</div><div className="text-xs text-[var(--muted)]">{brief.email}</div></td>
                      <td className="px-6 py-4"><span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", brief.status === "delivered" ? "bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] border border-[var(--neon-pink)]/20" : "bg-[var(--neon-purple)]/10 text-[var(--neon-purple)] border border-[var(--neon-purple)]/20")}>{brief.status === "delivered" ? (<><CheckCircle className="w-3 h-3" /> Delivered</>) : (<><Clock className="w-3 h-3" /> Pending</>)}</span></td>
                      <td className="px-6 py-4 text-[var(--muted)] text-sm">{new Date(brief.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right"><button onClick={() => deleteBrief(brief.id)} className="text-[var(--muted)] hover:text-[var(--neon-pink)] transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="glass rounded-xl p-6 border border-[var(--line)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--muted)]">{title}</h3>
        <div className="w-10 h-10 rounded-lg bg-[var(--surface-2)] flex items-center justify-center border border-[var(--line)]"><span className="text-[500px] filter drop-shadow-[0_0_8px_{color}]" style={{ color }}>{icon}</span></div>
      </div>
      <div className="text-2xl font-bold text-[var(--text)]">{value}</div>
    </div>
  );
}