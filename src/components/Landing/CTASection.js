import React from 'react';
import { Link } from 'react-router-dom';
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Identify Cattle Breeds?</h2>
          <p className="cta-subtitle">
            Get started now and experience the power of AI-driven breed recognition
          </p>
          <div className="cta-buttons">
            <Link to="/scan" className="btn btn-primary btn-large">
              Try It Now
            </Link>
            <Link to="/help" className="btn btn-outline btn-large">
              Learn More
            </Link>
          </div>
          <div className="cta-links">
            <Link to="/help#faq">FAQ</Link>
            <span className="separator">•</span>
            <a href="mailto:support@cattlelens.com">Contact</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

