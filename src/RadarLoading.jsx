import React, { useState, useEffect } from 'react';
import './LoadingAnimations.css';

const RadarLoading = ({ message = "INITIALIZING RADAR SYSTEMS" }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  
  const loadingMessages = [
    message
  ];
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const currentMessage = loadingMessages[currentMessageIndex];

  // Reset animation when component mounts
  React.useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsDeleting(false);
    setCycleCount(0);
    setCurrentMessageIndex(0);
  }, []);

  useEffect(() => {
    // Stop animation after showing all messages once
    if (cycleCount >= loadingMessages.length) {
      setDisplayText("SYSTEMS ONLINE - READY FOR OPERATION");
      return;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < currentMessage.length) {
          setDisplayText(prev => prev + currentMessage[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        } else {
          // Start deleting after a pause
          setTimeout(() => setIsDeleting(true), 500);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(prev => prev.slice(0, -1));
        } else {
          // Move to next message
          setIsDeleting(false);
          setCurrentIndex(0);
          const nextIndex = (currentMessageIndex + 1) % loadingMessages.length;
          setCurrentMessageIndex(nextIndex);
          
          // If we've completed one full cycle, increment cycle count
          if (nextIndex === 0) {
            setCycleCount(prev => prev + 1);
          }
        }
      }
    }, isDeleting ? 20 : 50);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, displayText, currentMessage, currentMessageIndex, cycleCount, loadingMessages.length]);

  return (
    <div className="radar-loading">
      {/* Matrix rain background */}
      <div className="matrix-rain"></div>
      
      {/* Scanning lines overlay */}
      <div className="scanning-lines"></div>
      
      {/* Animated radar */}
      <div className="loading-radar">
        <div className="radar-ring-pulse"></div>
      </div>
      
      {/* Typewriter text */}
      <div className="typewriter" style={{ width: '400px', textAlign: 'center' }}>
        {displayText}
      </div>
      
      {/* Secondary status */}
      <div style={{ 
        marginTop: '20px', 
        color: 'rgba(0, 255, 255, 0.7)', 
        fontSize: '14px',
        fontFamily: 'monospace',
        textAlign: 'center'
      }}>
        <div> ENCRYPTION: ACTIVIVATED</div>
        <div style={{ marginTop: '5px' }}>FIREWALL STATUS: OPERATIONAL</div>
        <div style={{ marginTop: '5px' }}>THREAT LEVEL: MIDNIGHT</div>
      </div>
      
      {/* Progress indicators */}
      <div style={{ 
        marginTop: '30px', 
        display: 'flex', 
        gap: '10px',
        alignItems: 'center'
      }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#00ffff',
              borderRadius: '50%',
              animation: `radar-ping ${1 + i * 0.2}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RadarLoading;