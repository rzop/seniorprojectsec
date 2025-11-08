import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundGif from './assets/backgroundgif.gif';

function SocialMediaInfo() {
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
        <h1>📱 Social Media Privacy Tools</h1>
        <p>Protect your personal information on social platforms</p>
      </div>

      <div className="info-content">
        <section className="info-overview">
          <h2>Why Social Media Privacy Matters</h2>
          <p>
            Social media platforms can reveal more personal information than you realize. 
            This data can be used for identity theft, social engineering attacks, or unwanted targeting.
          </p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>2.9 billion</h3>
              <p>people use social media worldwide</p>
            </div>
            <div className="stat-card">
              <h3>79%</h3>
              <p>share personal information online</p>
            </div>
            <div className="stat-card">
              <h3>86%</h3>
              <p>of data breaches involve personal data</p>
            </div>
          </div>
        </section>

        <section className="tips-section">
          <h2>🛡️ Privacy Protection Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>Review Privacy Settings</h4>
              <p>Regularly check and update your privacy settings on all platforms</p>
            </div>
            <div className="tip-card">
              <h4>Limit Personal Information</h4>
              <p>Avoid sharing sensitive details like location, phone numbers, or addresses</p>
            </div>
            <div className="tip-card">
              <h4>Be Selective with Connections</h4>
              <p>Only connect with people you know and trust in real life</p>
            </div>
            <div className="tip-card">
              <h4>Think Before Posting</h4>
              <p>Consider how your posts might be used by malicious actors</p>
            </div>
          </div>
        </section>

        <section className="tools-section">
          <h2>Social Media Privacy Tool</h2>
          <div className="single-tool-container">
            <div className="tool-card">
              <div className="tool-icon">📱</div>
              <h3>Privacy Analyzer</h3>
              <p>
                Analyze your social media profiles to identify potential privacy risks 
                and get personalized recommendations for better security.
              </p>
              <ul>
                <li>Scan for exposed personal information</li>
                <li>Identify potential security risks</li>
                <li>Get personalized privacy recommendations</li>
                <li>Learn about social engineering tactics</li>
                <li>Completely private - analysis happens locally</li>
              </ul>
              <button 
                className="tool-button primary large"
                onClick={() => navigate('/social-media-analyzer')}
              >
                Analyze Social Media Privacy
              </button>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
};

export default SocialMediaInfo;