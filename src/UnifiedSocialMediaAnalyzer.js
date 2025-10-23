import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UnifiedSocialMediaAnalyzer() {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showTestData, setShowTestData] = useState(false);
  const [serviceStatus, setServiceStatus] = useState({ instagram: null, facebook: null });
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');

  // backend API base URL
  const API_BASE_URL = 'http://localhost:5000';

  // checks service status on component mount
  useEffect(() => {
    checkServiceStatus();
  }, []);

  const checkServiceStatus = async () => {
    try {
      // checks Instagram service
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

      // checks Facebook service
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

  const runPIIAnalysisTest = async () => {
    if (!inputValue.trim()) {
      alert(`Please enter a ${selectedPlatform === 'instagram' ? 'username' : 'page URL'}`);
      return;
    }

    const currentServiceStatus = serviceStatus[selectedPlatform];
    if (!currentServiceStatus?.valid) {
      alert(`${selectedPlatform === 'instagram' ? 'Instagram' : 'Facebook'} analysis service is not available. Please check backend configuration.`);
      return;
    }

    setIsAnalyzing(true);
    setTestResults(null);

    try {
      console.log(`Starting ${selectedPlatform} analysis for ${inputValue}`);
      
      // prepares request data based on platform
      const requestData = selectedPlatform === 'instagram' 
        ? { username: inputValue }
        : { pageUrl: inputValue };
      
      // calls backend API
      const response = await axios.post(`${API_BASE_URL}/${selectedPlatform}/analyze`, requestData, {
        timeout: 120000, // 2 minute timeout for scraping
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const analysisResult = response.data;
      console.log('Analysis complete:', analysisResult);
      
      // sets results with additional timestamp
      setTestResults({
        ...analysisResult,
        analysisTimestamp: new Date().toISOString(),
        platform: selectedPlatform
      });
      
    } catch (error) {
      console.error(`${selectedPlatform} analysis error:`, error);
      
      const errorMessage = error.response?.data?.error || error.message;
      
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
      setIsAnalyzing(false);
    }
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
    if (score >= 80) return '#dc2626';
    if (score >= 60) return '#ea580c';
    if (score >= 40) return '#ca8a04';
    return '#16a34a';
  };

  const getRiskEmoji = (score) => {
    if (score >= 80) return '🚨';
    if (score >= 60) return '⚠️';
    if (score >= 40) return '🟡';
    return '✅';
  };

  const getPlatformInfo = () => {
    if (selectedPlatform === 'instagram') {
      return {
        name: 'Instagram',
        inputLabel: 'Instagram Username (without @):',
        placeholder: 'e.g., instagram, natgeo, nasa, cristiano',
        examples: ['instagram', 'natgeo', 'nasa', 'cristiano']
      };
    } else {
      return {
        name: 'Facebook',
        inputLabel: 'Facebook Page URL:',
        placeholder: 'e.g., https://www.facebook.com/facebook, facebook.com/nasa, or just "nasa"',
        examples: ['facebook.com/facebook', 'facebook.com/nasa', 'facebook.com/tesla']
      };
    }
  };

  const platformInfo = getPlatformInfo();
  const currentServiceStatus = serviceStatus[selectedPlatform];

  return (
    <div>
      {/* Back to Home Button */}
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: '#6b7280',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 1000
        }}
      >
        ← Back to Home
      </button>
      
      {/* Header */}
      <div style={{
        backgroundColor: '#1e2a38',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1>Social Media Privacy Analyzer</h1>
        <p>Real-time PII detection using secure backend analysis</p>
        
        {/* Platform Selector */}
        <div style={{ marginTop: '20px' }}>
          <label style={{ marginRight: '10px', fontSize: '16px' }}>Select Platform:</label>
          <select
            value={selectedPlatform}
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              setInputValue('');
              setTestResults(null);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '16px',
              backgroundColor: 'white',
              color: '#333'
            }}
          >
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>

        {currentServiceStatus && (
          <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '10px' }}>
            {currentServiceStatus.valid ? (
              <span style={{ color: '#22c55e' }}>✅ {platformInfo.name} Service Ready</span>
            ) : (
              <span style={{ color: '#ef4444' }}>❌ {platformInfo.name} Service Unavailable: {currentServiceStatus.error}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Configuration Panel */}
      <div style={{
        backgroundColor: '#f0f9ff',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '8px',
        border: '1px solid #0ea5e9'
      }}>
        <h3 style={{ marginTop: 0, color: '#0c4a6e' }}>
          {platformInfo.emoji} {platformInfo.name} Analysis
        </h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            {platformInfo.inputLabel}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={platformInfo.placeholder}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #0ea5e9',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <button
          onClick={runPIIAnalysisTest}
          disabled={isAnalyzing || !currentServiceStatus?.valid}
          style={{
            backgroundColor: isAnalyzing ? '#6b7280' : '#0ea5e9',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          {isAnalyzing ? '🔄 Analyzing...' : `🔍 Analyze ${platformInfo.name} ${selectedPlatform === 'instagram' ? 'Profile' : 'Page'}`}
        </button>
        
        <button
          onClick={checkServiceStatus}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Check Service Status
        </button>
      </div>

      {/* Results Section */}
      {testResults && (
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px'
        }}>
          {testResults.error ? (
            <div>
              <h3 style={{ color: '#dc2626', marginTop: 0 }}>❌ Analysis Failed</h3>
              <p style={{ color: '#dc2626', marginBottom: '20px' }}>{testResults.error}</p>
              
              {testResults.troubleshooting && (
                <div>
                  <h4 style={{ color: '#374151' }}>Troubleshooting Guide:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h5 style={{ color: '#dc2626' }}>Common Issues:</h5>
                      <ul style={{ color: '#6b7280' }}>
                        {testResults.troubleshooting.commonIssues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 style={{ color: '#16a34a' }}>Solutions:</h5>
                      <ul style={{ color: '#6b7280' }}>
                        {testResults.troubleshooting.solutions.map((solution, index) => (
                          <li key={index}>{solution}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 style={{ color: '#16a34a', marginTop: 0 }}>✅ Analysis Complete</h3>
              
              {/* Risk Score */}
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                  {getRiskEmoji(testResults.riskScore)}
                </div>
                <h2 style={{ 
                  margin: '0 0 10px 0',
                  color: getRiskColor(testResults.riskScore)
                }}>
                  Risk Score: {testResults.riskScore}/100
                </h2>
                <p style={{ 
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: getRiskColor(testResults.riskScore),
                  margin: 0
                }}>
                  {testResults.riskLevel.toUpperCase()} RISK
                </p>
              </div>

              {/* Profile Stats */}
              {testResults.profileStats && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '6px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ marginTop: 0, color: '#374151' }}>Profile Analysis Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ea5e9' }}>
                        {testResults.profileStats.postsAnalyzed}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Posts Analyzed</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ea5e9' }}>
                        {testResults.profileStats.commentsAnalyzed}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Comments Analyzed</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ea5e9' }}>
                        {testResults.totalFindings}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>PII Findings</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ea5e9' }}>
                        {Math.round(testResults.profileStats.totalTextLength / 1000)}k
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Characters Analyzed</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PII Findings */}
              {testResults.findings && testResults.findings.length > 0 && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '6px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ marginTop: 0, color: '#374151' }}>🔍 PII Findings ({testResults.findings.length})</h4>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {testResults.findings.map((finding, index) => (
                      <div key={index} style={{
                        padding: '10px',
                        marginBottom: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        backgroundColor: '#f8fafc'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                          <span style={{ fontWeight: 'bold', color: '#374151' }}>
                            {finding.type} ({finding.severity})
                          </span>
                          <span style={{
                            backgroundColor: getSeverityColor(finding.severity),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {finding.confidence}% confidence
                          </span>
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>
                          <strong>Found:</strong> "{finding.value}"
                        </div>
                        {finding.context && (
                          <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '5px' }}>
                            <strong>Context:</strong> {finding.context}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {testResults.recommendations && testResults.recommendations.length > 0 && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '6px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ marginTop: 0, color: '#374151' }}>💡 Recommendations</h4>
                  {testResults.recommendations.map((rec, index) => (
                    <div key={index} style={{
                      padding: '10px',
                      marginBottom: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      backgroundColor: '#f0f9ff'
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#0c4a6e', marginBottom: '5px' }}>
                        {rec.title}
                      </div>
                      <div style={{ color: '#374151', fontSize: '14px' }}>
                        {rec.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Raw Data Toggle */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setShowTestData(!showTestData)}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {showTestData ? 'Hide' : 'Show'} Raw Analysis Data
                </button>
              </div>

              {/* Raw Data Display */}
              {showTestData && (
                <div style={{
                  backgroundColor: '#1e2a38',
                  color: '#e2e8f0',
                  padding: '20px',
                  borderRadius: '6px',
                  marginTop: '20px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <pre>{JSON.stringify(testResults, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div style={{
        backgroundColor: '#f0fdf4',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #22c55e'
      }}>
        <h3 style={{ marginTop: 0, color: '#166534' }}>📋 How to Use</h3>
        <ol style={{ color: '#374151', lineHeight: '1.6' }}>
          <li>Select your platform (Instagram or Facebook) from the dropdown.</li>
          <li>Enter a {selectedPlatform === 'instagram' ? 'public username' : 'public page URL'}.</li>
          <li>Click "Analyze" to start the privacy analysis.</li>
          <li>Wait for the analysis to complete (may take 1-2 minutes).</li>
          <li>Review the risk score and PII findings.</li>
          <li>Follow the recommendations to improve your privacy.</li>
        </ol>
        
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#dcfce7', borderRadius: '4px' }}>
          <strong style={{ color: '#166534' }}>Examples:</strong>
          <ul style={{ margin: '5px 0', color: '#374151' }}>
            {platformInfo.examples.map((example, index) => (
              <li key={index}><code>{example}</code></li>
            ))}
          </ul>
        </div>
        
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#dcfce7', borderRadius: '4px' }}>
          <strong style={{ color: '#166534' }}>Note:</strong> This tool uses our <strong>secure backend service</strong> to analyze real social media profiles in real-time. 
          No data is stored permanently, and all analysis is performed securely on our servers.
        </div>
      </div>
    </div>
  );
}

export default UnifiedSocialMediaAnalyzer;
