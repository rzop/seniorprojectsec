import React, { useState } from 'react';
import './App.css';

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  
  //I used my blum blum algorithmn I previously implemented in CIS 4362 but it's converted into javascript since I orginally wrote the code in python. The core logic is similar.
  const gcd = (a, b) => {
    if (b === 0) return Math.abs(a);
    return gcd(b, a % b);
  };
  
  const blumBlumShub = (p, q, bitLength) => {
    const n = p * q;
    let seed = 0;
    let GCD = 0;
    
    while (GCD !== 1) {
      seed = Math.floor(Math.random() * (n - 1)) + 1;
      GCD = gcd(seed, n);
    }
    
    let x = seed;
    let bits = '';
    
    for (let i = 0; i < bitLength; i++) {
      x = (x * x) % n;
      bits += (x & 1);
    }
    
    return bits;
  };
  
  const generatePassword = () => {
    const p = 499;
    const q = 547; 
    const length = 16; 
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let newPassword = '';
    
    for (let i = 0; i < length; i++) {
      const bits = blumBlumShub(p, q, 7);
      const index = parseInt(bits, 2) % charset.length;
      newPassword += charset[index];
    }
    
    setPassword(newPassword);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Password Generator</h1>
        <p className="subtitle">
          Cryptographically secure passwords using Blum Blum Shub PRNG
        </p>
      </header>
      <main className="App-main">
        <button onClick={generatePassword}>
          Generate Password
        </button>
        
        {password && (
          <div style={{ 
            fontFamily: 'monospace',
            backgroundColor: '#f0f0f0',
            padding: '10px',
            margin: '10px',
            wordBreak: 'break-all'
          }}>
            {password}
          </div>
        )}
        
        <section>
          <h3>About Blum Blum Shub</h3>
          <p>
            This generator uses the Blum Blum Shub algorithm to generate pseudo random and safe passwords. It's one of the form of pseudorandom number generator that is provably cryptographically secure and it's based on the difficulty of factoring large composite numbers.
          </p>
        </section>
      </main>
    </div>
  );
}

export default PasswordGenerator;