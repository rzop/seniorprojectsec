import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, MailSearch, KeyRound, Radar as RadarIcon, ChevronRight } from "lucide-react";
import "./LoadingAnimations.css";
import Footer from "./components/Footer";

const MotionLink = motion(Link);


const modules = [
  { 
    icon: <MailSearch className="h-5 w-5" />, 
    title: "Phishing Training", 
    desc: "Learn how to spot suspicious emails.", 
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
    title: "Social Media Analyzer", 
    desc: "Check your online privacy exposure.", 
    cta: "Analyze", 
    to: "/social" 
  },
];

function HUDNeonWorking() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-black text-cyan-100 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Background Opaque Circle Thing*/}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-96 w-96 rounded-full opacity-30 blur-3xl bg-gradient-to-r from-cyan-400/25 to-blue-500/25 animate-pulse" style={{ top: '-110px' }}></div>
      </div>

      {/* Radar positioned at very top center */}
      <div className="relative z-10 flex justify-center pt-4 pb-8">
        <div className="loading-radar">
          <div className="radar-ring-pulse"></div>
        </div>
      </div>

      {/* Header - positioned below radar */}
      <header className="relative z-20 flex items-center justify-center px-8 py-6 backdrop-blur-sm">
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
            The Future of Cybersecurity Training
          </h2>
          <p className="text-lg text-cyan-200 max-w-2xl mx-auto">
            Explore our advanced modules designed to enhance your security awareness and skills.
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
      <Footer />
    </div>
  );
}

export default HUDNeonWorking;