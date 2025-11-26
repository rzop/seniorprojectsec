import React from 'react';
import './HUDTest.css';
import { useNavigate } from 'react-router-dom';  
import { ArrowLeft, ShieldCheck, Radar as RadarIcon} from "lucide-react";
import "./LoadingAnimations.css";
import Footer from './components/Footer';
import BackButton from './components/BackButton';

function PrivacyPage() {
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
            Privacy Policy
          </h2>
          <h1 style={{ fontSize: '1rem', color: '#cccccc', marginBottom: '2rem' }}>
            Last Updated: November 26, 2025
          </h1>

        </div>
        <div style={{ padding: '0rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '120px' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem', textAlign: 'center' }}>
                At SecuraSphere, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our platform.
                </p>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00ffff' }}>
                Information We Collect
            </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                We do not collect any personal information from our users. Additionally, we do not collect non-personal information such as browser type, operating system, or usage data. 
                We focus on providing our services without compromising your privacy. Our platform operates entirely client-side, ensuring your data remains secure on your device.
                </p>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00ffff' }}>
                Data Security
            </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Since we do not collect or store your information, your data security is inherently protected. All processing happens locally on your device, eliminating the risks associated with data transmission and storage.
                You maintain complete control over your privacy as all interactions with our platform remain local to your device.
                </p>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00ffff' }}>
                Changes to This Privacy Policy
            </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
            <p style={{ fontSize: '1.0rem', lineHeight: '1.6', marginBottom: '1rem', textAlign: 'center' }}>
                <br />If you have any questions about this Privacy Policy, please contact us at{' '}
                <a 
                  href="mailto:wright.macarius@ufl.edu"
                  style={{ 
                    color: '#00ffff',
                    textDecoration: 'underline',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: 1000,
                    pointerEvents: 'auto',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.textShadow = '0 0 8px rgba(0, 255, 255, 0.8)';
                    e.target.style.color = '#66ffff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.textShadow = 'none';
                    e.target.style.color = '#00ffff';
                  }}
                >
                  wright.macarius@ufl.edu
                </a>.
            </p>
        </div>
    
    {/* Footer - moved outside main container */}
    <Footer />
    </div>
  );
}

export default PrivacyPage;
