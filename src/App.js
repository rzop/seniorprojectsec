import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import PhishingTrainer from './PhishingTrainer';
import PhishingTrainerTool from './PhishingTrainerTool';
import SocialMediaAnalyzerTool from './SocialMediaAnalyzerTool';
import PhishingTrainingPage from './PhishingTrainingPage';
import PasswordSecurityPage from './PasswordSecurityPage';
import SocialMediaAnalysisPage from './SocialMediaAnalysisPage';
import UnifiedSocialMediaAnalyzer from './UnifiedSocialMediaAnalyzer';
import PasswordGeneratorAndCheckerTool from './PasswordGeneratorAndCheckerTool';
import PasswordChecker from './passwordchecker';
import PasswordGenerator from './passwordgenerator';
import PasswordInfo from './PasswordInfo';
import PhishingInfo from './PhishingInfo';
import PrivacyPage from './PrivacyPage';
import SocialMediaInfo from './SocialMediaInfo';
import TermsPage from './TermsPage';
import HUDTestFixed from './HUDTestFixed';

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
          
          {/* Test Button for HUDNeon */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button 
              onClick={() => navigate('/test')}
              style={{
                background: 'linear-gradient(45deg, #22fc63ff, #07f78fff)',
                color: '#000',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              View test UI
            </button>
          </div>
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
        {/*New Home*/}
        <Route path="/test" element={<HUDTestFixed />} />

        {/*Old Home */}
        <Route path="/" element={<Home />} />
        
        {/*Old Info Pages*/}
        <Route path="/password-info" element={<PasswordInfo />} />
        <Route path="/phishing-info" element={<PhishingInfo />} />
        <Route path="/social-media-info" element={<SocialMediaInfo />} />

        {/*New Info Pages*/}
        <Route path="/passwordchecker" element={<PasswordSecurityPage />} />
        <Route path="/phishing" element={<PhishingTrainingPage />} />
        <Route path="/social" element={<SocialMediaAnalysisPage />} />
        
        {/*Old Tool Pages */}
        <Route path="/phishing-trainer" element={<PhishingTrainer />} />
        <Route path="/social-media-analyzer" element={<UnifiedSocialMediaAnalyzer />} />
        <Route path="/password-generator" element={<PasswordGenerator />} />
        <Route path="/password-checker" element={<PasswordChecker />} />

        {/*New Tool Pages*/}
        <Route path="/phishing-trainer-tool" element={<PhishingTrainerTool />} />
        <Route path="/social-media-analyzer-tool" element={<SocialMediaAnalyzerTool />} />
        <Route path="/password-generator-and-checker-tool" element={<PasswordGeneratorAndCheckerTool />} />

        {/*Footer Pages*/}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<SocialMediaAnalysisPage />} />
      </Routes>
    </Router>
  );
}

export default App;
