import React from 'react';
import { useNavigate } from 'react-router-dom';

// SVG Icon is now self-contained within this component to fix the import error.
const BotMDLogo = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12L22 7" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12V22" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Navbar = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 5%',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    backdropFilter: 'blur(10px)',
    zIndex: 1000,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxSizing: 'border-box',
  };

  const navLinkStyle = (section) => ({
    color: activeSection === section ? '#38BDF8' : '#D1D5DB',
    background: 'none',
    border: 'none',
    padding: '8px 16px',
    margin: '0 8px',
    cursor: 'pointer',
    fontFamily: '"Inter", sans-serif',
    fontSize: '1rem',
    fontWeight: 500,
    position: 'relative',
    transition: 'color 0.3s',
  });
  
  const activeLinkUnderline = {
      content: '""',
      position: 'absolute',
      bottom: '-4px',
      left: '16px',
      right: '16px',
      height: '2px',
      backgroundColor: '#38BDF8',
  };

  const buttonStyle = (primary = false) => ({
    background: primary ? 'linear-gradient(90deg, #38BDF8, #3B82F6)' : 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: '"Inter", sans-serif',
    fontSize: '0.9rem',
    fontWeight: 600,
    marginLeft: '16px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  });
  
  const handleGetStarted = () => navigate('/register');

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <BotMDLogo />
        <span style={{ 
            fontFamily: '"Oswald", sans-serif', 
            fontWeight: 600, 
            fontSize: '1.75rem', 
            color: '#FFFFFF',
            letterSpacing: '0.5px'
        }}>
          BotMD
        </span>
      </div>
      <div>
        {['home', 'about', 'technology'].map((section) => (
          <button key={section} style={navLinkStyle(section)} onClick={() => setActiveSection(section)}>
            {section.charAt(0).toUpperCase() + section.slice(1)}
            {activeSection === section && <span style={activeLinkUnderline}></span>}
          </button>
        ))}
      </div>
      <div>
        <button style={buttonStyle()} onClick={() => navigate('/login')}>Login</button>
        <button style={buttonStyle(true)} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

