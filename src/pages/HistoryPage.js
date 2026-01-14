import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ConfidenceMeter from '../components/Shared/ConfidenceMeter';
import './HistoryPage.css';

const HistoryPage = () => {
  const { scanHistory, deleteScan, clearHistory } = useApp();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedScan, setSelectedScan] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearAll = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (scanHistory.length === 0) {
    return (
      <div className="history-page">
        <div className="container">
          <div className="history-header">
            <h1>Scan History</h1>
          </div>
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h2>No scans yet</h2>
            <p>Start by uploading or capturing a cow image</p>
            <Link to="/scan" className="btn btn-primary">
              Go to Scanner
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="container">
        <div className="history-header">
          <div>
            <h1>Scan History</h1>
            <p className="history-count">{scanHistory.length} total scans</p>
          </div>
          <div className="history-actions">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                ⊞
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                ☰
              </button>
            </div>
            <button
              className="btn btn-outline"
              onClick={() => setShowClearConfirm(true)}
            >
              Clear All
            </button>
          </div>
        </div>

        {showClearConfirm && (
          <div className="confirm-modal">
            <div className="confirm-content">
              <h3>Clear All History?</h3>
              <p>This action cannot be undone. All your scan history will be permanently deleted.</p>
              <div className="confirm-actions">
                <button className="btn btn-primary" onClick={handleClearAll}>
                  Clear All
                </button>
                <button className="btn btn-outline" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`history-grid ${viewMode}`}>
          {scanHistory.map((scan) => (
            <div key={scan.id} className="history-card">
              <div className="card-image">
                {scan.imageSrc ? (
                  <img src={scan.imageSrc} alt={scan.breed} />
                ) : (
                  <div className="no-image-placeholder-small">
                    <span>📷</span>
                  </div>
                )}
              </div>
              <div className="card-content">
                <h3 className="card-breed">{scan.breed}</h3>
                <div className="card-confidence">
                  <ConfidenceMeter 
                    confidence={scan.confidence} 
                    size="small"
                    showLabel={false}
                  />
                  <span className="confidence-text">
                    {(scan.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="card-timestamp">{formatTimestamp(scan.timestamp)}</p>
              </div>
              <div className="card-actions">
                <Link
                  to={`/breed/${scan.breed.toLowerCase().replace(/\s+/g, '-')}`}
                  className="card-btn"
                  title="View breed details"
                >
                  👁️
                </Link>
                <button
                  className="card-btn"
                  onClick={() => deleteScan(scan.id)}
                  title="Delete scan"
                >
                  🗑️
                </button>
              </div>
              {scan.modelResults && (
                <div className="card-models">
                  {scan.modelResults.map((result, idx) => (
                    <span key={idx} className="model-badge-small">
                      {result.modelName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedScan && (
          <div className="scan-detail-modal" onClick={() => setSelectedScan(null)}>
            <div className="scan-detail-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-btn"
                onClick={() => setSelectedScan(null)}
              >
                ×
              </button>
              {selectedScan.imageSrc ? (
                <img src={selectedScan.imageSrc} alt={selectedScan.breed} className="detail-image" />
              ) : (
                <div className="no-image-placeholder">
                  <span>📷</span>
                  <p>Image not available (removed to save storage space)</p>
                </div>
              )}
              <h2>{selectedScan.breed}</h2>
              <p>Confidence: {(selectedScan.confidence * 100).toFixed(1)}%</p>
              <Link
                to={`/breed/${selectedScan.breed.toLowerCase().replace(/\s+/g, '-')}`}
                className="btn btn-primary"
              >
                View Breed Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;

