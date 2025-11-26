import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton({ message, path }) {
  const navigate = useNavigate();
  
  return (
    <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 10000,
        padding: '10px 15px',
      }}>
        <button 
          onClick={() => navigate(path)}
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
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
          ← {message}
        </button>
      </div>
      );
}

export default BackButton;
