import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import PhishingTrainer from './PhishingTrainer';
import UnifiedSocialMediaAnalyzer from './UnifiedSocialMediaAnalyzer';
import PasswordChecker from './passwordchecker';
import PasswordGenerator from './passwordgenerator';
import PasswordInfo from './PasswordInfo';
import PhishingInfo from './PhishingInfo';
import SocialMediaInfo from './SocialMediaInfo';
import backgroundGif from './assets/backgroundgif.gif';

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


function Home() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <h1>SecuraSphere</h1>
        <p className="subtitle">
          A Cybersecurity Awareness Platform
        </p>
      </header>

      <main className="App-main">
        <section className="intro">
          <p>
            Welcome to <strong>SecuraSphere</strong>! Explore our interactive tools and resources
            to learn about your online security and privacy. Choose a module below to get started.
          </p>
        </section>

        <section className="modules">
          <div className="card">
            <h1>🔑</h1>
            <h2>Password Checker</h2>
            <p>Test your password strength and generate secure ones.</p>
            <button onClick={() => navigate('/password-info')}>Go</button>
          </div>

          <div className="card">
            <h1>📧</h1>
            <h2>Phishing Training</h2>
            <p>Learn how to spot suspicious emails through practice.</p>
            <button onClick={() => navigate('/phishing-info')}>Go</button>
          </div>

          <div className="card">
            <h1>📱📘</h1>
            <h2>Social Media Analyzer</h2>
            <p>Analyze Instagram profiles and Facebook pages for privacy exposure.</p>
            <button onClick={() => navigate('/social-media-info')}>Go</button>
          </div>
        </section>
      </main>

      <footer className="App-footer">
        <p>Team CAWWZ | UF Senior Project | Fall 2025</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Info Pages */}
        <Route path="/password-info" element={<PasswordInfo />} />
        <Route path="/phishing-info" element={<PhishingInfo />} />
        <Route path="/social-media-info" element={<SocialMediaInfo />} />
        
        {/* Tool Pages */}
        <Route path="/phishing-trainer" element={<PhishingTrainer />} />
        <Route path="/social-media-analyzer" element={<UnifiedSocialMediaAnalyzer />} />
        <Route path="/password-generator" element={<PasswordGenerator />} />
        <Route path="/password-checker" element={<PasswordChecker />} />
      </Routes>
    </Router>
  );
}

export default App;
