import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, AlertTriangle, Brain, Users, Eye, Search, CheckCircle, XCircle, Instagram, Facebook } from 'lucide-react';
import axios from 'axios';
import './LoadingAnimations.css';
import './HUDTest.css';
import RadarLoading from './RadarLoading';
import Footer from './components/Footer';
import BackButton from './components/BackButton';

const MotionDiv = motion.div;

function SocialMediaAnalyzerTool() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [serviceStatus, setServiceStatus] = useState({ instagram: null, facebook: null });
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const API_BASE_URL = 'http://localhost:5000';

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

  useEffect(() => {
    checkServiceStatus();
  }, []);

  const checkServiceStatus = async () => {
    try {
      // Check Instagram service
      try {
        const instagramResponse = await axios.get(`${API_BASE_URL}/instagram/validate`);
        setServiceStatus(prev => ({
          ...prev,
          instagram: { valid: true, message: instagramResponse.data.message }
        }));
      } catch (error) {
        setServiceStatus(prev => ({
          ...prev,
          instagram: { 
            valid: false, 
            error: error.response?.data?.error || 'Service unavailable' 
          }
        }));
      }

      // Check Facebook service
      try {
        const facebookResponse = await axios.get(`${API_BASE_URL}/facebook/validate`);
        setServiceStatus(prev => ({
          ...prev,
          facebook: { valid: true, message: facebookResponse.data.message }
        }));
      } catch (error) {
        setServiceStatus(prev => ({
          ...prev,
          facebook: { 
            valid: false, 
            error: error.response?.data?.error || 'Service unavailable' 
          }
        }));
      }
    } catch (error) {
      console.error('Error checking service status:', error);
    }
  };

  const analyzeProfile = async () => {
    if (!inputValue.trim()) {
      setError(`Please enter a ${selectedPlatform === 'instagram' ? 'username' : 'page URL'}`);
      return;
    }

    const currentServiceStatus = serviceStatus[selectedPlatform];
    if (!currentServiceStatus?.valid) {
      setError(`${selectedPlatform === 'instagram' ? 'Instagram' : 'Facebook'} analysis service is not available. Please check backend configuration.`);
      return;
    }

    setLoading(true);
    setError('');
    setTestResults(null);

    try {
      console.log(`Starting ${selectedPlatform} analysis for ${inputValue}`);
      
      // Prepare request data based on platform
      const requestData = selectedPlatform === 'instagram' 
        ? { username: inputValue }
        : { pageUrl: inputValue };
      
      // Call backend API
      const response = await axios.post(`${API_BASE_URL}/${selectedPlatform}/analyze`, requestData, {
        timeout: 180000, // 3 minute timeout for scraping
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const analysisResult = response.data;
      console.log('Analysis complete:', analysisResult);
      
      // Set results with additional timestamp
      setTestResults({
        ...analysisResult,
        analysisTimestamp: new Date().toISOString(),
        platform: selectedPlatform
      });
      
    } catch (err) {
      console.error(`${selectedPlatform} analysis error:`, err);
      
      const errorMessage = err.response?.data?.error || err.message;
      
      setTestResults({ 
        error: errorMessage,
        platform: selectedPlatform,
        troubleshooting: {
          commonIssues: selectedPlatform === 'instagram' ? [
            'Username does not exist or profile is private',
            'Backend service is not running',
            'Apify token not configured on server',
            'Instagram temporarily blocked the scraper',
            'Network connectivity issues'
          ] : [
            'Page URL is invalid or page does not exist',
            'Backend service is not running',
            'Apify token not configured on server',
            'Facebook temporarily blocked the scraper',
            'Network connectivity issues'
          ],
          solutions: selectedPlatform === 'instagram' ? [
            'Verify the username exists and is public',
            'Ensure the backend server is running on port 5000',
            'Check that APIFY_TOKEN is set in backend environment',
            'Try again in a few minutes',
            'Test with a different username'
          ] : [
            'Verify the page URL is correct and the page is public',
            'Ensure the backend server is running on port 5000',
            'Check that APIFY_TOKEN is set in backend environment',
            'Try again in a few minutes',
            'Test with a different page URL'
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setInputValue('');
    setTestResults(null);
    setError('');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#dc2626';
      case 'medium': return '#ea580c';
      case 'low': return '#ca8a04';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (score) => {
    if (score >= 7) return '#dc2626'; // red
    if (score >= 4) return '#ea580c'; // orange
    if (score >= 2) return '#ca8a04'; // yellow
    return '#16a34a'; // green
  };

  const getRiskEmoji = (score) => {
    if (score >= 7) return '🚨';
    if (score >= 4) return '⚠️';
    if (score >= 2) return '⚡';
    return '✅';
  };

  const getRiskIcon = (score) => {
    if (score >= 7) return <XCircle className="h-16 w-16" />;
    if (score >= 4) return <AlertTriangle className="h-16 w-16" />;
    if (score >= 2) return <Eye className="h-16 w-16" />;
    return <CheckCircle className="h-16 w-16" />;
  };

  const getPlatformIcon = () => {
    return selectedPlatform === 'instagram' ? 
      <Instagram className="h-12 w-12 text-purple-400" /> : 
      <Facebook className="h-12 w-12 text-blue-400" />;
  };

  const currentServiceStatus = serviceStatus[selectedPlatform];

  if (isLoading) {
    return (
      <div className="hud-test-override relative min-h-screen bg-black text-cyan-100 overflow-hidden">
        {/* Back button during loading */}
        <BackButton message='Back to Social Media Information' path='/social' />

        <RadarLoading message="ANALYZING SOCIAL MEDIA CONTENT" />
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
      <BackButton message='Back to Social Media Information' path='/social' />

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
              <Users className="h-12 w-12 text-cyan-400" />
              <h1 style={{ fontSize: '3rem' }} className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                &nbsp;&nbsp;SOCIAL&nbsp;MEDIA&nbsp;ANALYZER&nbsp;&nbsp;
              </h1>
              {getPlatformIcon()}
            </div>
            <p style={{ fontSize: '1.2rem', paddingBottom: '30px' }} className="text-cyan-300 max-w-3xl mx-auto">
              &nbsp;&nbsp;ANALYZE&nbsp;PROFILES&nbsp;FOR&nbsp;PRIVACY&nbsp;RISKS&nbsp;&nbsp;
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
                {testResults && !testResults.error && (
                  <MotionDiv
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                  >
                {/* Risk Score Card */}
                <div 
                  className="bg-black/40 backdrop-blur-md border rounded-lg p-8 text-center"
                  style={{
                    borderColor: getRiskColor(testResults.riskScore) + '50',
                    boxShadow: `0 0 30px ${getRiskColor(testResults.riskScore)}30`
                  }}
                >
                  <div className="space-y-6">
                    <div className="flex justify-center" style={{ color: getRiskColor(testResults.riskScore) }}>
                      {getRiskIcon(testResults.riskScore)}
                    </div>
                    
                    <div>
                      <h3 style={{ fontSize: '1.5rem' }} className="font-mono font-bold mb-2">
                        &nbsp;&nbsp;PRIVACY&nbsp;RISK&nbsp;SCORE&nbsp;&nbsp;
                      </h3>
                      <div 
                        style={{ 
                          fontSize: '3rem',
                          color: getRiskColor(testResults.riskScore)
                        }}
                        className="font-mono font-bold"
                      >
                        {testResults.riskScore}/10
                      </div>
                      <div 
                        style={{ 
                          fontSize: '1.2rem',
                          color: getRiskColor(testResults.riskScore)
                        }}
                        className="font-mono font-bold mt-2"
                      >
                        {testResults.riskScore >= 7 ? 'HIGH RISK' : 
                         testResults.riskScore >= 4 ? 'MEDIUM RISK' : 
                         testResults.riskScore >= 2 ? 'LOW RISK' : 'SECURE'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      <div className="space-y-2">
                        <p className="font-mono">
                          <span className="text-cyan-400">PLATFORM:</span> 
                          <span className="ml-2 text-white uppercase">
                            {testResults.platform}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-mono">
                          <span className="text-cyan-400">PII FOUND:</span> 
                          <span className="ml-2 text-white">
                            {testResults.findings?.length || 0} items
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PII Findings */}
                {testResults.findings && testResults.findings.length > 0 && (
                  <div className="bg-black/40 backdrop-blur-md border border-orange-500/30 rounded-lg p-6">
                    <h4 className="text-orange-400 font-mono font-bold mb-4 text-center" style={{ fontSize: '1.2rem' }}>
                      🔍 &nbsp;&nbsp;PERSONAL&nbsp;INFORMATION&nbsp;DETECTED&nbsp;&nbsp; 🔍
                    </h4>
                    <div className="space-y-4">
                      {testResults.findings.map((finding, index) => (
                        <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-cyan-400 font-mono font-bold text-sm">
                              {finding.type.toUpperCase()}
                            </span>
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-bold text-white"
                              style={{ backgroundColor: getSeverityColor(finding.severity) }}
                            >
                              {finding.confidence}% CONFIDENCE
                            </span>
                          </div>
                          <div className="text-white font-mono text-sm mb-2">
                            <span className="text-gray-400">FOUND:</span> "{finding.value}"
                          </div>
                          {finding.context && (
                            <div className="text-gray-400 font-mono text-xs italic">
                              <span className="text-gray-300">CONTEXT:</span> {finding.context}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {testResults.recommendations && testResults.recommendations.length > 0 && (
                  <div className="bg-green-900/20 backdrop-blur-md border border-green-500/30 rounded-lg p-6">
                    <h4 className="text-green-400 font-mono font-bold mb-4 text-center" style={{ fontSize: '1.2rem' }}>
                      💡 &nbsp;&nbsp;SECURITY&nbsp;RECOMMENDATIONS&nbsp;&nbsp; 💡
                    </h4>
                    <div className="space-y-3">
                      {testResults.recommendations.map((rec, index) => (
                        <div key={index} className="bg-green-900/20 rounded-lg p-4 border border-green-500/20">
                          <div className="text-green-300 font-mono font-bold text-sm mb-2">
                            {rec.title.toUpperCase()}
                          </div>
                          <div className="text-green-200 font-mono text-sm">
                            {rec.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </MotionDiv>
            )}

            {/* Error Results */}
            {testResults && testResults.error && (
              <MotionDiv
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-red-900/20 backdrop-blur-md border border-red-500/30 rounded-lg p-6"
              >
                <h4 className="text-red-400 font-mono font-bold mb-4 text-center" style={{ fontSize: '1.2rem' }}>
                  ❌ &nbsp;&nbsp;ANALYSIS&nbsp;FAILED&nbsp;&nbsp; ❌
                </h4>
                <p className="text-red-300 font-mono mb-4 text-center">
                  {testResults.error}
                </p>
                
                {testResults.troubleshooting && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-red-400 font-mono font-bold mb-2">COMMON ISSUES:</h5>
                      <ul className="space-y-1 text-red-200 font-mono text-sm">
                        {testResults.troubleshooting.commonIssues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-green-400 font-mono font-bold mb-2">SOLUTIONS:</h5>
                      <ul className="space-y-1 text-green-200 font-mono text-sm">
                        {testResults.troubleshooting.solutions.map((solution, index) => (
                          <li key={index}>• {solution}</li>
                        ))}
                      </ul>
                    </div>
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
                    Our AI system analyzes public social media profiles to detect exposed 
                    personal information (PII) that could be used by malicious actors.
                  </p>
                  <p>
                    It scans for emails, phone numbers, addresses, and other sensitive data 
                    that might put your privacy at risk.
                  </p>
                  <p className="text-cyan-400 font-bold">
                    REMEMBER: This tool only analyzes public information. Always review your 
                    privacy settings and think before you post.
                  </p>
                </div>
              </div>
            </MotionDiv>
              </div>
              
              {/* Right Column - Main Tool Interface */}
              <div className="w-full lg:w-1/2">
                {/* Platform Selector */}
                <MotionDiv
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg p-8 mb-6"
                >
                  <div className="space-y-4">
                    <div className="text-center">
                      <label style={{ fontSize: '1.1rem' }} className="block text-cyan-300 mb-3 font-mono">
                        &nbsp;&nbsp;SELECT&nbsp;PLATFORM:&nbsp;&nbsp;
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="w-full bg-black/60 border border-cyan-500/50 rounded-md p-4 text-cyan-100 font-mono focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none flex justify-between items-center"
                          style={{
                            backdropFilter: 'blur(5px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)'
                          }}
                        >
                          <span>{selectedPlatform === 'instagram' ? '📷 INSTAGRAM' : '📘 FACEBOOK'}</span>
                          <span>{dropdownOpen ? '▲' : '▼'}</span>
                        </button>
                        {dropdownOpen && (
                          <div className="absolute top-full left-0 w-full mt-1 rounded-md shadow-lg z-50" style={{ backgroundColor: 'black'}}>
                            <button
                              onClick={() => {
                                setSelectedPlatform('instagram');
                                setInputValue('');
                                setTestResults(null);
                                setError('');
                                setDropdownOpen(false);
                              }}
                              className="w-full p-4 text-left font-mono hover:bg-gray-100 transition-colors duration-200"
                              style={{ color: 'black' }}
                            >
                              📷 INSTAGRAM
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPlatform('facebook');
                                setInputValue('');
                                setTestResults(null);
                                setError('');
                                setDropdownOpen(false);
                              }}
                              className="w-full p-4 text-left font-mono hover:bg-gray-100 transition-colors duration-200"
                              style={{ color: 'black' }}
                            >
                              📘 FACEBOOK
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Status */}
                    {currentServiceStatus && (
                      <div className="text-center" style={{ paddingTop: '3rem', paddingBottom: '1.5rem' }}>
                        <div 
                          className={`inline-block px-4 py-2 rounded-lg font-mono text-sm ${
                            currentServiceStatus.valid 
                              ? 'bg-green-900/30 border border-green-500/50 text-green-300' 
                              : 'bg-red-900/30 border border-red-500/50 text-red-300'
                          }`}
                          style={{ border: 'black' }}
                        >
                          {currentServiceStatus.valid ? (
                            <>✅ {selectedPlatform.toUpperCase()} SERVICE READY</>
                          ) : (
                            <>❌ {selectedPlatform.toUpperCase()} SERVICE UNAVAILABLE</>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </MotionDiv>

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
                        htmlFor="profile-input" 
                        style={{ fontSize: '1.1rem', paddingBottom: '0.5rem' }}
                        className="block text-cyan-300 mb-3 font-mono"
                      >
                        &nbsp;&nbsp;{selectedPlatform === 'instagram' ? "USERNAME:" : 'PAGE URL:'}&nbsp;&nbsp;
                      </label>
                      <input
                        id="profile-input"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={selectedPlatform === 'instagram' ? 'Enter Instagram username...' : 'Enter Facebook page URL...'}
                        disabled={loading}
                        className="w-full bg-black/60 border border-cyan-500/50 rounded-md p-4 text-cyan-100 font-mono focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none resize-none black-text-textarea"
                        style={{
                          backdropFilter: 'blur(5px)'
                        }}
                      />
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={analyzeProfile}
                        disabled={loading || !inputValue.trim() || !currentServiceStatus?.valid}
                        className="group relative px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-mono font-bold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]"
                        style={{
                          boxShadow: loading ? 'none' : '0 0 20px rgba(0, 255, 255, 0.3)',
                          transform: loading ? 'scale(0.95)' : 'scale(1)',
                          marginRight: '1rem'
                        }}
                      >
                        {loading ? (
                          <span className="flex items-center space-x-2">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>ANALYZING...</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-2">
                            <Search className="h-4 w-4" />
                            <span>ANALYZE PROFILE</span>
                          </span>
                        )}
                      </button>

                      <button
                        onClick={clearAnalysis}
                        disabled={loading}
                        className="px-8 py-3 bg-transparent border border-cyan-500 text-cyan-400 font-mono font-bold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500/10 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                      >
                        CLEAR
                      </button>
                    </div>
                  </div>
                </MotionDiv>
              </div>
            </div>
            
               { /* Footer */}
               <Footer />
              </MotionDiv>
            </header>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialMediaAnalyzerTool;