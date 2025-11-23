import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HUDTest.css';

// Import components directly instead of dynamic imports
import HUDNeonWorking from './HUDNeonWorking';
import RadarLoading from './RadarLoading';

function HUDTestFixed() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isLoading) {
      // Simulate loading time for dramatic effect
      const loadingTimer = setTimeout(() => {
        // Show loading for a bit longer for the full effect
        setTimeout(() => {
          setIsLoading(false);
        }, 2000); // 2 seconds total loading time
      }, 500);

      return () => clearTimeout(loadingTimer);
    }
  }, [isLoading]); // React when isLoading changes

  if (isLoading) {
    return (
      <div className="hud-test-override" style={{ 
        minHeight: '100vh', 
        background: '#000',
        position: 'relative'
      }}>
        {/* Back button even during loading */}
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '10px 15px',
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

        <RadarLoading />
      </div>
    );
  }

  return (
    <div className="hud-test-override" style={{ 
      minHeight: '100vh', 
      background: '#000',
      position: 'relative'
    }}>
      {/* Back button to return to main app */}
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
            border: '1px solid #00ffff',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '8px 12px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(0, 255, 255, 0.1)';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          ← Back to Main App
        </button>
      </div>

      {/* Toggle button removed - no longer needed */}
      
      {/* Show full HUD */}
      <div className="hud-test-override" style={{ position: 'relative', zIndex: 1 }}>
        <HUDNeonWorking />
      </div>

      {/* Overlay status */}
      <div className="status-box" style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '15px',
        borderRadius: '8px',
        maxWidth: '300px',
        fontSize: '12px',
        zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid #00ffff',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
      }}>
        <strong>HUD TEST CONTROLS</strong>
        <button 
          onClick={() => setIsLoading(true)}
          style={{
            background: 'transparent',
            color: '#00ffff',
            border: '2px solid #00ffff',
            borderRadius: '6px',
            padding: '8px 15px',
            cursor: 'pointer',
            fontSize: '12px',
            marginTop: '12px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0, 255, 255, 0.1)';
            e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
          }}
        >
          REPLAY LOADING SEQUENCE
        </button>
        <button
        style={{
            background: 'transparent',
            color: '#00ffff',
            border: '2px solid #00ffff',
            borderRadius: '6px',
            padding: '8px 15px',
            cursor: 'pointer',
            fontSize: '12px',
            marginTop: '12px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
          }}>
            AI AGENT HELPER (does not work)
          </button>
      </div>
    </div>
  );
}

export default HUDTestFixed;