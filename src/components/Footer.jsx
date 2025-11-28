import React from 'react';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();

  const handleLinkHover = (e) => {
    e.target.style.setProperty('color', '#66ffff', 'important');
    e.target.style.transform = 'scale(1.1)';
    e.target.style.textShadow = '0 0 8px rgba(0, 255, 255, 0.8)';
  };

  const handleLinkLeave = (e) => {
    e.target.style.removeProperty('color');
    e.target.style.transform = 'scale(1)';
    e.target.style.textShadow = 'none';
  };

  return (
    <footer 
      className="relative z-20 border-t border-cyan-800/20 px-8 py-6 backdrop-blur-sm"
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        paddingTop: '12px',
        paddingBottom: '15px'
      }}>
      <div className="flex items-center justify-between text-sm text-cyan-300/60">
        <p>© 2025 SecuraSphere. Team CAWWZ. UF Senior Project.</p>
        <div className="flex gap-6">
          <a 
            href="#" 
            className="hover:text-cyan-100 transition-colors"
            style={{ transition: 'all 0.3s ease' }}
            onMouseOver={handleLinkHover}
            onMouseOut={handleLinkLeave}
            onClick={(e) => {
              e.preventDefault();
              navigate('/about');
            }}>
            About
          </a>
          <a 
            href="#" 
            className="hover:text-cyan-100 transition-colors"
            style={{ transition: 'all 0.3s ease' }}
            onMouseOver={handleLinkHover}
            onMouseOut={handleLinkLeave}
            onClick={(e) => {
              e.preventDefault();
              navigate('/privacy');
            }}>
            Privacy
          </a>
          <a 
            href="#"
            className="hover:text-cyan-100 transition-colors"
            style={{ transition: 'all 0.3s ease' }}
            onMouseOver={handleLinkHover}
            onMouseOut={handleLinkLeave}
            onClick={(e) => {
              e.preventDefault();
              navigate('/terms');
            }}>
            Terms
          </a>
          <a 
            href="#" 
            className="hover:text-cyan-100 transition-colors"
            style={{ transition: 'all 0.3s ease' }}
            onMouseOver={handleLinkHover}
            onMouseOut={handleLinkLeave}
            onClick={(e) => {
              e.preventDefault();
              navigate('/contact');
            }}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
