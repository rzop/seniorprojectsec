import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HUDTest.css';

function HUDTestSimple() {
  const navigate = useNavigate();

  return (
    <div className="hud-test-override" style={{ 
      minHeight: '100vh', 
      background: '#000', 
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

      {/* Test content */}
      <div style={{
        paddingTop: '80px',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '20px' }}>
          🚀 HUD TEST PAGE
        </h1>
        
        <div className="test-box" style={{ 
          padding: '20px', 
          borderRadius: '8px',
          margin: '20px auto',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <strong>⚡ TESTING CYBERPUNK STYLING</strong>
          <br /><br />
          This text should be <span className="cyan-text">CYAN (#00ffff)</span>
          <br />
          Background should be dark with cyan border
          <br />
          Font should be monospace
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
          This text should be <span className="magenta-text">MAGENTA (#ff0080)</span>
          <br />
          Background should be dark with magenta border
        </div>
      </div>
    </div>
  );
}

export default HUDTestSimple;