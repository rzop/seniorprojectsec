import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

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
        timeout: 180000, // 3 minute timeout for scraping 50 posts
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
    <div className="App">
      {/* Back to Home Button */}
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
      >
        ← Back to Home
      </button>
      
      {/* Main Content Container */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'rgba(30, 42, 56, 0.95)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: '40px 30px',
          textAlign: 'center',
          marginBottom: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.2rem', fontWeight: '700' }}>
            Social Media Privacy Analyzer
          </h1>
          <p style={{ margin: '0 0 25px 0', fontSize: '1.05rem', opacity: 0.9 }}>
            Real-time PII detection using secure backend analysis
          </p>
          
          {/* Platform Selector */}
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <label style={{ 
              marginRight: '12px', 
              fontSize: '16px',
              fontWeight: '500'
            }}>
              Select Platform:
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => {
                setSelectedPlatform(e.target.value);
                setInputValue('');
                setTestResults(null);
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '15px',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <option value="instagram">📷 Instagram</option>
              <option value="facebook">📘 Facebook</option>
            </select>
          </div>

          {currentServiceStatus && (
            <div style={{ 
              fontSize: '14px', 
              marginTop: '15px',
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: currentServiceStatus.valid ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              display: 'inline-block'
            }}>
              {currentServiceStatus.valid ? (
                <span style={{ color: '#22c55e', fontWeight: '500' }}>
                  ✅ {platformInfo.name} Service Ready
                </span>
              ) : (
                <span style={{ color: '#ef4444', fontWeight: '500' }}>
                  ❌ {platformInfo.name} Service Unavailable
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Configuration Panel */}
        <div style={{
          backgroundColor: 'rgba(240, 249, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '35px 30px',
          marginBottom: '30px',
          borderRadius: '12px',
          border: 'none',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: '25px',
            color: '#0c4a6e',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}>
            🔍 {platformInfo.name} Analysis
          </h3>
          
          <div style={{ 
            marginBottom: '25px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontWeight: '600',
              textAlign: 'center',
              color: '#0c4a6e',
              fontSize: '15px'
            }}>
              {platformInfo.inputLabel}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={platformInfo.placeholder}
              style={{
                width: '100%',
                maxWidth: '600px',
                padding: '14px 18px',
                border: '2px solid #0ea5e9',
                borderRadius: '10px',
                fontSize: '15px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.2)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={runPIIAnalysisTest}
              disabled={isAnalyzing || !currentServiceStatus?.valid}
              style={{
                backgroundColor: isAnalyzing ? '#9ca3af' : '#0ea5e9',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '10px',
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: isAnalyzing ? 'none' : '0 4px 12px rgba(14, 165, 233, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isAnalyzing && currentServiceStatus?.valid) {
                  e.target.style.backgroundColor = '#0284c7';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isAnalyzing && currentServiceStatus?.valid) {
                  e.target.style.backgroundColor = '#0ea5e9';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {isAnalyzing ? '🔄 Analyzing...' : `🔍 Analyze ${platformInfo.name}`}
            </button>
            
            <button
              onClick={checkServiceStatus}
              style={{
                backgroundColor: 'rgba(107, 114, 128, 0.9)',
                color: 'white',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#6b7280';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.9)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🔄 Refresh Status
            </button>
          </div>
        </div>

        {/* Results Section */}
        {testResults && (
          <div style={{
            backgroundColor: 'rgba(248, 250, 252, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '30px',
            borderRadius: '12px',
            border: 'none',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            {testResults.error ? (
              <div>
                <h3 style={{ 
                  color: '#dc2626', 
                  marginTop: 0,
                  fontSize: '1.4rem',
                  fontWeight: '600'
                }}>
                  ❌ Analysis Failed
                </h3>
                <p style={{ 
                  color: '#dc2626', 
                  marginBottom: '25px',
                  fontSize: '15px'
                }}>
                  {testResults.error}
                </p>
              
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
                <h3 style={{ 
                  color: '#16a34a', 
                  marginTop: 0,
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '25px'
                }}>
                  ✅ Analysis Complete
                </h3>
                
                {/* Risk Score */}
                <div style={{
                  backgroundColor: 'white',
                  padding: '35px',
                  borderRadius: '12px',
                  border: 'none',
                  marginBottom: '25px',
                  textAlign: 'center',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{ fontSize: '56px', marginBottom: '15px' }}>
                    {getRiskEmoji(testResults.riskScore)}
                  </div>
                  <h2 style={{ 
                    margin: '0 0 12px 0',
                    color: getRiskColor(testResults.riskScore),
                    fontSize: '2rem',
                    fontWeight: '700'
                  }}>
                    Risk Score: {testResults.riskScore}/100
                  </h2>
                  <p style={{ 
                    fontSize: '18px',
                    fontWeight: '600',
                    color: getRiskColor(testResults.riskScore),
                    margin: 0,
                    padding: '8px 20px',
                    borderRadius: '20px',
                    backgroundColor: `${getRiskColor(testResults.riskScore)}15`,
                    display: 'inline-block'
                  }}>
                    {testResults.riskLevel.toUpperCase()} RISK
                  </p>
                </div>

                {/* Profile Stats */}
                {testResults.profileStats && (
                  <div style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    marginBottom: '25px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
                  }}>
                    <h4 style={{ 
                      marginTop: 0, 
                      marginBottom: '20px',
                      color: '#374151',
                      fontSize: '1.15rem',
                      fontWeight: '600'
                    }}>
                      📊 Profile Analysis Summary
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                      gap: '20px' 
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '28px', 
                          fontWeight: '700', 
                          color: '#0ea5e9',
                          marginBottom: '6px'
                        }}>
                          {testResults.profileStats.postsAnalyzed}
                        </div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          fontWeight: '500'
                        }}>
                          Posts Analyzed
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '28px', 
                          fontWeight: '700', 
                          color: '#0ea5e9',
                          marginBottom: '6px'
                        }}>
                          {testResults.profileStats.commentsAnalyzed}
                        </div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          fontWeight: '500'
                        }}>
                          Comments Analyzed
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '28px', 
                          fontWeight: '700', 
                          color: '#0ea5e9',
                          marginBottom: '6px'
                        }}>
                          {testResults.totalFindings}
                        </div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          fontWeight: '500'
                        }}>
                          PII Findings
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '28px', 
                          fontWeight: '700', 
                          color: '#0ea5e9',
                          marginBottom: '6px'
                        }}>
                          {Math.round(testResults.profileStats.totalTextLength / 1000)}k
                        </div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          fontWeight: '500'
                        }}>
                          Characters Analyzed
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PII Findings */}
                {testResults.findings && testResults.findings.length > 0 && (
                  <div style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    marginBottom: '25px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
                  }}>
                    <h4 style={{ 
                      marginTop: 0, 
                      marginBottom: '20px',
                      color: '#374151',
                      fontSize: '1.15rem',
                      fontWeight: '600'
                    }}>
                      🔍 PII Findings ({testResults.findings.length})
                    </h4>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                      {testResults.findings.map((finding, index) => (
                        <div key={index} style={{
                          padding: '16px',
                          marginBottom: '12px',
                          border: 'none',
                          borderRadius: '10px',
                          backgroundColor: '#f8fafc',
                          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '10px',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}>
                            <span style={{ 
                              fontWeight: '600', 
                              color: '#374151',
                              fontSize: '14px'
                            }}>
                              {finding.type}
                            </span>
                            <span style={{
                              backgroundColor: getSeverityColor(finding.severity),
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '15px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {finding.confidence}% confidence
                            </span>
                          </div>
                          <div style={{ 
                            color: '#6b7280', 
                            fontSize: '14px',
                            marginBottom: '8px'
                          }}>
                            <strong style={{ color: '#374151' }}>Found:</strong> "{finding.value}"
                          </div>
                          {finding.context && (
                            <div style={{ 
                              color: '#6b7280', 
                              fontSize: '13px',
                              fontStyle: 'italic'
                            }}>
                              <strong style={{ color: '#374151', fontStyle: 'normal' }}>Context:</strong> {finding.context}
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
                    padding: '25px',
                    borderRadius: '12px',
                    marginBottom: '25px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
                  }}>
                    <h4 style={{ 
                      marginTop: 0, 
                      marginBottom: '20px',
                      color: '#374151',
                      fontSize: '1.15rem',
                      fontWeight: '600'
                    }}>
                      💡 Recommendations
                    </h4>
                    {testResults.recommendations.map((rec, index) => (
                      <div key={index} style={{
                        padding: '16px',
                        marginBottom: '12px',
                        border: 'none',
                        borderRadius: '10px',
                        backgroundColor: '#f0f9ff',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div style={{ 
                          fontWeight: '600', 
                          color: '#0c4a6e', 
                          marginBottom: '8px',
                          fontSize: '14px'
                        }}>
                          {rec.title}
                        </div>
                        <div style={{ 
                          color: '#374151', 
                          fontSize: '14px',
                          lineHeight: '1.6'
                        }}>
                          {rec.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Raw Data Toggle */}
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <button
                    onClick={() => setShowTestData(!showTestData)}
                    style={{
                      backgroundColor: 'rgba(107, 114, 128, 0.9)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#6b7280';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.9)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {showTestData ? '👁️ Hide' : '👁️ Show'} Raw Analysis Data
                  </button>
                </div>

                {/* Raw Data Display */}
                {showTestData && (
                  <div style={{
                    backgroundColor: '#1e2a38',
                    color: '#e2e8f0',
                    padding: '25px',
                    borderRadius: '12px',
                    marginTop: '20px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                  }}>
                    <pre style={{ margin: 0 }}>{JSON.stringify(testResults, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div style={{
          backgroundColor: 'rgba(240, 253, 244, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '30px',
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: '20px',
            color: '#166534',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}>
            📋 How to Use
          </h3>
          <ol style={{ 
            color: '#374151', 
            lineHeight: '1.8',
            paddingLeft: '20px',
            margin: '0 0 20px 0'
          }}>
            <li>Select your platform (Instagram or Facebook) from the dropdown</li>
            <li>Enter a {selectedPlatform === 'instagram' ? 'public username' : 'public page URL'}</li>
            <li>Click "Analyze" to start the privacy analysis</li>
            <li>Wait for the analysis to complete (typically less than a minute)</li>
            <li>Review the risk score and PII findings</li>
            <li>Follow the recommendations to improve your privacy</li>
          </ol>
          
          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            backgroundColor: 'rgba(220, 252, 231, 0.6)', 
            borderRadius: '10px',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <strong style={{ color: '#166534', fontSize: '14px' }}>💡 Examples:</strong>
            <ul style={{ 
              margin: '10px 0 0 0', 
              color: '#374151',
              paddingLeft: '20px',
              lineHeight: '1.8'
            }}>
              {platformInfo.examples.map((example, index) => (
                <li key={index}>
                  <code style={{ 
                    backgroundColor: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }}>
                    {example}
                  </code>
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ 
            marginTop: '16px', 
            padding: '16px', 
            backgroundColor: 'rgba(220, 252, 231, 0.6)', 
            borderRadius: '10px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            fontSize: '14px',
            lineHeight: '1.7'
          }}>
            <strong style={{ color: '#166534' }}>🔒 Privacy Note:</strong>
            <span style={{ color: '#374151' }}> This tool uses our <strong>secure backend service</strong> to analyze real social media profiles in real-time. 
            No data is stored permanently, and all analysis is performed securely on our servers.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnifiedSocialMediaAnalyzer;
