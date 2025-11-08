import React from "react";

// Simple test component to verify basic functionality
function HUDNeonSimple() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#05070b',
      color: '#a1f5ff',
      padding: '20px',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ color: '#00ffff', marginBottom: '20px' }}>
        🚀 HUD Neon - Simple Version
      </h1>
      <p>This is a simplified version of the futuristic UI component.</p>
      <p>If you can see this, the import/export is working correctly.</p>
      
      <div style={{
        marginTop: '40px',
        padding: '20px',
        border: '1px solid #00ffff',
        borderRadius: '8px',
        background: 'rgba(0, 255, 255, 0.1)'
      }}>
        <h3>✅ Component Status: Working</h3>
        <p>React component is rendering successfully.</p>
      </div>
    </div>
  );
}

export default HUDNeonSimple;