import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-icon">🐄</div>
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-message">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-large">
              Go Home
            </Link>
            <Link to="/scan" className="btn btn-outline btn-large">
              Start Scanning
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

