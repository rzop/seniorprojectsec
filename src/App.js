import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import PhishingTrainer from './PhishingTrainer';
import UnifiedSocialMediaAnalyzer from './UnifiedSocialMediaAnalyzer';
import PasswordChecker from './passwordchecker';
import PasswordGenerator from './passwordgenerator';

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
            <button onClick={() => navigate('/password-checker')}>Go</button>
          </div>

          <div className="card">
            <h1>📧</h1>
            <h2>Phishing Training</h2>
            <p>Learn how to spot suspicious emails through practice.</p>
            <button onClick={() => navigate('/phishing-trainer')}>Go</button>
          </div>

          <div className="card">
            <h1>📱📘</h1>
            <h2>Social Media Analyzer</h2>
            <p>Analyze Instagram profiles and Facebook pages for privacy exposure.</p>
            <button onClick={() => navigate('/social-media-analyzer')}>Go</button>
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/phishing-trainer" element={<PhishingTrainer />} />
        <Route path="/social-media-analyzer" element={<UnifiedSocialMediaAnalyzer />} />
	      <Route path="/password-generator" element={<PasswordGenerator />} />
        <Route path="/password-checker" element={<PasswordChecker />} />
      </Routes>
    </Router>
  );
}

export default App;
