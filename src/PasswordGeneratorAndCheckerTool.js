/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, AlertTriangle, Brain, Key, Eye, Search, CheckCircle, XCircle, Lock, Unlock, Copy, RefreshCw } from 'lucide-react';
import './LoadingAnimations.css';
import './HUDTest.css';
import RadarLoading from './RadarLoading';
import Footer from './components/Footer';
import BackButton from './components/BackButton';
import AIHelper from './components/AIHelper';

const MotionDiv = motion.div;

function PasswordGeneratorAndCheckerTool() {
  const navigate = useNavigate();
  const [inputPassword, setInputPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(16);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('checker');
  const [checkResults, setCheckResults] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generationType, setGenerationType] = useState('random');
  const [customPrefix, setCustomPrefix] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Password generation options
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const TOP_10_COMMON_PASSWORDS = [
    '123456', '123456789', '12345678', 'password', 'qwerty123',
    'qwerty1', '111111', '12345', 'secret', '123123'
  ];

  React.useEffect(() => {
    if (isLoading) {
      const loadingTimer = setTimeout(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }, 500);

      return () => clearTimeout(loadingTimer);
    }
  }, [isLoading]);

  // SHA-1 hashing function for HIBP API
  const sha1 = async (message) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
  };

  // Blum Blum Shub algorithm for secure random number generation
  const gcd = (a, b) => {
    a = BigInt(a);
    b = BigInt(b);
    if (b === 0n) return a < 0n ? -a : a;
    return gcd(b, a % b);
  };

  const blumBlumShub = (p, q, bitLength) => {
    const n = p * q;
    let seed = 0n;
    let GCD = 0n;
    
    while (GCD !== 1n) {
      const randomArray = new Uint32Array(8);
      crypto.getRandomValues(randomArray);
      
      seed = 0n;
      for (let i = 0; i < randomArray.length; i++) {
        seed = (seed << 32n) | BigInt(randomArray[i]);
      }
      seed = seed % (n - 1n) + 1n;
      GCD = gcd(seed, n);
    }
    
    let x = seed;
    let bits = '';
    
    for (let i = 0; i < bitLength; i++) {
      x = (x * x) % n;
      bits += (x & 1n).toString();
    }
    
    return bits;
  };

  // Generate password function
  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      setGeneratedPassword('Please select at least one character type!');
      return;
    }

    let password = '';
    
    if (generationType === 'cryptographic') {
      // Use Blum Blum Shub for cryptographic generation
      const p = BigInt('499'); // Large prime
      const q = BigInt('503'); // Large prime
      const bits = blumBlumShub(p, q, passwordLength * 8);
      
      for (let i = 0; i < passwordLength; i++) {
        const binaryChunk = bits.slice(i * 8, (i + 1) * 8);
        const charIndex = parseInt(binaryChunk, 2) % charset.length;
        password += charset[charIndex];
      }
    } else if (generationType === 'memorable') {
      // Generate memorable password with prefix
      const words = ['Secure', 'Strong', 'Safe', 'Guard', 'Shield', 'Armor', 'Vault', 'Lock'];
      const numbers = Math.floor(Math.random() * 10000);
      const symbols = '!@#$%';
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      password = `${customPrefix || words[Math.floor(Math.random() * words.length)]}${numbers}${symbol}`;
    } else {
      // Standard random generation
      for (let i = 0; i < passwordLength; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
      }
    }

    setGeneratedPassword(password);
    setCopied(false);
  };

  // Check password strength
  const checkPassword = async (passwordToCheck = inputPassword) => {
    if (!passwordToCheck.trim()) return;

    setIsChecking(true);
    let strength = 0;
    let issues = [];
    let recommendations = [];

    try {
      // Length check
      if (passwordToCheck.length < 8) {
        issues.push({ type: 'Length', severity: 'high', message: 'Password too short (minimum 8 characters)' });
      } else if (passwordToCheck.length < 15) {
        issues.push({ type: 'Length', severity: 'medium', message: 'NIST recommends 15+ characters' });
        strength += 1;
      } else {
        strength += 2;
      }

      // Character variety checks
      if (!/[a-z]/.test(passwordToCheck)) {
        issues.push({ type: 'Lowercase', severity: 'medium', message: 'No lowercase letters' });
      } else strength += 1;

      if (!/[A-Z]/.test(passwordToCheck)) {
        issues.push({ type: 'Uppercase', severity: 'medium', message: 'No uppercase letters' });
      } else strength += 1;

      if (!/[0-9]/.test(passwordToCheck)) {
        issues.push({ type: 'Numbers', severity: 'medium', message: 'No numbers' });
      } else strength += 1;

      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordToCheck)) {
        issues.push({ type: 'Symbols', severity: 'low', message: 'No special characters' });
      } else strength += 1;

      // Common password check
      if (TOP_10_COMMON_PASSWORDS.includes(passwordToCheck.toLowerCase())) {
        issues.push({ type: 'Common', severity: 'high', message: 'This is a commonly used password' });
        strength = Math.max(0, strength - 3);
      }

      // HIBP check
      let breachCount = 0;
      try {
        const hash = await sha1(passwordToCheck);
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);
        
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const data = await response.text();
        
        const lines = data.split('\n');
        for (let line of lines) {
          const [hashSuffix, count] = line.split(':');
          if (hashSuffix === suffix) {
            breachCount = parseInt(count);
            break;
          }
        }

        if (breachCount > 0) {
          issues.push({ 
            type: 'Breached', 
            severity: 'high', 
            message: `Found in ${breachCount.toLocaleString()} data breaches` 
          });
          strength = Math.max(0, strength - 3);
        } else {
          strength += 1;
        }
      } catch (error) {
        console.error('HIBP API Error:', error);
      }

      // Generate recommendations
      if (passwordToCheck.length < 15) {
        recommendations.push({ title: 'Increase Length', description: 'Use 15+ characters for better security' });
      }
      if (issues.some(i => i.type === 'Common')) {
        recommendations.push({ title: 'Avoid Common Passwords', description: 'Create a unique password not found in common lists' });
      }
      if (breachCount > 0) {
        recommendations.push({ title: 'Change Immediately', description: 'This password has been compromised in data breaches' });
      }
      if (issues.some(i => ['Lowercase', 'Uppercase', 'Numbers', 'Symbols'].includes(i.type))) {
        recommendations.push({ title: 'Add Character Variety', description: 'Include uppercase, lowercase, numbers, and symbols' });
      }

      const riskScore = Math.min(10, Math.max(0, 10 - strength));

      setCheckResults({
        password: passwordToCheck,
        riskScore,
        strength,
        issues,
        recommendations,
        breachCount,
        analysisTimestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Password check error:', error);
      setCheckResults({
        error: 'Failed to analyze password. Please try again.',
        password: passwordToCheck
      });
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const clearPassword = () => {
    setInputPassword('');
    setGeneratedPassword('');
    setCheckResults(null);
    setCopied(false);
  };

  const getRiskColor = (score) => {
    if (score >= 7) return '#ff0000ff'; // red
    if (score >= 4) return '#ff5900ff'; // orange
    if (score >= 2) return '#f1f90bff'; // yellow
    return '#16a34a'; // green
  };

  const getRiskIcon = (score) => {
    if (score >= 7) return <XCircle className="h-16 w-16" />;
    if (score >= 4) return <AlertTriangle className="h-16 w-16" />;
    if (score >= 2) return <Eye className="h-16 w-16" />;
    return <CheckCircle className="h-16 w-16" />;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ff0000ff';
      case 'medium': return '#ff5900e0';
      case 'low': return '#f1f90b9b';
      default: return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <div className="hud-test-override relative min-h-screen bg-black text-cyan-100 overflow-hidden">
        {/* Back button */}
        <BackButton message="Back to Password Security" path="/passwordchecker" />
        
        {/* Show loading animation */}
        <RadarLoading message="PASSWORD SECURITY SYSTEMS INITIALIZING" />
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

      {/* AI Helper Component */}
      <AIHelper />

      {/* Back button */}
      <BackButton message="Back to Password Security" path="/passwordchecker" />

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
              <Lock className="h-12 w-12 text-cyan-400" />
              <h1 style={{ fontSize: '3rem' }} className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                &nbsp;&nbsp;PASSWORD&nbsp;SECURITY&nbsp;TOOLS&nbsp;&nbsp;
              </h1>
              <Key className="h-12 w-12 text-purple-400" />
            </div>
            <p style={{ fontSize: '1.2rem', paddingBottom: '30px' }} className="text-cyan-300 max-w-3xl mx-auto">
              &nbsp;&nbsp;GENERATE&nbsp;AND&nbsp;ANALYZE&nbsp;SECURE&nbsp;PASSWORDS&nbsp;&nbsp;
            </p>
            
            {/* Two Column Layout */}
            <div className="pt-8 flex flex-col lg:flex-row gap-8">
              {/* Left Column - Results and How It Works */}
              <div className="w-full lg:w-1/2 space-y-8">
                {/* Results Section */}
                {checkResults && !checkResults.error && (
                  <MotionDiv
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                  >
                    {/* Password Security Score */}
                    <div 
                      className="bg-black/40 backdrop-blur-md border rounded-lg p-8 text-center"
                      style={{
                        borderColor: getRiskColor(checkResults.riskScore) + '50',
                        boxShadow: `0 0 30px ${getRiskColor(checkResults.riskScore)}30`
                      }}
                    >
                      <div className="space-y-6">
                        <div className="flex justify-center" style={{ color: getRiskColor(checkResults.riskScore) }}>
                          {getRiskIcon(checkResults.riskScore)}
                        </div>
                        
                        <div>
                          <h3 style={{ fontSize: '1.5rem' }} className="font-mono font-bold mb-2">
                            &nbsp;&nbsp;PASSWORD&nbsp;SECURITY&nbsp;SCORE&nbsp;&nbsp;
                          </h3>
                          <div 
                            style={{ 
                              fontSize: '3rem',
                              color: getRiskColor(checkResults.riskScore)
                            }}
                            className="font-mono font-bold"
                          >
                            {10 - checkResults.riskScore}/10
                          </div>
                          <div 
                            style={{ 
                              fontSize: '1.2rem',
                              color: getRiskColor(checkResults.riskScore)
                            }}
                            className="font-mono font-bold mt-2"
                          >
                            {checkResults.riskScore >= 7 ? 'WEAK' : 
                             checkResults.riskScore >= 4 ? 'MODERATE' : 
                             checkResults.riskScore >= 2 ? 'STRONG' : 'EXCELLENT'}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                          <div className="space-y-2">
                            <p className="font-mono">
                              <span className="text-cyan-400">LENGTH:</span> 
                              <span className="ml-2 text-white">
                                {checkResults.password.length} characters
                              </span>
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="font-mono">
                              <span className="text-cyan-400">BREACHES:</span> 
                              <span className="ml-2 text-white">
                                {checkResults.breachCount?.toLocaleString() || 0}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security Issues */}
                    {checkResults.issues && checkResults.issues.length > 0 && (
                      <div className="bg-black/40 backdrop-blur-md border border-red-500/30 rounded-lg p-6">
                        <h4 className="text-red-400 font-mono font-bold mb-4 text-center" style={{ fontSize: '1.2rem' }}>
                          ⚠️ &nbsp;&nbsp;SECURITY&nbsp;ISSUES&nbsp;&nbsp; ⚠️
                        </h4>
                        <div className="space-y-4">
                          {checkResults.issues
                            .sort((a, b) => {
                              const severityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                              return severityOrder[b.severity] - severityOrder[a.severity];
                            })
                            .map((issue, index) => (
                            <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                              <div className="flex items-center justify-between">
                                <span className="text-cyan-400 font-mono font-bold text-sm">
                                  {issue.type.toUpperCase()}
                                </span>
                                <div className="text-white font-mono text-sm flex-1 text-center px-4">
                                  {issue.message}
                                </div>
                                <span 
                                  className="px-4 py-1 rounded-full text-sm font-bold text-white shadow-lg"
                                  style={{ 
                                    backgroundColor: getSeverityColor(issue.severity),
                                    minWidth: '80px',
                                    textAlign: 'center',
                                    display: 'inline-block'
                                  }}
                                >
                                  {issue.severity.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {checkResults.recommendations && checkResults.recommendations.length > 0 && (
                      <div className="bg-green-900/20 backdrop-blur-md border border-green-500/30 rounded-lg p-6">
                        <h4 className="text-green-400 font-mono font-bold mb-4 text-center" style={{ fontSize: '1.2rem' }}>
                          💡 &nbsp;&nbsp;SECURITY&nbsp;RECOMMENDATIONS&nbsp;&nbsp; 💡
                        </h4>
                        <div className="space-y-3">
                          {checkResults.recommendations.map((rec, index) => (
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
                {checkResults && checkResults.error && (
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
                      {checkResults.error}
                    </p>
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
                        Our password analyzer checks against NIST guidelines, common password 
                        lists, and the "Have I Been Pwned" database to assess security risks.
                      </p>
                      <p>
                        The generator uses cryptographic algorithms including Blum Blum Shub 
                        for truly random password generation with customizable complexity.
                      </p>
                      <p className="text-cyan-400 font-bold">
                        REMEMBER: Always use unique passwords for each account and enable 
                        two-factor authentication when available.
                      </p>
                    </div>
                  </div>
                </MotionDiv>
              </div>
              
              {/* Right Column - Main Tool Interface */}
              <div className="w-full lg:w-1/2">
                {/* Tab Selector */}
                <MotionDiv
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg p-8 mb-6"
                >
                  <div className="space-y-4">
                    <div className="text-center">
                      <label style={{ fontSize: '1.1rem' }} className="block text-cyan-300 mb-3 font-mono">
                        &nbsp;&nbsp;SELECT&nbsp;TOOL:&nbsp;&nbsp;
                      </label>
                      <div className="flex space-x-8 justify-center">
                        <button
                          onClick={() => setActiveTab('checker')}
                          className={`px-6 py-3 font-mono font-bold rounded-md transition-all duration-300 ${
                            activeTab === 'checker' 
                              ? 'bg-cyan-600 text-white' 
                              : 'bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'
                          }`}
                          style={{ marginRight: '10px' }}
                        >
                          🔍 CHECKER
                        </button>
                        <button
                          onClick={() => setActiveTab('generator')}
                          className={`px-6 py-3 font-mono font-bold rounded-md transition-all duration-300 ${
                            activeTab === 'generator' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500/10'
                          }`}
                        >
                          ⚡ GENERATOR
                        </button>
                      </div>
                    </div>
                  </div>
                </MotionDiv>

                {/* Password Checker */}
                {activeTab === 'checker' && (
                  <MotionDiv
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg p-8"
                  >
                    <div className="space-y-6">
                      <div>
                        <label 
                          htmlFor="password-input" 
                          style={{ fontSize: '1.1rem', paddingBottom: '15px' }}
                          className="block text-cyan-300 mb-3 font-mono"
                        >
                          &nbsp;&nbsp;ENTER&nbsp;PASSWORD&nbsp;TO&nbsp;ANALYZE:&nbsp;&nbsp;
                        </label>
                        <input
                          id="password-input"
                          type="password"
                          value={inputPassword}
                          onChange={(e) => setInputPassword(e.target.value)}
                          placeholder="Enter your password..."
                          disabled={isChecking}
                          className="w-full bg-black/60 border border-cyan-500/50 rounded-md p-4 text-cyan-100 font-mono focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none resize-none black-text-textarea"
                          style={{
                            backdropFilter: 'blur(5px)', paddingBottom: '10px', paddingTop: '10px'
                          }}
                        />
                      </div>

                      <div className="flex justify-center space-x-4" style={{ paddingTop: '10px' }}>
                        <button
                          onClick={() => checkPassword()}
                          disabled={isChecking || !inputPassword.trim()}
                          className="group relative px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono font-bold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]"
                          style={{
                            marginRight: '10px',
                            boxShadow: isChecking ? 'none' : '0 0 20px rgba(0, 255, 255, 0.3)',
                            transform: isChecking ? 'scale(0.95)' : 'scale(1)'
                          }}
                        >
                          {isChecking ? (
                            <span className="flex items-center space-x-2">
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              <span>ANALYZING...</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-2" >
                              <Search className="h-4 w-4" />
                              <span>CHECK PASSWORD</span>
                            </span>
                          )}
                        </button>

                        <button
                          onClick={clearPassword}
                          disabled={isChecking}
                          className="px-8 py-3 bg-transparent border border-cyan-500 text-cyan-400 font-mono font-bold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500/10 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                        >
                          CLEAR
                        </button>
                      </div>
                    </div>
                  </MotionDiv>
                )}

                {/* Password Generator */}
                {activeTab === 'generator' && (
                  <MotionDiv
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-8"
                    style={{ height: '425px' }}
                  >
                    <div className="space-y-6">
                      {/* Generation Type */}
                      <div>
                        <label style={{ fontSize: '1.1rem' }} className="block text-purple-300 mb-3 font-mono">
                          &nbsp;&nbsp;GENERATION&nbsp;TYPE:&nbsp;&nbsp;
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full bg-black/60 border border-black-500/50 rounded-md p-4 text-purple-100 font-mono focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none flex justify-between items-center"
                            style={{
                              border: '1px solid black',
                              backdropFilter: 'blur(5px)',
                              backgroundColor: 'rgba(0, 0, 0, 0.8)'
                            }}
                          >
                            <span>
                              {generationType === 'random' ? '🎲 RANDOM' : 
                               generationType === 'cryptographic' ? '🔒 CRYPTOGRAPHIC' : 
                               '💭 MEMORABLE'}
                            </span>
                            <span>{dropdownOpen ? '▲' : '▼'}</span>
                          </button>
                          {dropdownOpen && (
                            <div 
                              style={{ 
                                position: 'absolute',
                                top: '100%',
                                left: '0',
                                width: '100%',
                                marginTop: '4px',
                                borderRadius: '6px',
                                backgroundColor: '#000000',
                                border: '1px solid black',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                zIndex: 9999,
                                overflow: 'visible'
                              }}
                            >
                              <button
                                onClick={() => {
                                  setGenerationType('random');
                                  setDropdownOpen(false);
                                }}
                                style={{ 
                                  width: '100%',
                                  padding: '16px',
                                  textAlign: 'left',
                                  fontFamily: 'monospace',
                                  color: 'black',
                                  backgroundColor: 'white',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                              >
                                🎲 RANDOM
                              </button>
                              <button
                                onClick={() => {
                                  setGenerationType('cryptographic');
                                  setDropdownOpen(false);
                                }}
                                style={{ 
                                  width: '100%',
                                  padding: '16px',
                                  textAlign: 'left',
                                  fontFamily: 'monospace',
                                  color: 'black',
                                  backgroundColor: 'white',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                              >
                                🔒 CRYPTOGRAPHIC
                              </button>
                              <button
                                onClick={() => {
                                  setGenerationType('memorable');
                                  setDropdownOpen(false);
                                }}
                                style={{ 
                                  width: '100%',
                                  padding: '16px',
                                  textAlign: 'left',
                                  fontFamily: 'monospace',
                                  color: 'black',
                                  backgroundColor: 'white',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                              >
                                💭 MEMORABLE
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Password Length */}
                      {generationType !== 'memorable' && (
                        <div>
                          <label style={{ fontSize: '1.1rem', marginBottom: '10px', marginTop: '10px' }} className="block text-purple-300 mb-3 font-mono">
                            &nbsp;&nbsp;LENGTH:&nbsp;{passwordLength}&nbsp;&nbsp;
                          </label>
                          <input
                            type="range"
                            min="8"
                            max="68"
                            value={passwordLength}
                            onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      )}

                      {/* Custom Prefix for Memorable */}
                      {generationType === 'memorable' && (
                        <div>
                          <label style={{ fontSize: '1.1rem', paddingBottom: '10px', paddingTop: '10px'}} className="block text-purple-300 mb-3 font-mono">
                            &nbsp;&nbsp;CUSTOM&nbsp;PREFIX&nbsp;(OPTIONAL):&nbsp;&nbsp;
                          </label>
                          <input
                            type="text"
                            value={customPrefix}
                            onChange={(e) => setCustomPrefix(e.target.value)}
                            placeholder="e.g., MyCompany"
                            className="w-full border border-purple-500/50 rounded-md p-4 font-mono focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none resize-none black-text-textarea"
                            style={{
                              backdropFilter: 'blur(5px)', 
                              paddingBottom: '10px', 
                              paddingTop: '10px',
                              backgroundColor: 'white',
                              color: 'black'
                            }}
                          />
                        </div>
                      )}

                      {/* Character Options */}
                      {generationType !== 'memorable' && (
                        <div className="grid grid-cols-2 gap-4">
                          <label className="flex items-center space-x-2 text-purple-300 font-mono">
                            <input
                              type="checkbox"
                              checked={includeUppercase}
                              onChange={(e) => setIncludeUppercase(e.target.checked)}
                              className="rounded"
                            />
                            <span>UPPERCASE</span>
                          </label>
                          <label className="flex items-center space-x-2 text-purple-300 font-mono">
                            <input
                              type="checkbox"
                              checked={includeLowercase}
                              onChange={(e) => setIncludeLowercase(e.target.checked)}
                              className="rounded"
                            />
                            <span>LOWERCASE</span>
                          </label>
                          <label className="flex items-center space-x-2 text-purple-300 font-mono">
                            <input
                              type="checkbox"
                              checked={includeNumbers}
                              onChange={(e) => setIncludeNumbers(e.target.checked)}
                              className="rounded"
                            />
                            <span>NUMBERS</span>
                          </label>
                          <label className="flex items-center space-x-2 text-purple-300 font-mono">
                            <input
                              type="checkbox"
                              checked={includeSymbols}
                              onChange={(e) => setIncludeSymbols(e.target.checked)}
                              className="rounded"
                            />
                            <span>SYMBOLS</span>
                          </label>
                        </div>
                      )}

                      {/* Generated Password Display */}
                      {generatedPassword && !dropdownOpen && (
                        <div>
                          <label style={{ fontSize: '1.1rem', paddingBottom: '10px', paddingTop: '10px' }} className="block text-purple-300 mb-3 font-mono">
                            &nbsp;&nbsp;GENERATED&nbsp;PASSWORD:&nbsp;&nbsp;
                          </label>
                          <div className="flex space-x-2">
                            <div 
                              style={{
                                flex: '1',
                                border: '1px solid cyan',
                                borderRadius: '6px',
                                padding: '18px',
                                fontFamily: 'monospace',
                                fontSize: '16px',
                                backgroundColor: '#ffffff !important',
                                backdropFilter: 'blur(5px)',
                                height: '20px',
                                maxHeight: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                wordBreak: 'break-all',
                                userSelect: 'all',
                                cursor: 'text',
                                position: 'relative',
                                zIndex: '999',
                                overflow: 'hidden'
                              }}
                              onClick={(e) => {
                                // Select all text when clicked
                                const range = document.createRange();
                                range.selectNodeContents(e.target.firstChild);
                                const selection = window.getSelection();
                                selection.removeAllRanges();
                                selection.addRange(range);
                              }}
                            >
                              <span 
                                style={{
                                  color: '#000000 !important',
                                  WebkitTextFillColor: '#000000 !important',
                                  textShadow: 'none !important',
                                  filter: 'none !important',
                                  opacity: '1 !important',
                                }}
                              >
                                {generatedPassword}
                              </span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(generatedPassword)}
                              className="px-3 py-1 bg-purple-600 text-white font-mono font-bold rounded-md transition-all duration-300 hover:bg-purple-500"
                              style={{marginLeft: '10px', marginTop: '0px'}}
                            >
                              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-center space-x-4">
                        {!dropdownOpen && (
                          <button
                            onClick={generatePassword}
                            className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-mono font-bold rounded-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(147,51,234,0.6)]"
                            style={{
                              boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
                              marginRight: '10px'
                            }}
                          >
                            <span className="flex items-center space-x-2">
                              <RefreshCw className="h-4 w-4" />
                              <span>GENERATE</span>
                            </span>
                          </button>
                        )}

                        {generatedPassword && !dropdownOpen && (
                          <button
                            onClick={() => checkPassword(generatedPassword)}
                            className="px-8 py-3 bg-transparent border border-cyan-500 text-cyan-400 font-mono font-bold rounded-md transition-all duration-300 hover:bg-cyan-500/10 hover:scale-105"
                          >
                            <span className="flex items-center space-x-2">
                              <Search className="h-4 w-4" />
                              <span>TEST</span>
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </MotionDiv>
                )}
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

export default PasswordGeneratorAndCheckerTool;