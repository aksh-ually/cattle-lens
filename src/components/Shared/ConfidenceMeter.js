import React from 'react';
import './ConfidenceMeter.css';

const ConfidenceMeter = ({ confidence, size = 'medium', showLabel = false }) => {
  const percentage = Math.round(confidence * 100);
  
  const getConfidenceLevel = () => {
    if (percentage >= 80) return 'high';
    if (percentage >= 60) return 'moderate';
    return 'low';
  };

  const confidenceLevel = getConfidenceLevel();

  const getColor = () => {
    switch (confidenceLevel) {
      case 'high':
        return 'var(--success-color)';
      case 'moderate':
        return 'var(--warning-color)';
      case 'low':
        return 'var(--error-color)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const getLabel = () => {
    switch (confidenceLevel) {
      case 'high':
        return 'High Confidence';
      case 'moderate':
        return 'Moderate Confidence';
      case 'low':
        return 'Low Confidence';
      default:
        return '';
    }
  };

  const sizeClass = size === 'large' ? 'large' : size === 'small' ? 'small' : '';

  return (
    <div className={`confidence-meter ${sizeClass}`}>
      <div className="confidence-circle">
        <svg 
          className="confidence-svg"
          viewBox="0 0 100 100"
          style={{ width: size === 'large' ? '150px' : size === 'small' ? '60px' : '100px' }}
        >
          <circle
            className="confidence-track"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeOpacity="0.2"
          />
          <circle
            className="confidence-progress"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - confidence)}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="confidence-percentage">
          {percentage}%
        </div>
      </div>
      {showLabel && (
        <div className="confidence-label" style={{ color: getColor() }}>
          {getLabel()}
        </div>
      )}
    </div>
  );
};

export default ConfidenceMeter;

