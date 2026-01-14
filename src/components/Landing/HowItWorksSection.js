import React from 'react';
import './HowItWorksSection.css';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: '📷',
      title: 'Upload Image',
      description: 'Upload an existing image of the cattle.',
    },
    {
      icon: '🧠',
      title: 'AI Analysis',
      description: 'Our advanced deep learning model analyzes the image.',
    },
    {
      icon: '✅',
      title: 'Get Results',
      description: 'Receive instant breed identification with confidence scores and detailed breed information.',
    },
  ];

  return (
    <section className="how-it-works-section">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Identify cattle breeds in three simple steps
        </p>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{index + 1}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

