import React, { useState } from 'react';
import './App.css';

function PasswordChecker() {
  const [password, setPassword] = useState('');

  const sha1 = async (message) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
  };

  const checkPassword = async () => {
    if (!password) return;
    
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
        console.log('Password found in database');
      } 
      else {
        console.log('Password not found in database');
      }
    } 
    catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div>
      <h1>Password Breach Checker</h1>
      <div>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to check"
        />
        <button onClick={checkPassword}>
          Check
        </button>
      </div>
    </div>
  );
}

export default PasswordChecker;