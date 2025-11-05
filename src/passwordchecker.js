import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

//Top 10 common password and NIST guideline is according to protonpass.
function PasswordChecker() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [lengthWarning, setLengthWarning] = useState(null);
 
  const TOP_10_COMMON_PASSWORDS = [
    '123456',
    '123456789',
    '12345678',
    'password',
    'qwerty123',
    'qwerty1',
    '111111',
    '12345',
    'secret',
    '123123'
  ];
  
  const sha1 = async (message) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
  };
  
  const checkPasswordLength = (pwd) => {
    if (pwd.length < 8) {
      setLengthWarning('Password must be at least 8 characters (NIST requirement)');
    }
    else if (pwd.length >= 8 && pwd.length < 15) {
      setLengthWarning('Meets minimum but NIST recommends 15+ characters for better security');
    }
    else {
      setLengthWarning('Great! Password length meets NIST recommendations');
    }
  };
  
  const checkPassword = async () => {
    if (!password) return;
    
    checkPasswordLength(password);
    
    if (TOP_10_COMMON_PASSWORDS.includes(password.toLowerCase())) {
      setResult('WARNING: This is one of the top 10 most common passwords. Never use this password!');
      setIsChecking(false);
      return;
    }
    
    setIsChecking(true);
    setResult(null);
    
    try {
      const hash = await sha1(password);
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5);
      
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await response.text();
      
      const lines = text.split('\n');
      const match = lines.find(line => {
        const [hashSuffix] = line.split(':');
        return hashSuffix === suffix;
      });
      
      if (match) {
        const count = match.split(':')[1].trim();
        setResult(`Password found in ${parseInt(count).toLocaleString()} data breaches! Do not use this password.`);
      } 
      else {
        setResult('Good news! Password not found in known data breaches.');
      }
    } 
    catch (error) {
      console.error('Error:', error);
      setResult('Error checking password. Please try again.');
    } 
    finally {
      setIsChecking(false);
    }
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <button 
          onClick={() => navigate('/')} 
          className="back-button"
          style={{ float: 'left', marginBottom: '1rem' }}
        >
          ← Back to Home
        </button>
        <h1>Password Breach Checker</h1>
        <p className="subtitle">
          Check if your password has been compromised in a data breach
        </p>
      </header>
      <main className="App-main">
        <div style={{
          background: '#f5f5f5',
          padding: '2rem',
          borderRadius: '12px',
          margin: '2rem 0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderTop: '4px solid #1e2a38',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: '0 0 1.5rem 0', 
            color: '#1e2a38'
          }}>
            Password Security Check
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to check"
              disabled={isChecking}
              style={{
                width: '300px',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                marginBottom: '1rem',
                textAlign: 'center'
              }}
            />
            <br />
            <button 
              onClick={checkPassword} 
              disabled={isChecking || !password}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                backgroundColor: isChecking || !password ? '#bdc3c7' : '#1e2a38',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isChecking || !password ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              {isChecking ? 'Checking...' : 'Check Password'}
            </button>
          </div>
          
          {(result || lengthWarning) && (
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              marginTop: '1rem'
            }}>
              {result && (
                <p style={{
                  margin: '0 0 1rem 0',
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: result.includes('WARNING') || result.includes('found in') ? '#ffe6e6' : '#e6ffe6',
                  color: result.includes('WARNING') || result.includes('found in') ? '#c82333' : '#27ae60',
                  fontWeight: 'bold',
                  border: `2px solid ${result.includes('WARNING') || result.includes('found in') ? '#ffcccc' : '#ccffcc'}`
                }}>
                  {result}
                </p>
              )}
              {lengthWarning && (
                <p style={{
                  margin: '0',
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: '#fff3cd',
                  color: '#856404',
                  fontWeight: 'bold',
                  border: '2px solid #ffeaa7'
                }}>
                  {lengthWarning}
                </p>
              )}
            </div>
          )}
        </div>
        
        <section style={{
          background: '#34495e',
          padding: '2rem',
          borderRadius: '12px',
          margin: '2rem 0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderTop: '4px solid #1e2a38'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            color: '#f0f0f0',
            textAlign: 'center'
          }}>
            2025 NIST Password Guidelines
          </h3>
          <ul style={{
            textAlign: 'left',
            color: '#d0d0d0',
            lineHeight: '1.6',
            margin: '0',
            paddingLeft: '1.5rem'
          }}>
            <li><strong>Use longer passwords</strong></li>
            <li><strong>Drop complexity requirements</strong></li>
            <li><strong>No more forced password resets</strong></li>
            <li><strong>Maintain a password blocklist</strong></li>
            <li><strong>Eliminate security questions</strong></li>
            <li><strong>Use modern security tools</strong></li>
          </ul>
        </section>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/password-generator')}
            className="tool-button primary"
            style={{ 
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              backgroundColor: '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            ⚡ Go to Password Generator
          </button>
        </div>
      </main>
    </div>
  );
}

export default PasswordChecker;