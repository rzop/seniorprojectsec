import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundGif from './assets/backgroundgif.gif';

function PasswordInfo() {
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
        <h1>🔑 Password Security Tools</h1>
        <p>Strengthen your digital security with our password tools</p>
      </div>

      <div className="info-content">
        <section className="info-overview">
          <h2>Why Password Security Matters</h2>
          <p>
            Strong passwords are your first line of defense against cyber attacks. 
            Weak passwords can lead to identity theft, financial loss, and privacy breaches.
          </p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>81%</h3>
              <p>of data breaches are due to weak passwords</p>
            </div>
            <div className="stat-card">
              <h3>2.9 billion</h3>
              <p>passwords were exposed in 2023</p>
            </div>
            <div className="stat-card">
              <h3>23.2 million</h3>
              <p>accounts use "123456" as password</p>
            </div>
          </div>
        </section>

        <section className="tips-section">
          <h2>🛡️ Password Best Practices</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>Use Unique Passwords</h4>
              <p>Never reuse passwords across multiple accounts</p>
            </div>
            <div className="tip-card">
              <h4>Enable 2FA</h4>
              <p>Add an extra layer of security with two-factor authentication</p>
            </div>
            <div className="tip-card">
              <h4>Use a Password Manager</h4>
              <p>Let technology help you manage complex, unique passwords</p>
            </div>
            <div className="tip-card">
              <h4>Regular Updates</h4>
              <p>Change passwords if you suspect they've been compromised</p>
            </div>
          </div>
        </section>

        <section className="tools-section">
          <h2>Password Security Tool</h2>
          <div className="single-tool-container">
            <div className="tool-card">
              <div className="tool-icon">�</div>
              <h3>Password Security Center</h3>
              <p>
                A comprehensive password security tool that combines password checking 
                against known breaches with secure password generation capabilities.
              </p>
              <ul>
                <li>Check passwords against 500+ million compromised passwords</li>
                <li>Generate cryptographically secure passwords</li>
                <li>Real-time strength analysis and recommendations</li>
                <li>Customizable password generation options</li>
                <li>Completely private - data never leaves your device</li>
              </ul>
              <button 
                className="tool-button primary large"
                onClick={() => navigate('/password-checker')}
              >
                Access Password Tools
              </button>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
};

export default PasswordInfo;