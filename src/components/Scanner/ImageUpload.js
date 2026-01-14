import React, { useRef, useState } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImageCapture }) => {
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|heic|heif)$/)) {
      alert('Please select a valid image file (JPG, PNG, or HEIC)');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setPreview(imageUrl);
      onImageCapture(file, imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload">
      {!preview ? (
        <div
          ref={dropZoneRef}
          className={`upload-zone ${isDragging ? 'dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          <div className="upload-content">
            <div className="upload-icon">📁</div>
            <h3>Drag and drop your image here</h3>
            <p>or click to browse</p>
            <p className="upload-hint">
              Supported formats: JPG, PNG, HEIC (Max 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="upload-preview">
          <img src={preview} alt="Preview" className="preview-img" />
          <button
            className="btn btn-outline"
            onClick={() => {
              setPreview(null);
              fileInputRef.current.value = '';
            }}
          >
            Choose Different Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

