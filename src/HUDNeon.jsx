import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, MailSearch, KeyRound, Radar as RadarIcon, ChevronRight } from "lucide-react";

const MotionLink = motion(Link);

const modules = [
  { icon: <MailSearch className="h-5 w-5" />, title: "Phishing Training", desc: "Identify red flags in realistic simulations.", cta: "Start", to: "/phishing" },
  { icon: <KeyRound className="h-5 w-5" />, title: "Password Checker", desc: "Measure strength and get quick fixes.", cta: "Check", to: "/passwordchecker" },
  { icon: <RadarIcon className="h-5 w-5" />, title: "Social Analyzer", desc: "Audit public exposure across profiles.", cta: "Analyze", to: "/social" },
];

export default function HUDNeon() {
  return (
    <div className="relative min-h-screen bg-[#05070b] text-cyan-100 overflow-hidden">
      {/* Background: gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/3 h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl
                        bg-[radial-gradient(closest-side,rgba(34,211,238,0.25),transparent)] animate-floatSlow" />
        <div className="absolute -bottom-48 right-1/4 h-[44rem] w-[44rem] rounded-full opacity-30 blur-3xl
                        bg-[radial-gradient(closest-side,rgba(168,85,247,0.22),transparent)] animate-floatSlower" />
      </div>

      {/* Hex/grid overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]">
        <svg aria-hidden className="w-full h-full">
          <defs>
            <pattern id="hex" width="28" height="24" patternUnits="userSpaceOnUse">
              <path d="M7 0 L21 0 L28 12 L21 24 L7 24 L0 12 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" className="text-cyan-100" />
        </svg>
      </div>

      {/* Radar rings + sweep */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid place-items-center">
        <div className="relative h-[44rem] w-[44rem]">
          {[0,1,2,3].map(i => (
            <span key={i}
              className="absolute inset-0 m-auto rounded-full border border-cyan-300/15 animate-radar"
              style={{
                width: `calc(12rem + ${i * 8}rem)`,
                height: `calc(12rem + ${i * 8}rem)`,
                filter: "drop-shadow(0 0 18px rgba(34,211,238,0.10))"
              }}
            />
          ))}
          <div className="absolute inset-0 m-auto h-full w-full rounded-full overflow-hidden">
            {/* rotating conic sweep using Tailwind animation */}
            <div className="absolute inset-0 rounded-full animate-sweep"
                 style={{
                   background: "conic-gradient(from 0deg, rgba(34,211,238,0.25), rgba(34,211,238,0.0) 35%)",
                   filter: "blur(1px) drop-shadow(0 0 10px rgba(34,211,238,0.35))"
                 }}
            />
          </div>
        </div>
      </div>

      {/* Scanlines */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] mix-blend-screen
                      bg-[repeating-linear-gradient(to_bottom,rgba(0,255,255,0.12)_0px,rgba(0,255,255,0.12)_1px,transparent_1px,transparent_3px)]" />

      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-10 w-10 rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/30 shadow-[0_0_40px_-10px_rgba(34,211,238,0.6)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-[0.02em]">SecuraSphere</h1>
              <p className="text-[11px] text-cyan-200/70 tracking-widest">CYBER AWARENESS SUITE • v1.0</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs text-cyan-200/70">
            <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1">SYSTEM: STABLE</span>
            <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1">RISK INDEX: <strong className="text-cyan-100">B+</strong></span>
            <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1">LAST SYNC: 2m</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <motion.h2
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-semibold tracking-tight"
        >
          Secure habits. Clear signals.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.06 }}
          className="mt-3 max-w-prose text-cyan-100/85"
        >
          Train with realistic simulations and instant feedback inside a heads-up interface.
        </motion.p>

        {/* HUD stat strip */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { k: "SIMULATIONS", v: "1,284" },
            { k: "PASSWORD CHECKS", v: "842" },
            { k: "FINDINGS RESOLVED", v: "67%" },
          ].map((s) => (
            <div key={s.k}
                 className="relative rounded-2xl border border-cyan-300/25 bg-black/35 backdrop-blur-[2px] p-4 shadow-[0_0_40px_-18px_rgba(34,211,238,0.5)]">
              <div className="text-[11px] tracking-widest text-cyan-200/70">{s.k}</div>
              <div className="mt-1 text-2xl font-semibold">{s.v}</div>
              <div className="mt-2 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-4">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight">Modules</h3>
          <Link to="/modules" className="text-sm text-cyan-200/80 hover:text-cyan-100">Browse all</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m, i) => (
            <MotionLink
              key={m.title}
              to={m.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * i }}
              whileHover={{ y: -3 }}
              className="relative rounded-2xl p-5 border border-cyan-300/25 bg-black/35 backdrop-blur-[2px]
                         shadow-[0_0_60px_-20px_rgba(56,189,248,0.6)] hover:shadow-[0_0_70px_-12px_rgba(56,189,248,0.8)]
                         transition"
            >
              <div className="flex items-center gap-2 text-cyan-200">
                <div className="grid place-items-center h-9 w-9 rounded-lg bg-cyan-400/10 ring-1 ring-cyan-300/30">
                  {m.icon}
                </div>
                <div className="font-medium">{m.title}</div>
              </div>
              <p className="mt-3 text-sm text-cyan-100/85 min-h-12">{m.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm rounded-lg px-3 py-1.5 border border-cyan-300/35 bg-cyan-300/10 hover:bg-cyan-300/20">
                {m.cta}
                <ChevronRight className="h-4 w-4" />
              </div>
            </MotionLink>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-300/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-xs text-cyan-200/70 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} SecuraSphere. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-cyan-100">Privacy</a>
            <a href="#" className="hover:text-cyan-100">Terms</a>
            <a href="#" className="hover:text-cyan-100">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
