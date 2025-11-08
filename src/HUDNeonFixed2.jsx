import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, MailSearch, KeyRound, Radar as RadarIcon, ChevronRight } from "lucide-react";

const MotionLink = motion(Link);

const modules = [
  { 
    icon: <MailSearch className="h-5 w-5" />, 
    title: "Phishing Training", 
    desc: "Identify red flags in realistic simulations.", 
    cta: "Start", 
    to: "/phishing" 
  },
  { 
    icon: <KeyRound className="h-5 w-5" />, 
    title: "Password Checker", 
    desc: "Measure strength and get quick fixes.", 
    cta: "Check", 
    to: "/passwordchecker" 
  },
  { 
    icon: <RadarIcon className="h-5 w-5" />, 
    title: "Social Analyzer", 
    desc: "Audit public exposure across profiles.", 
    cta: "Analyze", 
    to: "/social" 
  },
];

function HUDNeonWorking() {
  return (
    <div className="relative min-h-screen bg-slate-900 text-cyan-100 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Floating background blobs */}
        <div className="absolute -top-40 left-1/3 h-96 w-96 rounded-full opacity-30 blur-3xl bg-gradient-to-r from-cyan-400/25 to-blue-500/25 animate-pulse"></div>
        <div className="absolute top-20 right-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl bg-gradient-to-r from-teal-400/15 to-cyan-500/15 animate-bounce"></div>
        <div className="absolute bottom-10 left-1/4 h-80 w-80 rounded-full opacity-25 blur-3xl bg-gradient-to-r from-cyan-300/10 to-blue-400/10 animate-pulse"></div>
        
        {/* Additional scanning effects */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-cyan-500 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-blue-400 rounded-full animate-pulse opacity-50"></div>
      </div>

      {/* Radar positioned at very top center */}
      <div className="relative z-10 flex justify-center pt-4 pb-8">
        <div className="relative">
          {/* Outer radar ring */}
          <div className="w-64 h-64 border-4 border-cyan-400 rounded-full animate-ping opacity-60"></div>
          
          {/* Middle radar ring - properly centered */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 border-2 border-cyan-300 rounded-full animate-pulse opacity-70"></div>
          
          {/* Inner radar ring - properly centered */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-cyan-200 rounded-full animate-bounce opacity-80"></div>
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          
          {/* Radar sweep line */}
          <div className="absolute top-1/2 left-1/2 transform -translate-y-0.5 w-32 h-1 bg-cyan-400 origin-left animate-spin"></div>
        </div>
      </div>

      {/* Header - positioned below radar */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            SECURASPHERE
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 px-8 pb-16">
        {/* Welcome Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white drop-shadow-lg">
            Welcome to the Future
          </h2>
          <p className="text-lg text-cyan-200 max-w-2xl mx-auto">
            Advanced security training modules powered by next-generation threat intelligence.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <MotionLink
              key={index}
              to={module.to}
              className="group relative block"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative overflow-hidden rounded-xl border border-cyan-800/30 bg-slate-800/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-cyan-600/70 hover:shadow-2xl hover:shadow-cyan-500/25 hover:bg-slate-700/70 hover:scale-105 transform">
                {/* Glowing edge effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-xl border border-cyan-400/0 group-hover:border-cyan-400/50 transition-all duration-500 animate-pulse"></div>
                
                {/* Icon */}
                <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  {module.icon}
                </div>
                
                {/* Content */}
                <h3 className="relative mb-2 text-xl font-semibold text-white group-hover:text-cyan-100 transition-colors">
                  {module.title}
                </h3>
                <p className="relative mb-4 text-sm text-cyan-200/80 group-hover:text-cyan-200 transition-colors">
                  {module.desc}
                </p>
                
                {/* CTA */}
                <div className="relative flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <span className="text-sm font-medium">{module.cta}</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </MotionLink>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-cyan-800/20 px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center justify-between text-sm text-cyan-300/60">
          <p>© 2025 SecureMatrix. Advanced Threat Intelligence.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cyan-100 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-100 transition-colors">Terms</a>
            <a href="#" className="hover:text-cyan-100 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HUDNeonWorking;