import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HUDTest.css';
import BackButton from './components/BackButton';
import AIHelper from './components/AIHelper';

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

      {/* AI Helper Component */}
      <AIHelper />

    </div>
  );
}

export default HUDTestFixed;