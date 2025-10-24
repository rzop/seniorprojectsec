/* eslint-env es2020 */
import React, { useState } from 'react';
import './App.css';

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  
  // I used my blum blum algorithm I previously implemented in CIS 4362 but it's converted into javascript since I originally wrote the code in python. The core logic is similar.
  const gcd = (a, b) => {
    a = BigInt(a);
    b = BigInt(b);
    if (b === 0n) return a < 0n ? -a : a;
    return gcd(b, a % b);
  };
  
  const blumBlumShub = (p, q, bitLength) => {
    const n = p * q;
    let seed = 0n;
    let GCD = 0n;
    
    while (GCD !== 1n) {
      const randomArray = new Uint32Array(8);
      crypto.getRandomValues(randomArray);
      
      seed = 0n;
      for (let i = 0; i < randomArray.length; i++) {
        seed = (seed << 32n) | BigInt(randomArray[i]);
      }
      seed = seed % (n - 1n) + 1n;
      GCD = gcd(seed, n);
    }
    
    let x = seed;
    let bits = '';
    
    for (let i = 0; i < bitLength; i++) {
      x = (x * x) % n;
      bits += (x & 1n).toString();
    }
    
    return bits;
  };
  
  const generatePassword = () => {
    const p = 137679308119764668012999113161163554727553694504328845318802723367369176164981055511147150883267010990344885242152698121937077633336968790709954826243699948640899677859242273424500151846562685398985300570776214991989575265452198256123894255426204884076079520571766577667533227039850979273554872588180953495267n;
    const q = 96321018355314307613737874016618535544886546186823045508108202102267017197052122170211567100044801244293854643091561147907078160268959544580191138605623179835132904091073638522708259748879211885165468771982929390435189828156127035555552485085841566152567436516238897838503548330060366133313829775788275575971n;
    
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let newPassword = '';
    
    for (let i = 0; i < length; i++) {
      const bits = blumBlumShub(p, q, 7);
      const index = parseInt(bits, 2) % charset.length;
      newPassword += charset[index];
    }
    
    setPassword(newPassword);
    setCopied(false);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div style={{ margin: '20px 0' }}>
          <label>
            Password Length: {length}
            <input
              type="range"
              min="8"
              max="128"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              style={{ marginLeft: '10px', width: '200px' }}
            />
          </label>
        </div>
        
        <button onClick={generatePassword}>
          Generate Password
        </button>
        
        {password && (
          <div>
            <div style={{ 
              fontFamily: 'monospace',
              backgroundColor: '#f0f0f0',
              padding: '10px',
              margin: '10px',
              wordBreak: 'break-all'
            }}>
              {password}
            </div>
            <button onClick={copyToClipboard}>
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        )}
        
        <section>
          <h3>About Blum Blum Shub</h3>
          <p>
            This generator uses the Blum Blum Shub algorithm to generate pseudo random 
            and safe passwords. It's one of the forms of pseudorandom number generator 
            that is provably cryptographically secure and it's based on the difficulty 
            of factoring large composite numbers.
          </p>
        </section>
      </main>
    </div>
  );
}

export default PasswordGenerator;