import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, KeyRound, ArrowLeft, TrendingUp, Lock, Shield, RefreshCw, Database } from "lucide-react";
import "./LoadingAnimations.css";
import "./HUDTest.css";
import RadarLoading from "./RadarLoading";

const MotionDiv = motion.div;

function PasswordSecurityPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isLoading) {
      // Show loading animation for 2 seconds
      const loadingTimer = setTimeout(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }, 500);

      return () => clearTimeout(loadingTimer);
    }
  }, [isLoading]);

  const stats = [
    { value: "81%", label: "of data breaches are due to weak passwords", icon: <TrendingUp className="h-6 w-6" /> },
    { value: "2.9 billion", label: "passwords were exposed in 2023", icon: <Database className="h-6 w-6" /> },
    { value: "23.2 million", label: "accounts use '123456' as password", icon: <Lock className="h-6 w-6" /> }
  ];

  const practices = [
    {
      title: "Use Unique Passwords",
      description: "Never reuse passwords across multiple accounts",
      icon: <KeyRound className="h-6 w-6" />
    },
    {
      title: "Enable 2FA", 
      description: "Add an extra layer of security with two-factor authentication",
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Use a Password Manager",
      description: "Let technology help you manage complex, unique passwords",
      icon: <Database className="h-6 w-6" />
    },
    {
      title: "Regular Updates",
      description: "Change passwords if you suspect they've been compromised",
      icon: <RefreshCw className="h-6 w-6" />
    }
  ];

  // Show loading screen first
  if (isLoading) {
    return (
      <div className="hud-test-override relative min-h-screen bg-black text-cyan-100 overflow-hidden">
        {/* Back button during loading */}
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '10px 15px',
        }}>
          <button 
            onClick={() => navigate('/test')}
            style={{
              background: 'transparent',
              color: '#00ffff',
              border: '1px solid #00ffff',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '8px 12px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(0, 255, 255, 0.1)';
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            ← Back to Home
          </button>
        </div>

        <RadarLoading message="PASSWORD SECURITY SYSTEMS INITIALIZING" />
      </div>
    );
  }

  return (
    <div className="hud-test-override relative min-h-screen bg-black text-cyan-100 overflow-hidden">
      {/* Back button positioned like in HUD test */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.9)',
        padding: '10px 15px',
      }}>
        <button 
          onClick={() => navigate('/test')}
          style={{
            background: 'transparent',
            color: '#00ffff',
            border: '1px solid #00ffff',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '8px 12px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(0, 255, 255, 0.1)';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          ← Back to Home
        </button>
      </div>

      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-96 w-96 rounded-full opacity-30 blur-3xl bg-gradient-to-r from-cyan-400/25 to-blue-500/25 animate-pulse" style={{ top: '-110px' }}></div>
        <div className="absolute top-20 right-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl bg-gradient-to-r from-teal-400/15 to-cyan-500/15 animate-bounce"></div>
        <div className="absolute bottom-10 left-1/4 h-80 w-80 rounded-full opacity-25 blur-3xl bg-gradient-to-r from-cyan-300/10 to-blue-400/10 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-center px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
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
            <h2 className="text-5xl font-bold text-white drop-shadow-lg" style={{ fontSize: '1.5rem' }}>
              Password Security Tools
            </h2>
          </div>
          <p className="text-xl text-cyan-200 max-w-3xl mx-auto">
            Strengthen your digital security with our comprehensive password analysis and generation tools
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
                Strong passwords are your first line of defense against cyber attacks. 
                Weak passwords can lead to identity theft, financial loss, and privacy breaches.
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
            Security Statistics
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
          <h3 className="text-3xl font-bold text-white mb-8 text-center" style={{ fontSize: '1rem' }}>Best Practices for Password Security</h3>
          <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
            {practices.map((practice, index) => (
              <MotionDiv
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 hover:border-cyan-600/70 hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-cyan-400 mt-1">
                    {practice.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">&nbsp;{practice.title}</h4>
                    <p className="text-cyan-200">{practice.description}</p>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        {/* Security Tool Section */}
        <MotionDiv 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center" style={{ fontSize: '1rem' }}>Password Security Center</h3>
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-8 hover:border-cyan-600/70 hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-white mb-3">Advanced Password Analysis</h4>
                <p className="text-lg text-cyan-200 mb-6"><br />
                  A comprehensive password security tool that combines password checking 
                  against known breaches with secure password generation capabilities.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h5 className="font-semibold text-cyan-400 mb-3"><br />Security Features:</h5>
                  <ul className="space-y-2 text-cyan-200">
                    <li>• Check against 500+ million compromised passwords</li>
                    <li>• Generate cryptographically secure passwords</li>
                    <li>• Real-time strength analysis and recommendations</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-cyan-400 mb-3"><br />Privacy & Control:</h5>
                  <ul className="space-y-2 text-cyan-200">
                    <li>• Customizable password generation options</li>
                    <li>• Completely private - data never leaves your device</li>
                    <li>• Advanced entropy calculations for true randomness</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <motion.button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                  onClick={() => navigate('/passwordchecker')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Access Password Security Tools
                </motion.button>
              </div>
            </div>
          </div>
        </MotionDiv>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-cyan-800/20 px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center justify-between font-mono" style={{ fontSize: '14px', color: '#00ffff' }}>
          <p>© 2025 SecuraSphere. Team CAWWZ. UF Senior Project.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors" style={{ color: '#00ffff' }} onMouseOver={(e) => e.target.style.color = '#ffffff'} onMouseOut={(e) => e.target.style.color = '#00ffff'}>Privacy</a>
            <a href="#" className="transition-colors" style={{ color: '#00ffff' }} onMouseOver={(e) => e.target.style.color = '#ffffff'} onMouseOut={(e) => e.target.style.color = '#00ffff'}>Terms</a>
            <a href="#" className="transition-colors" style={{ color: '#00ffff' }} onMouseOver={(e) => e.target.style.color = '#ffffff'} onMouseOut={(e) => e.target.style.color = '#00ffff'}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PasswordSecurityPage;