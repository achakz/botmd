//src/components/home/HomeSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeSection = () => {
    const navigate = useNavigate();

    const containerStyle = {
        textAlign: 'center',
        padding: '120px 24px',
        maxWidth: '800px',
        margin: '0 auto',
    };

    const h1Style = {
        fontSize: '4rem',
        fontWeight: 800,
        color: '#FFFFFF',
        marginBottom: '24px',
        lineHeight: 1.2,
    };

    const pStyle = {
        fontSize: '1.25rem',
        color: '#9CA3AF',
        marginBottom: '40px',
        lineHeight: 1.6,
    };
    
    const ctaButtonStyle = {
        background: 'linear-gradient(90deg, #38BDF8, #3B82F6)',
        color: '#FFFFFF',
        border: 'none',
        padding: '16px 32px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: 600,
        transition: 'transform 0.2s, box-shadow 0.3s',
        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
    };

    return (
        <div style={containerStyle}>
            <h1 style={h1Style}>Intelligent Health Insights, Instantly.</h1>
            <p style={pStyle}>
                Describe your symptoms in plain language to get AI-driven insights, or ask general medical questions. Fast, private, and informative.
            </p>
            <button style={ctaButtonStyle} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} onClick={() => navigate('/chat')}>
                Launch BotMD
            </button>
        </div>
    );
};

export default HomeSection;