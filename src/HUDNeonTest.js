import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HUDTest.css';

// Import the HUD component directly
import HUDNeonWorking from './HUDNeonWorking';

function HUDNeonTest() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      width: '100vw',
      overflow: 'hidden',
      background: 'black'
    }}>
      {/* Back button */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.9)',
        padding: '10px 15px',
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            color: '#00ffff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '8px 12px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}
        >
          ← Back to Main App
        </button>
      </div>

      {/* Show HUD */}
      <div className="hud-test-override" style={{ position: 'relative', zIndex: 1 }}>
        <HUDNeonWorking />
      </div>
    </div>
  );
}

export default HUDNeonTest;
