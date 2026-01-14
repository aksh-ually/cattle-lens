import React from 'react';
import { Link } from 'react-router-dom';
import ConfidenceMeter from '../Shared/ConfidenceMeter';
import './PredictionResults.css';

const formatBreedNameForUrl = (breedName) => {
  if (!breedName || typeof breedName !== 'string') {
    return 'unknown-breed';
  }
  return breedName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^a-z0-9-]/g, '') 
    .replace(/-+/g, '-') 
    .replace(/^-|-$/g, ''); 
};

const PredictionResults = ({ predictions, imageSrc, onReset }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="prediction-results">
        <div className="results-container">
          <div className="error-card">
            <p>No predictions available. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  // Combine all predictions and find the highest confidence
  const allPredictions = [];
  predictions.forEach((modelResult) => {
    // Safety check: ensure modelResult and predictions array exist
    if (modelResult && modelResult.predictions && Array.isArray(modelResult.predictions)) {
      modelResult.predictions.forEach((pred) => {
        // Safety check: ensure pred has required properties
        if (pred && pred.className && typeof pred.probability === 'number') {
          allPredictions.push({
            ...pred,
            modelName: modelResult.modelName || 'AI Model',
            modelKey: modelResult.modelKey || 'unknown',
          });
        }
      });
    }
  });

  // Check if we have any valid predictions
  if (allPredictions.length === 0) {
    return (
      <div className="prediction-results">
        <div className="results-container">
          <div className="error-card">
            <p>No valid predictions found. The prediction data may be incomplete.</p>
            <button className="btn btn-primary" onClick={onReset}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sort by probability (highest first)
  allPredictions.sort((a, b) => b.probability - a.probability);

  // Get top prediction
  const topPrediction = allPredictions[0];

  // Safety check for topPrediction
  if (!topPrediction) {
    return (
      <div className="prediction-results">
        <div className="results-container">
          <div className="error-card">
            <p>Error: No predictions available.</p>
            <button className="btn btn-primary" onClick={onReset}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ensure className exists - if not, try to get it from the first model result
  if (!topPrediction.className && predictions && predictions.length > 0) {
    const firstModelResult = predictions.find(r => r && r.predictions && r.predictions.length > 0);
    if (firstModelResult && firstModelResult.predictions[0]) {
      topPrediction.className = firstModelResult.predictions[0].className;
      topPrediction.probability = firstModelResult.predictions[0].probability;
      topPrediction.modelName = firstModelResult.modelName;
    }
  }

  // Get confidence level
  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'moderate';
    return 'low';
  };

  const confidenceLevel = getConfidenceLevel(topPrediction.probability || 0);

  // Get alternative predictions (top 3 excluding the primary)
  const alternatives = allPredictions.slice(1, 4);

  // Check if any predictions are mock
  const hasMockPredictions = predictions && predictions.some(r => r.isMock);

  const isNotCow = (topPrediction.className || '').toLowerCase().includes('not a cow');

  if (isNotCow) {
    return (
      <div className="prediction-results">
        <div className="results-container">
          <h2 className="results-title">Not a cow!</h2>
          <div className="result-image-section">
            <img src={imageSrc} alt="Analyzed" className="result-image" />
          </div>
          <div className="result-actions">
            <button className="btn btn-outline btn-large" onClick={onReset}>
              Try Another Image
            </button>
            <Link to="/feedback" className="btn-link">
              Report Error
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prediction-results">
      <div className="results-container">
        <h2 className="results-title">Prediction Results</h2>
        

        {/* Image Preview */}
        <div className="result-image-section">
          <img src={imageSrc} alt="Analyzed" className="result-image" />
        </div>

        {/* Results from each model */}
        <div className="models-results">
          {predictions.map((modelResult, index) => {
            // Safety checks
            if (!modelResult || !modelResult.predictions || !Array.isArray(modelResult.predictions) || modelResult.predictions.length === 0) {
              return (
                <div key={index} className="model-result-card">
                  <div className="model-result-header">
                    <h3 className="model-result-name">{modelResult?.modelName || `Model ${index + 1}`}</h3>
                    <span className="model-result-badge">No predictions</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>
                    No predictions available for this model.
                  </p>
                </div>
              );
            }

            const topPred = modelResult.predictions[0];
            
            // Additional safety check for topPred
            if (!topPred || !topPred.className) {
              return (
                <div key={index} className="model-result-card">
                  <div className="model-result-header">
                    <h3 className="model-result-name">{modelResult.modelName || `Model ${index + 1}`}</h3>
                    <span className="model-result-badge">Error</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>
                    Invalid prediction data.
                  </p>
                </div>
              );
            }

            return (
              <div key={index} className="model-result-card">
                
                <div className="model-top-prediction">
                  <h4 className="predicted-breed">{topPred.className}</h4>
                  <ConfidenceMeter 
                    confidence={topPred.probability || 0} 
                    showLabel={true}
                  />
                </div>
                {modelResult.predictions.length > 1 && (
                  <div className="model-alternatives">
                    <p className="alternatives-label">Other possibilities:</p>
                    <div className="alternatives-list">
                      {modelResult.predictions.slice(1, 4).filter(pred => pred && pred.className).map((pred, idx) => (
                        <div key={idx} className="alternative-item">
                          <span className="alt-breed">{pred.className}</span>
                          <span className="alt-confidence">
                            {((pred.probability || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Primary Result */}
        <div className={`primary-result ${confidenceLevel}`}>
          <div className="primary-result-header">
            <div className="confidence-badge-large">
              <ConfidenceMeter 
                confidence={topPrediction.probability || 0} 
                size="large"
                showLabel={true}
              />
            </div>
            <h2 className="primary-breed-name">{topPrediction?.className || 'Unknown Breed'}</h2>
            
          </div>
        </div>

        

        {/* Action Buttons */}
        <div className="result-actions">
          {confidenceLevel !== 'low' && (
            <Link
              to={`/breed/${formatBreedNameForUrl(topPrediction.className)}`}
              className="btn btn-primary btn-large"
            >
              View Breed Details
            </Link>
          )}
          <button className="btn btn-outline btn-large" onClick={onReset}>
            Try Another Image
          </button>
          <Link to="/feedback" className="btn-link">
            Report Error
          </Link>
        </div>

        {/* Confidence Warning */}
        {confidenceLevel === 'low' && (
          <div className="confidence-warning">
            <p>⚠️ Low confidence prediction. For best results, try a clearer image with better lighting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionResults;

