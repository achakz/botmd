//src/components/home/TechnologySection.jsx
import React from 'react';

const TechnologySection = () => {
    const sectionStyle = { padding: '80px 24px', textAlign: 'center' };
    const h2Style = { fontSize: '3rem', fontWeight: 800, marginBottom: '48px' };
    const gridStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
    };
    const techItemStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '24px 32px',
        borderRadius: '12px',
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#FFFFFF',
        transition: 'transform 0.2s, background 0.2s',
        cursor: 'default',
    };

    const techs = ['React', 'Node.js', 'FastAPI', 'MongoDB', 'Redis', 'Llama 3.1'];

    return (
        <div style={sectionStyle}>
            <h2 style={h2Style}>Powered by a Modern Stack</h2>
            <div style={gridStyle}>
                {techs.map(tech => (
                    <div key={tech} style={techItemStyle} onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                    }} onMouseOut={(e) => {
                         e.currentTarget.style.transform = 'scale(1)';
                         e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}>
                        {tech}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechnologySection;