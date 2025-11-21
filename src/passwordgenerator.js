/* eslint-env es2020 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
//
function PasswordGenerator() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  const [generationType, setGenerationType] = useState('random');
  const [isChecking, setIsChecking] = useState(false);
  const [breachStatus, setBreachStatus] = useState(null);
  const [customPrefix, setCustomPrefix] = useState('');

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
  
  const getRandomWord = async () => {
    try {
      const response = await fetch('https://random-word-api.vercel.app/api?words=1');
      const words = await response.json();
      return words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
    catch (error) {
      throw error;
    }
  };
  
  const checkPasswordBreach = async (pwd) => {
    const sha1 = async (message) => {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex.toUpperCase();
    };
    
    try {
      const hash = await sha1(pwd);
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5);
      
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await response.text();
      
      const lines = text.split('\n');
      const match = lines.find(line => {
        const [hashSuffix] = line.split(':');
        return hashSuffix === suffix;
      });
      
      return !match;
    }
    catch (error) {
      console.error('Error checking breach status:', error);
      return null;
    }
  };
  
  const generateMemorablePassword = async () => {
    setIsChecking(true);
    setBreachStatus(null);
    
    const numWords = 2 + Math.floor(Math.random() * 2);
    const words = [];
    
    for (let i = 0; i < numWords; i++) {
      const word = await getRandomWord();
      words.push(word);
    }
    
    const numbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const symbols = '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    const memorablePassword = words.join('') + numbers + symbols;
    
    const isSafe = await checkPasswordBreach(memorablePassword);
    
    setPassword(memorablePassword);
    setBreachStatus(isSafe);
    setIsChecking(false);
    setCopied(false);
  };
  
  const generateRandomPassword = async () => {
    setIsChecking(true);
    setBreachStatus(null);
    
    const p = 137679308119764668012999113161163554727553694504328845318802723367369176164981055511147150883267010990344885242152698121937077633336968790709954826243699948640899677859242273424500151846562685398985300570776214991989575265452198256123894255426204884076079520571766577667533227039850979273554872588180953495267n;
    const q = 96321018355314307613737874016618535544886546186823045508108202102267017197052122170211567100044801244293854643091561147907078160268959544580191138605623179835132904091073638522708259748879211885165468771982929390435189828156127035555552485085841566152567436516238897838503548330060366133313829775788275575971n;
    
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let newPassword = '';
    
    for (let i = 0; i < length; i++) {
      const bits = blumBlumShub(p, q, 7);
      const index = parseInt(bits, 2) % charset.length;
      newPassword += charset[index];
    }
    
    const isSafe = await checkPasswordBreach(newPassword);
    
    setPassword(newPassword);
    setBreachStatus(isSafe);
    setIsChecking(false);
    setCopied(false);
  };
  
  const generatePrefixPassword = async () => {
    setIsChecking(true);
    setBreachStatus(null);

    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

    let newPassword = customPrefix;
    const remainingLength = length - customPrefix.length;

    if (remainingLength < 0) {
      setPassword("Prefix is longer than the chosen password length!");
      setIsChecking(false);
      return;
    }

    const randomValues = new Uint32Array(remainingLength);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < remainingLength; i++) {
      const index = randomValues[i] % charset.length;
      newPassword += charset[index];
    }

    const isSafe = await checkPasswordBreach(newPassword);

    setPassword(newPassword);
    setBreachStatus(isSafe);
    setIsChecking(false);
    setCopied(false);
  };

  const generatePassword = () => {
    if (generationType === 'memorable') {
      generateMemorablePassword();
    }
    else if (generationType === 'prefix') {
      generatePrefixPassword();
    }
    else {
      generateRandomPassword();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <h1>Password Generator</h1>
        <p className="subtitle">
          Generate secure passwords with breach checking
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
          <div style={{ margin: '20px 0' }}>
            <label style={{ marginRight: '20px' }}>
              <input
                type="radio"
                value="random"
                checked={generationType === 'random'}
                onChange={(e) => setGenerationType(e.target.value)}
              />
              Random (Most Secure)
            </label>
            <label>
              <input
                type="radio"
                value="memorable"
                checked={generationType === 'memorable'}
                onChange={(e) => setGenerationType(e.target.value)}
              />
              Memorable (Easier to Remember)
            </label>
            <label style={{ marginLeft: '20px' }}>
              <input
                type="radio"
                value="prefix"
                checked={generationType === 'prefix'}
                onChange={(e) => setGenerationType(e.target.value)}
              />
              Prefix (Customize it to be more meaningful to you)
            </label>
          </div>

          {generationType === 'prefix' && (
            <div style={{ margin: '20px 0' }}>
              <label style={{ 
                fontSize: '1.1rem',
                color: '#1e2a38',
                fontWeight: 'bold'
              }}>
                Custom Prefix:
                <input
                  type="text"
                  value={customPrefix}
                  onChange={(e) => setCustomPrefix(e.target.value)}
                  placeholder="Enter prefix"
                  style={{
                    display: 'block',
                    marginTop: '10px',
                    padding: '8px',
                    width: '250px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: '6px',
                    border: '1px solid #ccc'
                  }}
                />
              </label>

              <label style={{ 
                fontSize: '1.1rem',
                color: '#1e2a38',
                fontWeight: 'bold',
                marginTop: '15px'
              }}>
                Password Length: {length}
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  style={{ 
                    marginLeft: '10px', 
                    width: '200px',
                    display: 'block',
                    margin: '10px auto'
                  }}
                />
              </label>
            </div>
          )}
            
          {generationType === 'random' && (
            <div style={{ margin: '20px 0' }}>
              <label style={{ 
                fontSize: '1.1rem',
                color: '#1e2a38',
                fontWeight: 'bold'
              }}>
                Password Length: {length}
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  style={{ 
                    marginLeft: '10px', 
                    width: '200px',
                    display: 'block',
                    margin: '10px auto'
                  }}
                />
              </label>
            </div>
          )}
          
          <button 
            onClick={generatePassword}
            disabled={isChecking}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              backgroundColor: isChecking ? '#95a5a6' : '#1e2a38',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isChecking ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {isChecking ? 'Generating & Checking...' : 'Generate Password'}
          </button>
        </div>
        
        {password && (
          <div style={{
            background: '#f5f5f5',
            padding: '2rem',
            borderRadius: '12px',
            margin: '2rem 0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderTop: `4px solid ${breachStatus === false ? '#e74c3c' : '#27ae60'}`,
            textAlign: 'center'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              color: '#1e2a38'
            }}>
              Generated Password
            </h3>
            <div style={{ 
              fontFamily: 'monospace',
              backgroundColor: '#ffffff',
              padding: '15px',
              margin: '15px 0',
              wordBreak: 'break-all',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '1.1rem',
              color: '#333'
            }}>
              {password}
            </div>
            
            {breachStatus !== null && (
              <div style={{
                padding: '10px',
                marginBottom: '15px',
                borderRadius: '8px',
                backgroundColor: breachStatus ? '#d4edda' : '#f8d7da',
                color: breachStatus ? '#155724' : '#721c24'
              }}>
                {breachStatus 
                  ? 'Password NOT found in any known data breaches - Safe to use!'
                  : 'This password exists in breach databases - Generating a new one is recommended'}
              </div>
            )}
            
            <button 
              onClick={copyToClipboard}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        )}
        
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
            What Makes a Strong Password?
          </h3>
          <ul style={{
            color: '#d0d0d0',
            lineHeight: '1.8',
            margin: '0',
            textAlign: 'left',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <li><strong>Length matters most:</strong> 16+ characters recommended by NIST</li>
            <li><strong>Uniqueness:</strong> Never reuse passwords across sites</li>
            <li><strong>Unpredictability:</strong> Avoid personal info, common words, or patterns</li>
            <li><strong>Memorable option:</strong> Combines random words with numbers and symbols</li>
            <li><strong>Random option:</strong> Uses cryptographically secure randomization for maximum security</li>
            <li><strong>Breach checking:</strong> Automatically verified against known compromised passwords</li>
          </ul>
        </section>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/password-checker')}
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
            Go to Password Breach Checker
          </button>
        </div>
      </main>
    </div>
  );
}

export default PasswordGenerator;
