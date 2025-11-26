import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, MailSearch, ArrowLeft, TrendingUp, Shield, AlertTriangle, Brain } from "lucide-react";
import "./LoadingAnimations.css";
import "./HUDTest.css";
import Footer from './components/Footer';
import BackButton from './components/BackButton';

const MotionDiv = motion.div;

function PhishingTrainingPage() {
  const navigate = useNavigate();

  const stats = [
    { value: "3.4 billion", label: "phishing emails sent daily", icon: <MailSearch className="h-6 w-6" /> },
    { value: "83%", label: "of organizations experienced phishing attacks", icon: <TrendingUp className="h-6 w-6" /> },
    { value: "$12 billion", label: "lost to phishing scams annually", icon: <AlertTriangle className="h-6 w-6" /> }
  ];

  const tips = [
    {
      title: "Check Sender Identity",
      description: "Verify email addresses and be wary of urgent requests",
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Examine Links Carefully", 
      description: "Hover over links to see the actual destination before clicking",
      icon: <MailSearch className="h-6 w-6" />
    },
    {
      title: "Watch for Poor Grammar",
      description: "Legitimate organizations rarely send emails with spelling errors",
      icon: <AlertTriangle className="h-6 w-6" />
    },
    {
      title: "Trust Your Instincts",
      description: "If something feels suspicious, verify through official channels",
      icon: <Brain className="h-6 w-6" />
    }
  ];

  return (
    <div className="hud-test-override relative min-h-screen bg-black text-cyan-100 overflow-hidden">
      {/* Back button positioned like in HUD test */}
      <BackButton message="Back to Home" path="/test" />

      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-96 w-96 rounded-full opacity-30 blur-3xl bg-gradient-to-r from-cyan-400/25 to-blue-500/25 animate-pulse" style={{ top: '-110px' }}></div>
        <div className="absolute top-20 right-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl bg-gradient-to-r from-teal-400/15 to-cyan-500/15 animate-bounce"></div>
        <div className="absolute bottom-10 left-1/4 h-80 w-80 rounded-full opacity-25 blur-3xl bg-gradient-to-r from-cyan-300/10 to-blue-400/10 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-center px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center gap-3" style={{ paddingTop: '30px' }}>
          <ShieldCheck className="h-8 w-8 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold" style={{ color: '#00ffff' }}>
            SECURASPHERE
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 px-8 pb-16">
        {/* Hero Section */}
        <MotionDiv 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            {/*<MailSearch className="h-12 w-12 text-cyan-400" />*/}
            <h2 className="text-5xl font-bold text-white drop-shadow-lg" style={{ fontSize: '1.5rem' }}>
              Phishing Email Training
            </h2>
          </div>
          <p className="text-xl text-cyan-200 max-w-3xl mx-auto">
            Learn to identify and avoid phishing attacks with our advanced training system
          </p>
        </MotionDiv>

        {/* Understanding Section */}
        <MotionDiv 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-8">
              <p className="text-lg text-cyan-200 leading-relaxed mb-6 text-center" style={{ fontSize: '0.9rem' }}>
                Phishing is a cybercrime where attackers impersonate legitimate organizations 
                to steal sensitive information like passwords, credit card numbers, or personal data.
              </p>
            </div>
          </div>
        </MotionDiv>

        {/* Stats Grid */}
        <MotionDiv 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center" style={{ fontSize: '1rem' }}>
            Threat Statistics
          </h3>
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <MotionDiv
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 text-center hover:border-cyan-600/70 hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex justify-center mb-4 text-cyan-400">
                  {stat.icon}
                </div>
                <h4 className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</h4>
                <p className="text-cyan-200">{stat.label}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        {/* Best Practices */}
        <MotionDiv 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center"style={{ fontSize: '1rem' }}>Best Practices for Email Security</h3>
          <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
            {tips.map((tip, index) => (
              <MotionDiv
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 hover:border-cyan-600/70 hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-cyan-400 mt-1">
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">&nbsp;{tip.title}</h4>
                    <p className="text-cyan-200">{tip.description}</p>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        {/* Training Tool Section */}
        <MotionDiv 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center"style={{ fontSize: '1rem' }}>AI-Powered Training Tool</h3>
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-8 hover:border-cyan-600/70 hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500">
              <div className="text-center mb-6">

                <h4 className="text-2xl font-bold text-white mb-3">AI-Powered Email Analyzer</h4>
                <p className="text-lg text-cyan-200 mb-6"><br />
                  Our advanced phishing detection tool uses machine learning to analyze 
                  email content and identify potential phishing attempts.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h5 className="font-semibold text-cyan-400 mb-3"><br />Features:</h5>
                  <ul className="space-y-2 text-cyan-200">
                    <li>• Real-time analysis of email content and structure</li>
                    <li>• Detection of common phishing tactics and patterns</li>
                    <li>• Educational feedback on suspicious elements</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-cyan-400 mb-3"><br />Benefits:</h5>
                  <ul className="space-y-2 text-cyan-200">
                    <li>• Safe testing environment for learning</li>
                    <li>• Completely private - emails analyzed locally</li>
                    <li>• Interactive training with immediate feedback</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <motion.button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                  onClick={() => navigate('/phishing-trainer-tool')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Our Phishing Detection Tool
                </motion.button>
              </div>
            </div>
          </div>
        </MotionDiv>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PhishingTrainingPage;