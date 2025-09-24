//src/components/home/AboutSection.jsx
import React from 'react';
import { DescribeIcon, AnalyzeIcon, DiscoverIcon } from './Icons';

const AboutSection = () => {
    const sectionStyle = { padding: '80px 24px' };
    const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '48px auto' };
    const cardStyle = { background: 'rgba(255, 255, 255, 0.05)', padding: '32px', borderRadius: '16px', textAlign: 'center' };
    const h2Style = { fontSize: '3rem', fontWeight: 800, textAlign: 'center', marginBottom: '16px' };
    const h3Style = { fontSize: '1.5rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px' };

    return (
        <div style={sectionStyle}>
            <h2 style={h2Style}>How It Works</h2>
            <div style={gridStyle}>
                <div style={cardStyle}>
                    <DescribeIcon />
                    <h3 style={h3Style}>1. Describe</h3>
                    <p>Simply type how you're feeling. Our AI understands natural, conversational language.</p>
                </div>
                <div style={cardStyle}>
                    <AnalyzeIcon />
                    <h3 style={h3Style}>2. Analyze</h3>
                    <p>BotMD intelligently analyzes your input to identify key symptoms or understand your question.</p>
                </div>
                <div style={cardStyle}>
                    <DiscoverIcon />
                    <h3 style={h3Style}>3. Discover</h3>
                    <p>Receive a human-like response with potential insights or a clear answer to your health query.</p>
                </div>
            </div>

            <h2 style={{ ...h2Style, marginTop: '80px' }}>Two Powerful Modes</h2>
            <div style={{...gridStyle, gridTemplateColumns: '1fr 1fr'}}>
                <div style={cardStyle}>
                    <h3 style={h3Style}>Symptom Analysis</h3>
                    <p>Leverage our advanced Llama 3.1 model to extract symptoms and match them against a comprehensive knowledge base to identify potential conditions.</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={h3Style}>Medical Q&A</h3>
                    <p>Have a general health question? Ask our AI assistant anything from the difference between viruses and bacteria to the benefits of a balanced diet.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;