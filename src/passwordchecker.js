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
        <h1>Password Breach Checker</h1>
        <p className="subtitle">
          Check if your password has been compromised in a data breach
        </p>
      </header>
      <main className="App-main">
        <div>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to check"
            disabled={isChecking}
          />
          <button onClick={checkPassword} disabled={isChecking || !password}>
            {isChecking ? 'Checking...' : 'Check Password'}
          </button>
        </div>
        {result && <p>{result}</p>}
        {lengthWarning && <p>{lengthWarning}</p>}
	<button onClick={() => navigate('/password-generator')}>
          Generate a Strong Password
        </button>
        <section>
          <h3>2025 NIST Password Guidelines</h3>
          <ul>
            <li><strong>Use longer passwords</strong></li>
            <li><strong>Drop complexity requirements</strong></li>
            <li><strong>No more forced password resets</strong></li>
            <li><strong>Maintain a password blocklist</strong></li>
            <li><strong>Eliminate security questions</strong></li>
            <li><strong>Use modern security tools</strong></li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default PasswordChecker;