import React from 'react';
import { useNavigate} from 'react-router-dom';
import backgroundGif from './assets/backgroundgif.gif';

function PhishingInfo() {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundImage: `url(${backgroundGif})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      margin: 0,
      padding: 0
    }}>
      {/* Dark overlay for better text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 0
      }}></div>
      
      {/* Content container */}
      <div className="info-page" style={{ 
        position: 'relative', 
        zIndex: 1,
        marginTop: 0,
        paddingTop: 0
      }}>
        <div className="info-header">
        <button 
          onClick={() => navigate('/')} 
          className="back-button"
        >
          ← Back to Home
        </button>
        <h1>📧 Phishing Email Training</h1>
        <p>Learn to identify and avoid phishing attacks</p>
      </div>

      <div className="info-content">
        <section className="info-overview">
          <h2>Understanding Phishing Attacks</h2>
          <p>
            Phishing is a cybercrime where attackers impersonate legitimate organizations 
            to steal sensitive information like passwords, credit card numbers, or personal data.
          </p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>3.4 billion</h3>
              <p>phishing emails sent daily</p>
            </div>
            <div className="stat-card">
              <h3>83%</h3>
              <p>of organizations experienced phishing attacks</p>
            </div>
            <div className="stat-card">
              <h3>$12 billion</h3>
              <p>lost to phishing scams annually</p>
            </div>
          </div>
        </section>

        <section className="tips-section">
          <h2>🛡️ Phishing Protection Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>Check Sender Identity</h4>
              <p>Verify email addresses and be wary of urgent requests</p>
            </div>
            <div className="tip-card">
              <h4>Examine Links Carefully</h4>
              <p>Hover over links to see the actual destination before clicking</p>
            </div>
            <div className="tip-card">
              <h4>Watch for Poor Grammar</h4>
              <p>Legitimate organizations rarely send emails with spelling errors</p>
            </div>
            <div className="tip-card">
              <h4>Trust Your Instincts</h4>
              <p>If something feels suspicious, verify through official channels</p>
            </div>
          </div>
        </section>

        <section className="tools-section">
          <h2>Phishing Detection Tool</h2>
          <div className="single-tool-container">
            <div className="tool-card">
              <div className="tool-icon">📧</div>
              <h3>AI-Powered Email Analyzer</h3>
              <p>
                Our advanced phishing detection tool uses machine learning to analyze 
                email content and identify potential phishing attempts.
              </p>
              <ul>
                <li>Real-time analysis of email content and structure</li>
                <li>Detection of common phishing tactics and patterns</li>
                <li>Educational feedback on suspicious elements</li>
                <li>Safe testing environment for learning</li>
                <li>Completely private - emails are analyzed locally</li>
              </ul>
              <button 
                className="tool-button primary large"
                onClick={() => navigate('/phishing-trainer')}
              >
                Analyze Email for Phishing
              </button>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
};

export default PhishingInfo;