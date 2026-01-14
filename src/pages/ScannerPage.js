import React, { useState } from 'react';
import ImageInput from '../components/Scanner/ImageInput';
import PredictionResults from '../components/Scanner/PredictionResults';
import { useApp } from '../context/AppContext';
import { predictFromImage } from '../utils/tmPredict';
import './ScannerPage.css';

const ScannerPage = () => {
  const [image, setImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const { addScan } = useApp();

  React.useEffect(() => {}, []);

  const handleImageCapture = (imageFile, imageDataUrl) => {
    setImage(imageFile);
    setImageSrc(imageDataUrl);
    setError(null);
    setPredictions(null);
  };

  const handlePredict = async () => {
    if (!image) return;
    setIsLoading(true);
    try {
      const results = await predictFromImage(image, imageSrc);
      setPredictions(results);
      const top = results[0]?.predictions?.[0];
      await addScan({
        breed: top?.className || 'Unknown Breed',
        confidence: top?.probability ?? null,
        imageSrc,
        modelResults: results,
      });
    } catch (e) {
      setError('Failed to generate prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageSrc(null);
    setError(null);
    setPredictions(null);
  };

  return (
    <div className="scanner-page">
      <div className="container">
        <div className="scanner-header">
          <h1>Scanner</h1>
          <p>Upload an image to see a prediction.</p>
        </div>

        {isLoading && (
          <div className="model-loading">
            <div className="loading-card">
              <h3>Loading...</h3>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="error-message">
            <div className="error-card warning">
              <span className="error-icon">⚠️</span>
              <h3>Notice</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => setError(null)}>
                Dismiss
              </button>
            </div>
          </div>
        )}

        {!image && (
          <ImageInput onImageCapture={handleImageCapture} />
        )}

        {image && !isLoading && !predictions && (
          <div className="image-preview-section">
            <div className="preview-card">
              <h3>Image Preview</h3>
              <div className="image-preview-container">
                <img src={imageSrc} alt="Preview" className="preview-image" />
              </div>
              <div className="preview-actions">
                <button className="btn btn-primary" onClick={handlePredict}>
                  Predict
                </button>
                <button className="btn btn-outline" onClick={handleReset}>
                  Choose Different Image
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && image && (
          <div className="processing-section">
            <div className="processing-card">
              <div className="spinner"></div>
              <h3>Processing Image...</h3>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <div className="error-card">
              <span className="error-icon">⚠️</span>
              <h3>Error</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => setError(null)}>
                Dismiss
              </button>
            </div>
          </div>
        )}

        {predictions && (
          <PredictionResults 
            predictions={predictions} 
            imageSrc={imageSrc}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default ScannerPage;

