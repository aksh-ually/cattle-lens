import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="container">
        <h2 className="section-title">About CattleLens</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              CattleLens is an innovative web application that leverages cutting-edge 
              deep learning technology to identify cattle breeds through image recognition. 
              Built  utilizing the state-of-the-art InceptionResNetV2 architecture within a Convolutional Neural Network (CNN) algorithm, our platform provides 
              instant and accurate breed identification.
            </p>
            <p>
              Our system uses a specialized AI model trained on thousands of images 
              to identify over 36 different cattle breeds with high accuracy. The model
              is optimized for web browsers, ensuring fast performance without requiring 
              any software installation.
            </p>
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">36+</div>
                <div className="stat-label">Cattle Breeds</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">85%+</div>
                <div className="stat-label">Accuracy</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">&lt;2s</div>
                <div className="stat-label">Response Time</div>
              </div>
            </div>
            <h3 className="about-subtitle">Limitations & Best Practices</h3>
            <ul className="about-list">
              <li>For best results, use clear, well-lit images with the cow in focus</li>
              <li>The model works best with side-view images showing the full body</li>
              <li>Crossbreeds may show lower confidence scores</li>
              <li>Results are most accurate for purebred animals</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

