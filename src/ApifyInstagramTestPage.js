import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ApifyInstagramTestPage() {
  const [testResults, setTestResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [username, setUsername] = useState('');
  const [showTestData, setShowTestData] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(null);

  // backend API base URL
  const API_BASE_URL = 'http://localhost:5000';

  // checks service status on component mount
  useEffect(() => {
    checkServiceStatus();
  }, []);

  const checkServiceStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/instagram/validate`);
      setServiceStatus({ valid: true, message: response.data.message });
    } catch (error) {
      setServiceStatus({ 
        valid: false, 
        error: error.response?.data?.error || 'Service unavailable' 
      });
    }
  };

  const runPIIAnalysisTest = async () => {
    if (!username.trim()) {
      alert('Please enter an Instagram username');
      return;
    }

    if (!serviceStatus?.valid) {
      alert('Instagram analysis service is not available. Please check backend configuration.');
      return;
    }

    setIsAnalyzing(true);
    setTestResults(null);

    try {
      console.log(`Starting Instagram analysis for @${username}`);
      
      // calls backend API
      const response = await axios.post(`${API_BASE_URL}/instagram/analyze`, {
        username: username
      }, {
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
        analysisTimestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Instagram analysis error:', error);
      
      const errorMessage = error.response?.data?.error || error.message;
      
      setTestResults({ 
        error: errorMessage,
        troubleshooting: {
          commonIssues: [
            'Username does not exist or profile is private',
            'Backend service is not running',
            'Apify token not configured on server',
            'Instagram temporarily blocked the scraper',
            'Network connectivity issues'
          ],
          solutions: [
            'Verify the username exists and is public',
            'Ensure the backend server is running on port 5000',
            'Check that APIFY_TOKEN is set in backend environment',
            'Try again in a few minutes',
            'Test with a different username'
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

  return (
    <div>
      {/* Header */}
      <div style={{
        backgroundColor: '#1e2a38',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1>SecuraSphere - Instagram Privacy Analyzer</h1>
        <p>Real-time PII detection using secure backend analysis</p>
        {serviceStatus && (
          <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '10px' }}>
            {serviceStatus.valid ? (
              <span style={{ color: '#22c55e' }}>✅ Service Ready</span>
            ) : (
              <span style={{ color: '#ef4444' }}>❌ Service Unavailable: {serviceStatus.error}</span>
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
        <h3 style={{ margin: '0 0 15px 0', color: '#0c4a6e' }}>⚙️ Configuration</h3>
        
        <div style={{ display: 'grid', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Instagram Username (without @):
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., instagram, natgeo, nasa, cristiano"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              Note: Only public profiles can be analyzed. Analysis is powered by our secure backend.
            </small>
          </div>
        </div>

        <button 
          onClick={runPIIAnalysisTest} 
          disabled={isAnalyzing || !username.trim() || !serviceStatus?.valid}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: isAnalyzing || !serviceStatus?.valid ? '#9ca3af' : '#0ea5e9',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isAnalyzing || !serviceStatus?.valid ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isAnalyzing ? 'Analyzing... (30-60 seconds)' : 'Run Privacy Analysis'}
        </button>
      </div>

      {/* Results */}
      {testResults && (
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          {testResults.error ? (
            <div style={{ color: '#dc2626' }}>
              <h3>Analysis Failed</h3>
              <p style={{ marginBottom: '15px' }}><strong>Error:</strong> {testResults.error}</p>
              
              {testResults.troubleshooting && (
                <details style={{ marginTop: '15px' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    🔧 Troubleshooting Guide
                  </summary>
                  <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fef2f2', borderRadius: '4px' }}>
                    <h4>Common Issues:</h4>
                    <ul>
                      {testResults.troubleshooting.commonIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                    <h4>Solutions:</h4>
                    <ul>
                      {testResults.troubleshooting.solutions.map((solution, index) => (
                        <li key={index}>{solution}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              )}
            </div>
          ) : (
            <>
              {/* Profile Overview */}
              <div style={{ 
                marginBottom: '20px', 
                padding: '20px', 
                backgroundColor: 'white', 
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📱 Profile Analysis Overview
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '15px' 
                }}>
                  <div>
                    <strong>Username:</strong> @{testResults.userData.user.username}
                  </div>
                  <div>
                    <strong>Display Name:</strong> {testResults.userData.user.name || 'Not provided'}
                  </div>
                  <div>
                    <strong>Posts Analyzed:</strong> {testResults.profileStats.postsAnalyzed}
                  </div>
                  <div>
                    <strong>Followers:</strong> {testResults.userData.user.followersCount?.toLocaleString() || 'N/A'}
                  </div>
                  <div>
                    <strong>Total Content:</strong> {testResults.profileStats.totalTextLength} characters
                  </div>
                  <div>
                    <strong>Analysis Time:</strong> {new Date(testResults.analysisTimestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                {testResults.userData.biography && (
                  <div style={{ 
                    marginTop: '15px', 
                    padding: '10px', 
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px',
                    borderLeft: '4px solid #6366f1'
                  }}>
                    <strong>Biography:</strong> "{testResults.userData.biography}"
                  </div>
                )}
              </div>

              {/* Risk Assessment */}
              <div style={{ 
                marginBottom: '20px', 
                padding: '20px', 
                backgroundColor: 'white',
                borderRadius: '8px',
                border: `3px solid ${getRiskColor(testResults.riskScore)}`
              }}>
                <h3 style={{ 
                  margin: '0 0 15px 0', 
                  color: getRiskColor(testResults.riskScore),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {getRiskEmoji(testResults.riskScore)} Privacy Risk Assessment
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: getRiskColor(testResults.riskScore) }}>
                      {testResults.riskScore}/100
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {testResults.riskLevel.toUpperCase()} RISK
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                      {testResults.totalFindings}
                    </div>
                    <div>Privacy Issues Found</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '18px' }}>
                      🚨 {testResults.severityBreakdown.high} High
                    </div>
                    <div style={{ fontSize: '18px' }}>
                      ⚠️ {testResults.severityBreakdown.medium} Medium
                    </div>
                    <div style={{ fontSize: '18px' }}>
                      🟡 {testResults.severityBreakdown.low} Low
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Findings */}
              {testResults.findings.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '15px' }}>🔍 Detailed PII Findings</h3>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {testResults.findings.slice(0, 15).map((finding, index) => (
                      <div key={index} style={{
                        padding: '12px',
                        margin: '8px 0',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        borderLeft: `4px solid ${getSeverityColor(finding.severity)}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {finding.type.toUpperCase()}
                          </div>
                          <div style={{ 
                            fontSize: '12px',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: getSeverityColor(finding.severity),
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            {finding.severity.toUpperCase()}
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                          <strong>Location:</strong> {finding.location}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          <strong>Context:</strong> "{finding.context?.substring(0, 100)}..."
                        </div>
                      </div>
                    ))}
                    {testResults.findings.length > 15 && (
                      <div style={{ textAlign: 'center', padding: '10px', color: '#6b7280' }}>
                        ... and {testResults.findings.length - 15} more findings
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '15px' }}>💡 Privacy Recommendations</h3>
                {testResults.recommendations.map((rec, index) => (
                  <div key={index} style={{
                    padding: '15px',
                    margin: '10px 0',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${
                      rec.priority === 'high' ? '#dc2626' : 
                      rec.priority === 'medium' ? '#ea580c' : '#16a34a'
                    }`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {rec.priority === 'high' ? '🚨' : rec.priority === 'medium' ? '⚠️' : '💡'} 
                      {rec.title}
                    </div>
                    <div style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                      {rec.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Data Viewer */}
              <div style={{ marginBottom: '20px' }}>
                <button 
                  onClick={() => setShowTestData(!showTestData)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginBottom: '10px'
                  }}
                >
                  {showTestData ? 'Hide' : 'View'} Analyzed Content
                </button>
                
                {showTestData && (
                  <div style={{ 
                    backgroundColor: '#1f2937', 
                    color: '#f9fafb',
                    padding: '15px', 
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    <h4>📝 Biography:</h4>
                    <pre style={{ whiteSpace: 'pre-wrap', marginBottom: '10px' }}>
                      {testResults.textContent.bio || 'No biography available'}
                    </pre>
                    
                    <h4>📸 Posts ({testResults.textContent.posts.length}):</h4>
                    {testResults.textContent.posts.slice(0, 5).map((post, index) => (
                      <div key={index} style={{ marginBottom: '8px', paddingLeft: '10px', borderLeft: '2px solid #6b7280' }}>
                        <strong>Post {index + 1}:</strong> {post || 'No caption'}
                      </div>
                    ))}
                    {testResults.textContent.posts.length > 5 && (
                      <div style={{ color: '#9ca3af' }}>... and {testResults.textContent.posts.length - 5} more posts</div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Instructions */}
      <div style={{
        backgroundColor: '#f0fdf4',
        padding: '20px',
        marginTop: '20px',
        borderRadius: '8px',
        border: '1px solid #22c55e'
      }}>
        <h3 style={{ color: '#15803d' }}>How to Use</h3>
        <ol style={{ color: '#166534' }}>
          <li>Enter a public Instagram username (try: instagram, natgeo, nasa, cristiano)</li>
          <li>Click "Run Privacy Analysis" and wait 30-60 seconds</li>
          <li>Review the comprehensive privacy analysis results</li>
          <li>Check browser console for detailed technical logs</li>
          <li>Expand "View Analyzed Content" to see scraped data</li>
        </ol>
        
        <h4 style={{ color: '#15803d' }}>What This Analyzes</h4>
        <ul style={{ color: '#166534' }}>
          <li><strong>High Risk:</strong> Email addresses, phone numbers, SSN, credit cards, addresses</li>
          <li><strong>Medium Risk:</strong> Birth dates, full names, locations, personal details</li>
          <li><strong>Low Risk:</strong> Age mentions, sensitive keywords, personal patterns</li>
        </ul>
        
        <h4 style={{ color: '#15803d' }}>Secure Backend Analysis</h4>
        <p style={{ color: '#166534' }}>
          This tool uses our <strong>secure backend service</strong> to analyze real Instagram profiles in real-time. 
          No API tokens required from users - all analysis is handled server-side with enterprise-grade security. 
          The analysis includes profile bio, recent posts, and generates personalized privacy recommendations.
        </p>
      </div>
    </div>
  );
}

export default ApifyInstagramTestPage;
