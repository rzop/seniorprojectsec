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
                Thank you for using SecuraSphere. By accessing or using our platform, you agree to comply with and be bound by the following Terms of Service. This page provides a summary of key terms. For complete details, please review the full Terms of Service document.
                </p>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00ffff' }}>
                1. Acceptance of Terms
            </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                By accessing and using SecuraSphere, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our platform.
                </p>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00ffff' }}>
                2. Permitted Use
            </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                SecuraSphere is an educational cybersecurity platform designed to help users identify and protect against digital threats. You agree to use this platform solely for lawful, educational purposes and in accordance with all applicable laws and regulations.
                </p>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00ffff' }}>
                3. Prohibited Activities
            </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                You are strictly prohibited from using SecuraSphere to engage in any illegal activities, including but not limited to: unauthorized system access, malware distribution, harassment, fraud, or violations of intellectual property rights. This platform is a learning tool, not a means to facilitate malicious activities.
                </p>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00ffff' }}>
                4. Disclaimer and Limitation of Liability
            </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                SecuraSphere is provided "as is" without warranties of any kind. We make no guarantees regarding the accuracy or completeness of security analysis. Cybersecurity is complex and evolving—our platform should be one component of a comprehensive security strategy. We are not liable for damages arising from platform use, including data loss or security breaches.
                </p>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00ffff' }}>
                5. Modifications to Terms
            </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of the platform after changes constitutes acceptance of the modified terms.
                </p>

            {/* Download Full Terms Button */}
            <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
              <a 
                href="/path-to-your-full-terms-document.pdf"
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

            <p style={{ fontSize: '1.0rem', lineHeight: '1.6', marginBottom: '1rem', textAlign: 'center', marginTop: '2rem' }}>
                If you have any questions about these Terms of Service, please contact us at{' '}
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

export default TermsPage;