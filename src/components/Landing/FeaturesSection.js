import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Instant Results',
      description: 'Get predictions in under 2 seconds',
    },
    {
      icon: '🌐',
      title: 'No Installation',
      description: 'Works directly in your browser',
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Use on any device, anywhere',
    },
    {
      icon: '🆓',
      title: 'Free & Open',
      description: 'No hidden costs or subscriptions',
    },
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Why Choose CattleLens?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

