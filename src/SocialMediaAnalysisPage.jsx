import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Radar as RadarIcon, ArrowLeft, TrendingUp, Users, Eye, Settings, UserCheck } from "lucide-react";
import "./LoadingAnimations.css";
import "./HUDTest.css";
import Footer from "./components/Footer";
import BackButton from "./components/BackButton";
import ForwardButton from "./components/ForwardButton";

const MotionDiv = motion.div;

function SocialMediaAnalysisPage() {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Social media platforms can reveal more personal information than you realize. This data can be used for identity theft, social engineering attacks, or unwanted targeting.";
    
    // Typewriter speed controls (in milliseconds)
  const TYPING_SPEED = 55;        // Speed for regular characters
  const WORD_PAUSE_SPEED = 150;   // Pause duration after each word
    
  useEffect(() => {
    let index = 0;
    let timeoutId;
      
    const typeNextChar = () => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        const currentChar = fullText[index];
        index++;
          
        // Pause briefly after spaces (end of words) to simulate human typing
        const delay = currentChar === ' ' ? WORD_PAUSE_SPEED : TYPING_SPEED;
        timeoutId = setTimeout(typeNextChar, delay);
      }
    };
      
    typeNextChar();
      
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  

  const stats = [
    { value: "2.9 Billion", label: "people use social media worldwide", icon: <Users className="h-6 w-6" style={{height: 50, width: 50}}/> },
    { value: "79%", label: "share personal information online", icon: <Eye className="h-6 w-6" style={{height: 50, width: 50}} /> },
    { value: "86%", label: "of data breaches involve personal data", icon: <TrendingUp className="h-6 w-6" style={{height: 50, width: 50}} /> }
  ];

  const privacyTips = [
    {
      title: "Review Privacy Settings",
      description: "Regularly check and update your privacy settings on all platforms",
      icon: <Settings className="h-6 w-6" />
    },
    {
      title: "Limit Personal Information", 
      description: "Avoid sharing sensitive details like location, phone numbers, or addresses",
      icon: <Eye className="h-6 w-6" />
    },
    {
      title: "Be Selective with Connections",
      description: "Only connect with people you know and trust in real life",
      icon: <UserCheck className="h-6 w-6" />
    },
    {
      title: "Think Before Posting",
      description: "Consider how your posts might be used by malicious actors",
      icon: <RadarIcon className="h-6 w-6" />
    }
  ];

  return (
    <div className="hud-test-override relative min-h-screen bg-black text-cyan-100 overflow-hidden">
      {/* Back button positioned like in HUD test */}
      <BackButton message="Back to Home" path="/test" />
      {/* Forward button to social media tool page */}
      <ForwardButton message="Go to Social Media Anazlyzer" path="/social-media-analyzer-tool" />

      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-96 w-96 rounded-full opacity-30 blur-3xl bg-gradient-to-r from-cyan-400/25 to-blue-500/25 animate-pulse" style={{ top: '-110px' }}></div>
        <div className="absolute top-20 right-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl bg-gradient-to-r from-teal-400/15 to-cyan-500/15 animate-bounce"></div>
        <div className="absolute bottom-10 left-1/4 h-80 w-80 rounded-full opacity-25 blur-3xl bg-gradient-to-r from-cyan-300/10 to-blue-400/10 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-center px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center gap-3"style={{ paddingTop: '30px' }}>
          <ShieldCheck className="h-8 w-8 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold" style={{ color: '#00ffff' }}>
            SECURASPHERE
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 px-8 pb-16">
        {/* Hero Section - Change mb to adjust spacing */}
        <MotionDiv 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-5xl font-bold text-white drop-shadow-lg" style={{ fontSize: '3rem' }}>
              Social Media Privacy Tools
            </h2>
          </div>
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
              <p className="text-lg text-cyan-200 leading-relaxed mb-6 text-center" style={{ fontSize: '1.3rem', minHeight: '3.6rem' }}>
                {displayedText}
                <span className="animate-pulse">|</span>
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
          <h3 className="text-3xl font-bold text-white mb-8 text-center" style={{ fontSize: '1.5rem' }}>
            Privacy Statistics
          </h3>
          <div className="flex gap-8 justify-center max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <MotionDiv
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 text-center hover:border-cyan-600/70 hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300"
                style={{ flex: '1 1 0', minWidth: 0 }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex justify-center mb-4 text-cyan-400">
                  {stat.icon}
                </div>
                <h4 className="text-3xl font-bold text-cyan-400 mb-2"style={{ fontSize: '2.5rem' }}>{stat.value}</h4>
                <p className="text-cyan-200"style={{ fontSize: '1.2rem' }}>{stat.label}</p>
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
          <h3 className="text-3xl font-bold text-white mb-8 text-center" style={{ fontSize: '1.5rem' }}>Best Practices for Social Media Privacy</h3>
          <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
            {privacyTips.map((tip, index) => (
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
                    <p className="text-cyan-200"style={{ fontSize: '1rem' }}>{tip.description}</p>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        {/* Privacy Analyzer Tool Section */}
        <MotionDiv 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-8 hover:border-cyan-600/70 hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-white mb-3">Social Media Privacy Scanner</h4>
                <p className="text-lg text-cyan-200 mb-6"><br />
                  Analyze your social media profiles to identify potential privacy risks 
                  and get personalized recommendations for better security.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h5 className="font-semibold text-cyan-400 mb-3" style={{fontSize: '1.2rem', paddingLeft: '5rem', paddingRight: '0rem'}}><br />Analysis Features:</h5>
                  <ul className="space-y-2 text-cyan-200" style={{fontSize: '1rem', paddingLeft: '5rem'}}>
                    <li>• Scan for exposed personal information</li>
                    <li>• Identify potential security risks</li>
                    <li>• Get personalized privacy recommendations</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-cyan-400 mb-3" style={{fontSize: '1.2rem', paddingLeft: '5rem', paddingRight: '0rem'}}><br />Educational Value:</h5>
                  <ul className="space-y-2 text-cyan-200" style={{fontSize: '1rem', paddingLeft: '5rem'}}>
                    <li>• Learn about social engineering tactics</li>
                    <li>• Completely private - analysis happens locally</li>
                    <li>• Real-time privacy score calculations</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <motion.button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                  onClick={() => navigate("/social-media-analyzer-tool")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Privacy Analysis
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

export default SocialMediaAnalysisPage;