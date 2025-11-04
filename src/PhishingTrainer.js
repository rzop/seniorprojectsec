import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import normalBackground from './assets/backgroundgif.gif';
import phishingBg from './assets/cybersecurityRed.gif';
import safeBg from './assets/lock-green.gif';



const PhishingTrainer = () => {
  const navigate = useNavigate();
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    return label === 'phishing' ? '#e74c3c' : '#27ae60';
  };

  const getResultIcon = (label) => {
    return label === 'phishing' ? '⚠️' : '✅';
  };

  const getBackgroundStyle = () => {
  const baseStyle = {
    height: '100vh',             // full viewport height
    width: '100vw',              // full viewport width
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'background 0.5s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflowY: 'auto',           // so content can scroll if needed
  };

  if (result && result.label === 'phishing') {
    return { ...baseStyle, backgroundImage: `url(${phishingBg})` };
  } else if (result && result.label === 'legit') {
    return { ...baseStyle, backgroundImage: `url(${safeBg})` };
  } else {
    return { ...baseStyle, backgroundImage: `url(${normalBackground})` };
  }
};


  return (
    <div className="phishing-trainer" style={getBackgroundStyle()}>
      <div className="trainer-header">
        <button 
          onClick={() => navigate('/')} 
          className="back-button"
          style={{ float: 'left', marginBottom: '1rem' }}
        >
          ← Back to Home
        </button>
        <h1>📧 Phishing Email Detector</h1>
        <p>Enter email content below to check if it might be a phishing attempt</p>
      </div>

      <div className="trainer-content">
        <div className="input-section">
          <label htmlFor="email-text">Email Content:</label>
          <textarea
            id="email-text"
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste the email content here..."
            rows={8}
            disabled={loading}
          />
          
          <div className="button-group">
            <button 
              onClick={analyzeEmail} 
              disabled={loading || !emailText.trim()}
              className="analyze-btn"
            >
              {loading ? 'Analyzing...' : 'Analyze Email'}
            </button>
            
            <button 
              onClick={clearAnalysis}
              className="clear-btn"
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {result && (
          <div className="result-section">
            <div className="result-card">
              <div className="result-header">
                <span className="result-icon">
                  {getResultIcon(result.label)}
                </span>
                <h3>Analysis Result</h3>
              </div>
              
              <div className="result-content">
                <div className="result-label" style={{ color: getResultColor(result.label) }}>
                  <strong>
                    {result.label === 'phishing' ? 'SUSPICIOUS - Possible Phishing' : 'LEGITIMATE - Appears Safe'}
                  </strong>
                </div>
                
                <div className="result-details">
                  <p><strong>Prediction:</strong> {result.label}</p>
                  <p><strong>Confidence Score:</strong> {result.prediction}</p>
                </div>

                {result.label === 'phishing' && (
                  <div className="warning-tips">
                    <h4>⚠️ Red Flags to Watch For:</h4>
                    <ul>
                      <li>Urgent language or threats</li>
                      <li>Suspicious sender addresses</li>
                      <li>Requests for personal information</li>
                      <li>Unexpected attachments or links</li>
                      <li>Generic greetings</li>
                    </ul>
                  </div>
                )}

                {result.label === 'legit' && (
                  <div className="safety-tips">
                    <h4>✅ This email appears legitimate, but always:</h4>
                    <ul>
                      <li>Verify sender identity if unexpected</li>
                      <li>Be cautious with links and attachments</li>
                      <li>Trust your instincts</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="info-section">
          <div className="info-card">
            <h3>🎯 How This Works</h3>
            <p>
              Our AI model has been trained on thousands of emails to identify common 
              phishing patterns. It analyzes the language, structure, and content of 
              your email to provide a prediction.
            </p>
            <p>
              <strong>Remember:</strong> This is a learning tool. Always use your best 
              judgment and consult with IT security if you're unsure about an email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhishingTrainer;