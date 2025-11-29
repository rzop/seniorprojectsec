import React from 'react';
import './HUDTest.css';
import { useNavigate } from 'react-router-dom';  
import { ArrowLeft, ShieldCheck, Radar as RadarIcon} from "lucide-react";
import "./LoadingAnimations.css";
import Footer from './components/Footer';
import BackButton from './components/BackButton';
import AIHelper from './components/AIHelper';

function AboutPage() {
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
            About Us
          </h2>

        </div>
        <div style={{ padding: '0rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '120px' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem', textAlign: 'center' }}>
                SecuraSphere was founded in 2025 by a team of computer science students at the University of Florida for our senior project. Recognizing the growing threat of cyber attacks, we developed a platform that combines engaging content with practical tools to help users stay safe online.
                </p>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00ffff' }}>
                Meet the Team
            </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>Kai Cooper</span> - <br/>
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>Muneeb Ahmed</span> - <br/>
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                
                </p>
                
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>Zackary Whalen</span> - <br/>
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>Macarius Wright</span> - <br/>
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>Richard Zhang</span> - <br/>
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                
                </p>
        </div>
    
    {/* AI Helper Component */}
    <AIHelper />

    {/* Footer - moved outside main container */}
    <Footer />
    </div>
  );
}

export default AboutPage;
