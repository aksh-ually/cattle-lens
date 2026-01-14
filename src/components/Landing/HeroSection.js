import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const scrollToScanner = () => {
    window.location.href = '/scan';
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Powered <span className="highlight">Cow Breed Recognition</span>
          </h1>
          <p className="hero-subtitle">
            Identify cattle breeds instantly with machine learning technology. 
            Powered by InceptionResNetV2 architecture.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-large" onClick={scrollToScanner}>
              Start Identifying
            </button>
            <Link to="/help" className="btn btn-outline btn-large">
              Learn More
            </Link>
          </div>
          <div className="hero-trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">✅</span>
              <span>36+ Breeds Supported</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🆓</span>
              <span>Free to Use</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">🐄</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

