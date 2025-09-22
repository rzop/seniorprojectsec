import React from 'react';
import SocialMediaAnalyzer from './smea';

function TestSMEA() {
  return (
    <div>
      <div style={{
        backgroundColor: '#1e2a38',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1>SecuraSphere - Social Media Analyzer Test</h1>
        <p>Testing PII detection capabilities with sample data</p>
      </div>
      
      <SocialMediaAnalyzer />
      
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        marginTop: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3> Test Instructions</h3>
        <ol>
          <li>The component will automatically run PII analysis on sample data when loaded</li>
          <li>Click "Run PII Analysis Test" to re-run the analysis</li>
          <li>Check the browser console for detailed analysis results</li>
          <li>Review the findings, risk score, and recommendations displayed</li>
          <li>Expand "View Sample Test Data" to see what data was analyzed</li>
        </ol>
        
        <h4>🔍 What the Test Detects</h4>
        <ul>
          <li><strong>High Risk:</strong> Email addresses, phone numbers, SSN, credit card numbers</li>
          <li><strong>Medium Risk:</strong> Street addresses, birth dates, names, locations</li>
          <li><strong>Low Risk:</strong> Age information, sensitive keywords</li>
        </ul>
        
        <h4>📊 Expected Results</h4>
        <p>The sample data contains intentionally problematic content including:</p>
        <ul>
          <li>Email and phone number in bio</li>
          <li>Full address and birth date in posts</li>
          <li>SSN and credit card numbers (fake)</li>
          <li>Sensitive personal information in comments</li>
        </ul>
        <p><strong>Expected Risk Score:</strong> High (80-100) due to multiple high-severity findings</p>
      </div>
    </div>
  );
}

export default TestSMEA;
