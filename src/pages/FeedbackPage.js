import React, { useState } from 'react';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would submit to a backend or email service
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    
    // Clear form after submission
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        issueType: '',
        description: '',
        email: '',
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="feedback-page">
      <div className="container">
        <h1 className="feedback-title">Feedback & Reporting</h1>
        <p className="feedback-subtitle">
          Help us improve by reporting errors or sharing your feedback
        </p>

        {submitted ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Thank you for your feedback!</h2>
            <p>Your input helps us improve our models and service.</p>
            <p className="reference-number">Reference: #FB-{Date.now().toString().slice(-6)}</p>
          </div>
        ) : (
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Issue Type</label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select an issue type...</option>
                <option value="incorrect-prediction">Incorrect breed prediction</option>
                <option value="model-loading">Model not loading</option>
                <option value="image-quality">Poor image quality handling</option>
                <option value="feature-request">Feature request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="6"
                placeholder="Please describe the issue or provide additional details..."
                required
                maxLength={1000}
              />
              <span className="char-count">
                {formData.description.length}/1000 characters
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="your.email@example.com"
              />
              <p className="form-hint">We'll only use this to follow up on your feedback</p>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-large">
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;

