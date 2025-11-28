import React from 'react';
import './HUDTest.css';
import { useNavigate } from 'react-router-dom';  
import { ArrowLeft, ShieldCheck, Radar as RadarIcon} from "lucide-react";
import "./LoadingAnimations.css";
import Footer from './components/Footer';
import BackButton from './components/BackButton';

function TermsPage() {
    const navigate = useNavigate();
    const textHoverColor = '#d5fcfcff';
    
  return (
    <div className="hud-test-override relative min-h-screen bg-black text-cyan-100 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Background Opaque Circle Thing*/}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-96 w-96 rounded-full opacity-30 blur-3xl bg-gradient-to-r from-cyan-400/25 to-blue-500/25 animate-pulse" style={{ top: '-110px' }}></div>
      </div>

      {/* Radar positioned at very top center */}
      <div className="relative z-10 flex justify-center pt-4 pb-8">
        <div className="loading-radar">
          <div className="radar-ring-pulse"></div>
        </div>
      </div>

      {/* Header - positioned below radar */}
      <header className="relative z-20 flex items-center justify-center px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-cyan-400 animate-pulse" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            SECURASPHERE
        </h1>
        </div>
      </header>

      {/* Back button */}
      <BackButton message="Back to Home" path="/test" />

          {/* Main Content */}
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white drop-shadow-lg">
            Terms of Service
          </h2>
          <h1 style={{ fontSize: '1rem', color: '#cccccc', marginBottom: '2rem' }}>
            Last Updated: November 26, 2025
          </h1>

        </div>
        <div style={{ padding: '0rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '120px' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', textAlign: 'center' }}>
                Thank you for using SecuraSphere. By accessing or using our platform, you agree to comply with and be bound by the following Terms of Service.
                </p>

            {/* Download Full Terms Button */}
            <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
              <a 
                href={process.env.PUBLIC_URL + "/SecuraSphere_Terms_of_Service.pdf"}
                download="SecuraSphere_Terms_of_Service.pdf"
                style={{
                  display: 'inline-block',
                  background: 'rgba(0, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: '#00ffff',
                  border: '2px solid #00ffff',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(0, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(0, 255, 255, 0.1)';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                📄 Download the Terms of Service
              </a>
            </div>
        </div>
    
    {/* Footer - moved outside main container */}
    <Footer />
    </div>
  );
}

export default TermsPage;