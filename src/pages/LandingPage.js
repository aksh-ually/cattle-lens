import React from 'react';
import HeroSection from '../components/Landing/HeroSection';
import HowItWorksSection from '../components/Landing/HowItWorksSection';
import BreedScrollSection from '../components/Landing/BreedScrollSection';
import FeaturesSection from '../components/Landing/FeaturesSection';
import AboutSection from '../components/Landing/AboutSection';
import CTASection from '../components/Landing/CTASection';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <HeroSection />
      <HowItWorksSection />
      <BreedScrollSection />
      <FeaturesSection />
      <AboutSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;

