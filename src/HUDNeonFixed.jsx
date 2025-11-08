import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, MailSearch, KeyRound, Radar as RadarIcon, ChevronRight } from "lucide-react";

const MotionLink = motion(Link);

const modules = [
  { icon: React.createElement(MailSearch, { className: "h-5 w-5" }), title: "Phishing Training", desc: "Identify red flags in realistic simulations.", cta: "Start", to: "/phishing" },
  { icon: React.createElement(KeyRound, { className: "h-5 w-5" }), title: "Password Checker", desc: "Measure strength and get quick fixes.", cta: "Check", to: "/passwordchecker" },
  { icon: React.createElement(RadarIcon, { className: "h-5 w-5" }), title: "Social Analyzer", desc: "Audit public exposure across profiles.", cta: "Analyze", to: "/social" },
];

function HUDNeon() {
  return React.createElement(
    "div",
    { className: "relative min-h-screen bg-[#05070b] text-cyan-100 overflow-hidden" },
    
    // Background gradient blobs
    React.createElement(
      "div",
      { className: "pointer-events-none absolute inset-0 -z-10" },
      React.createElement("div", { 
        className: "absolute -top-40 left-1/3 h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl bg-[radial-gradient(closest-side,rgba(34,211,238,0.25),transparent)] animate-floatSlow"
      }),
      React.createElement("div", { 
        className: "absolute top-20 right-1/4 h-[24rem] w-[24rem] rounded-full opacity-20 blur-3xl bg-[radial-gradient(closest-side,rgba(6,182,212,0.15),transparent)] animate-floatMedium"
      }),
      React.createElement("div", { 
        className: "absolute bottom-10 left-1/4 h-[32rem] w-[32rem] rounded-full opacity-25 blur-3xl bg-[radial-gradient(closest-side,rgba(0,255,255,0.1),transparent)] animate-floatFast"
      })
    ),

    // Header
    React.createElement(
      "header",
      { className: "relative z-10 flex items-center justify-between px-8 py-6" },
      React.createElement(
        "div",
        { className: "flex items-center gap-3" },
        React.createElement(ShieldCheck, { className: "h-8 w-8 text-cyan-400" }),
        React.createElement(
          "h1",
          { className: "text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent" },
          "SECURE MATRIX"
        )
      )
    ),

    // Main content
    React.createElement(
      "main",
      { className: "relative z-10 px-8 pb-16" },
      
      // Welcome section
      React.createElement(
        "div",
        { className: "mb-16 text-center" },
        React.createElement(
          "h2",
          { className: "mb-4 text-4xl font-bold text-white" },
          "SecuraSphere"
        ),
        React.createElement(
          "p",
          { className: "text-lg text-cyan-200 max-w-2xl mx-auto" },
          "Advanced security training modules powered by next-generation threat intelligence."
        )
      ),

      // Modules grid
      React.createElement(
        "div",
        { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto" },
        ...modules.map((module, index) =>
          React.createElement(
            MotionLink,
            {
              key: index,
              to: module.to,
              className: "group relative block",
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 }
            },
            React.createElement(
              "div",
              { className: "relative overflow-hidden rounded-xl border border-cyan-800/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-600/50 hover:shadow-lg hover:shadow-cyan-500/10" },
              
              // Icon
              React.createElement(
                "div",
                { className: "mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400" },
                module.icon
              ),
              
              // Content
              React.createElement(
                "h3",
                { className: "mb-2 text-xl font-semibold text-white group-hover:text-cyan-100" },
                module.title
              ),
              React.createElement(
                "p",
                { className: "mb-4 text-sm text-cyan-200/80" },
                module.desc
              ),
              
              // CTA
              React.createElement(
                "div",
                { className: "flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300" },
                React.createElement(
                  "span",
                  { className: "text-sm font-medium" },
                  module.cta
                ),
                React.createElement(ChevronRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })
              )
            )
          )
        )
      )
    ),

    // Footer
    React.createElement(
      "footer",
      { className: "relative z-10 border-t border-cyan-800/20 px-8 py-6" },
      React.createElement(
        "div",
        { className: "flex items-center justify-between text-sm text-cyan-300/60" },
        React.createElement(
          "p",
          null,
          "© 2025 SecureMatrix. Advanced Threat Intelligence."
        ),
        React.createElement(
          "div",
          { className: "flex gap-6" },
          React.createElement("a", { href: "#", className: "hover:text-cyan-100" }, "Privacy"),
          React.createElement("a", { href: "#", className: "hover:text-cyan-100" }, "Terms"),
          React.createElement("a", { href: "#", className: "hover:text-cyan-100" }, "Contact")
        )
      )
    )
  );
}

export default HUDNeon;