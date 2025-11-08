import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HUDTest.css';

function HUDDebug() {
  const navigate = useNavigate();

  return (
    <div className="hud-test-override" style={{ 
      minHeight: '100vh', 
      background: '#000',
      position: 'relative',
      padding: '20px'
    }}>
      {/* Back button */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid #00ffff',
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            color: '#00ffff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to Main App
        </button>
      </div>

      {/* Debug content */}
      <div style={{ paddingTop: '80px', textAlign: 'center' }}>
        <h1>🚀 HUD DEBUG PAGE</h1>
        
        <div className="test-box" style={{ 
          padding: '20px', 
          borderRadius: '8px',
          margin: '20px auto',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <strong>✅ CSS OVERRIDE WORKING!</strong>
          <br /><br />
          This should be cyan text with dark background
          <br />
          If you see this styled correctly, the CSS is working
        </div>

        <div className="error-box" style={{ 
          padding: '20px', 
          borderRadius: '8px',
          margin: '20px auto',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <strong>⚠️ ERROR STYLING TEST</strong>
          <br /><br />
          This should be magenta text
        </div>

        <div style={{ marginTop: '40px' }}>
          <p>If this looks correct, the full HUD should work too!</p>
          <button 
            onClick={() => navigate('/hud-test')} 
            style={{
              background: 'transparent',
              color: '#00ffff',
              border: '1px solid #00ffff',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'monospace'
            }}
          >
            → Try Full HUD Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default HUDDebug;