import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MailSearch, ArrowLeft, AlertTriangle, Brain, Shield, CheckCircle } from 'lucide-react';
import axios from 'axios';
import './LoadingAnimations.css';
import './HUDTest.css';
import RadarLoading from './RadarLoading';
import Footer from './components/Footer';
import BackButton from './components/BackButton';

const MotionDiv = motion.div;

function PhishingTrainerTool() {
  const navigate = useNavigate();
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  const analyzeEmail = async () => {
    if (!emailText.trim()) {
      setError('Please enter email text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/predict', {
        email: emailText
      });

      setResult(response.data);
    } catch (err) {
      console.error('Error analyzing email:', err);
      setError('Failed to analyze email. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setEmailText('');
    setResult(null);
    setError('');
  };

  const getResultColor = (label) => {
    return label === 'phishing' ? '#ff0080' : '#00ffff';
  };

  const getResultIcon = (label) => {
    return label === 'phishing' ? <AlertTriangle className="h-8 w-8" /> : <CheckCircle className="h-8 w-8" />;
  };

  // Show loading screen first
  if (isLoading) {
    return (
      <div className="hud-test-override relative min-h-screen bg-black text-cyan-100 overflow-hidden">
        {/* Back button during loading */}
        <BackButton message="Back to Phishing Info" path="/phishing" />

        {/* Loading animation */}
        <RadarLoading message="PHISHING DETECTION SYSTEMS INITIALIZING" />
      </div>
    );
  }

  return (
    <div className="hud-test-override relative min-h-screen bg-black text-cyan-100 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 z-0">
        <div className="grid-background opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-purple-900/10"></div>
      </div>

      {/* Back button */}
      <BackButton message="Back to Phishing Info" path="/phishing" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Centered Container */}
        <div className="w-full flex justify-center" style={{ paddingTop: '30px' }}>
          <div className="w-full max-w-4xl px-4">
            {/* Header */}
            <header className="pt-32 pb-8 text-center" style={{ paddingTop: '0px !important' }}>
              <MotionDiv
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
            <div className="flex justify-center items-center space-x-4">
              <Brain className="h-12 w-12 text-cyan-400" />
              <h1 style={{ fontSize: '3rem' }} className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                &nbsp;&nbsp;PHISHING&nbsp;EMAIL&nbsp;DETECTOR&nbsp;&nbsp;
              </h1>
              <MailSearch className="h-12 w-12 text-purple-400" />
            </div>
            <p style={{ fontSize: '1.2rem', paddingBottom: '30px' }} className="text-cyan-300 max-w-3xl mx-auto">
              &nbsp;&nbsp;ANALYZE&nbsp;EMAIL&nbsp;CONTENT&nbsp;FOR&nbsp;PHISHING&nbsp;THREATS&nbsp;&nbsp;
            </p>
            
            {/* Two Column Layout */}
            <div className="pt-8 flex flex-col lg:flex-row gap-8">
              {/* Left Column - Results and How It Works */}
              <div className="w-full lg:w-1/2 space-y-8">
                {/* Error Message */}
                {error && (
                  <MotionDiv
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-900/40 backdrop-blur-md border border-red-500/50 rounded-lg p-6 text-center"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                      <p className="text-red-300 font-mono">&nbsp;&nbsp;{error}&nbsp;&nbsp;</p>
                    </div>
                  </MotionDiv>
                )}

                {/* Results Section */}
                {result && (
                  <MotionDiv
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                  >
                {/* Main Result Card */}
                <div 
                  className="bg-black/40 backdrop-blur-md border rounded-lg p-8 text-center"
                  style={{
                    borderColor: getResultColor(result.label) + '50',
                    boxShadow: `0 0 30px ${getResultColor(result.label)}30`
                  }}
                >
                  <div className="space-y-6">
                    <div className="flex justify-center" style={{ color: getResultColor(result.label) }}>
                      {getResultIcon(result.label)}
                    </div>
                    
                    <div>
                      <h3 style={{ fontSize: '1.5rem' }} className="font-mono font-bold mb-2">
                        &nbsp;&nbsp;ANALYSIS&nbsp;RESULT&nbsp;&nbsp;
                      </h3>
                      <div 
                        style={{ 
                          fontSize: '1.3rem',
                          color: getResultColor(result.label)
                        }}
                        className="font-mono font-bold"
                      >
                        {result.label === 'phishing' ? 
                          '⚠️ SUSPICIOUS - POSSIBLE PHISHING' : 
                          '✅ LEGITIMATE - APPEARS SAFE'
                        }
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      <div className="space-y-2">
                        <p className="font-mono">
                          <span className="text-cyan-400">PREDICTION:</span> 
                          <span className="ml-2" style={{ color: getResultColor(result.label) }}>
                            {result.label.toUpperCase()}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-mono">
                          <span className="text-cyan-400">CONFIDENCE:</span> 
                          <span className="ml-2 text-white">
                            {result.prediction}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips Section */}
                {result.label === 'phishing' && (
                  <div className="bg-red-900/20 backdrop-blur-md border border-red-500/30 rounded-lg p-6">
                    <h4 className="text-red-400 font-mono font-bold mb-4 text-center" style={{ fontSize: '1.2rem' }}>
                      ⚠️ &nbsp;&nbsp;RED&nbsp;FLAGS&nbsp;TO&nbsp;WATCH&nbsp;FOR&nbsp;&nbsp; ⚠️
                    </h4>
                    <ul className="space-y-2 text-red-200 font-mono">
                      <li>• Urgent language or threats</li>
                      <li>• Suspicious sender addresses</li>
                      <li>• Requests for personal information</li>
                      <li>• Unexpected attachments or links</li>
                      <li>• Generic greetings</li>
                      <li>• Poor grammar and spelling</li>
                    </ul>
                  </div>
                )}

                {result.label === 'legit' && (
                  <div className="bg-green-900/20 backdrop-blur-md border border-green-500/30 rounded-lg p-6">
                    <h4 className="text-green-400 font-mono font-bold mb-4 text-center" style={{ fontSize: '1.2rem' }}>
                      ✅ &nbsp;&nbsp;EMAIL&nbsp;APPEARS&nbsp;LEGITIMATE&nbsp;&nbsp; ✅
                    </h4>
                    <p className="text-green-200 font-mono mb-3">
                      This email appears legitimate, but always remember to:
                    </p>
                    <ul className="space-y-2 text-green-200 font-mono">
                      <li>• Verify sender identity if unexpected</li>
                      <li>• Be cautious with links and attachments</li>
                      <li>• Trust your instincts</li>
                      <li>• When in doubt, verify through alternate channels</li>
                    </ul>
                  </div>
                )}
              </MotionDiv>
            )}

            {/* How It Works Section */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg p-8"
            >
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center space-x-3">
                  <Shield className="h-8 w-8 text-cyan-400" />
                  <h3 style={{ fontSize: '1.5rem' }} className="font-mono font-bold">
                    &nbsp;&nbsp;HOW&nbsp;THIS&nbsp;WORKS&nbsp;&nbsp;
                  </h3>
                  <Brain className="h-8 w-8 text-purple-400" />
                </div>
                
                <div className="space-y-4 text-cyan-200 font-mono">
                  <p>
                    Our AI model has been trained on thousands of emails to identify common 
                    phishing patterns. It analyzes the language, structure, and content of 
                    your email to provide a prediction.
                  </p>
                  <p className="text-cyan-400 font-bold">
                    REMEMBER: This is a learning tool. Always use your best 
                    judgment and consult with IT security if you're unsure about an email.
                  </p>
                </div>
              </div>
            </MotionDiv>
              </div>
              
              {/* Right Column - Main Tool Interface */}
              <div className="w-full lg:w-1/2">
                {/* Input Section */}
                <MotionDiv
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg p-8"
                >
              <div className="space-y-6">
                <div>
                  <label 
                    htmlFor="email-text" 
                    style={{ fontSize: '1.1rem' }}
                    className="block text-cyan-300 mb-3 font-mono"
                  >
                    &nbsp;&nbsp;EMAIL&nbsp;CONTENT:&nbsp;&nbsp;
                  </label>
                  <textarea
                    id="email-text"
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    placeholder="Paste the email content here for analysis..."
                    rows={10}
                    disabled={loading}
                    className="w-full bg-black/60 border border-cyan-500/50 rounded-md p-4 text-cyan-100 font-mono focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none resize-none black-text-textarea"
                    style={{
                      minHeight: '200px',
                      backdropFilter: 'blur(5px)'
                    }}
                  />
                </div>

                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={analyzeEmail}
                    disabled={loading || !emailText.trim()}
                    className="group relative px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-mono font-bold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: loading ? 'none' : '0 0 20px rgba(0, 255, 255, 0.3)',
                      transform: loading ? 'scale(0.95)' : 'scale(1)'
                    }}
                    onMouseOver={(e) => {
                      if (!loading && emailText.trim()) {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
                      }
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>ANALYZING...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <Brain className="h-4 w-4" />
                        <span>ANALYZE EMAIL</span>
                      </span>
                    )}
                  </button>

                  <button
                    onClick={clearAnalysis}
                    disabled={loading}
                    className="px-8 py-3 bg-transparent border border-cyan-500 text-cyan-400 font-mono font-bold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onMouseOver={(e) => {
                      if (!loading) {
                        e.target.style.background = 'rgba(0, 255, 255, 0.1)';
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!loading) {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    CLEAR
                  </button>
                </div>
              </div>
            </MotionDiv>
              </div>
            </div>

              {/* Footer */}
                <Footer />
              </MotionDiv>
            </header>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhishingTrainerTool;