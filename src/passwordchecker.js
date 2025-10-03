import React, { useState } from 'react';
import './App.css';

function PasswordChecker() {
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);

  const sha1 = async (message) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
  };

  const checkPassword = async () => {
    if (!password) return;
    
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
        const count = match.split(':')[1];
        setResult(`Password found in ${count} breaches`);
      } 
      else {
        setResult('Password not found in known breaches');
      }
    } 
    catch (error) {
      console.error('Error:', error);
      setResult('Error checking password');
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
      </main>
    </div>
  );
}

export default PasswordChecker;