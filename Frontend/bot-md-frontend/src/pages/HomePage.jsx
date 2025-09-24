//src/pages/HomePage.jsx
import React, { useState } from 'react';
import Navbar from '../components/home/Navbar';
import HomeSection from '../components/home/HomeSection';
import AboutSection from '../components/home/AboutSection';
import TechnologySection from '../components/home/TechnologySection';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'about':
        return <AboutSection />;
      case 'technology':
        return <TechnologySection />;
      default:
        return <HomeSection />;
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#111827',
    color: '#E5E7EB',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    paddingTop: '80px',
    overflowX: 'hidden', // <-- THE FIX IS HERE
  };

  return (
    <div style={pageStyle}>
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>{renderSection()}</main>
    </div>
  );
};

export default HomePage;