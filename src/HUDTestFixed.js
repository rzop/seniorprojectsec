import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HUDTest.css';
import BackButton from './components/BackButton';

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
        <BackButton message='Back to Old App' path='/' />

        {/* Show loading animation */}
        <RadarLoading message='ENGAGING SECURITY PROTOCOLS...'/>
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
      <BackButton message='Back to Old App' path='/' />

      {/* Toggle button removed - no longer needed */}
      
      {/* Show full HUD */}
      <div className="hud-test-override" style={{ position: 'relative', zIndex: 1 }}>
        <HUDNeonWorking />
      </div>

      {/* Overlay status */}
      <div className="status-box" style={{
        position: 'fixed',
        bottom: '60px',
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