import React from 'react';
import ImageUpload from './ImageUpload';
import './ImageInput.css';

const ImageInput = ({ onImageCapture }) => {
  const handleImageCapture = (imageFile, imageDataUrl) => {
    onImageCapture(imageFile, imageDataUrl);
  };

  return (
    <div className="image-input-container">
      <div className="input-card">
        <div className="tab-content">
          <ImageUpload onImageCapture={handleImageCapture} />
        </div>
      </div>
    </div>
  );
};

export default ImageInput;

