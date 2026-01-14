import React from 'react';
import { useApp } from '../context/AppContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { theme, toggleTheme, settings, updateSettings, clearHistory } = useApp();
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="settings-page">
      <div className="container">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-sections">
          <div className="settings-section">
            <h2>Appearance</h2>
            <div className="settings-group">
              <label className="settings-label">Theme</label>
              <div className="theme-selector">
                <button
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => toggleTheme()}
                >
                  ☀️ Light
                </button>
                <button
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => toggleTheme()}
                >
                  🌙 Dark
                </button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Privacy & Data</h2>
            <div className="settings-group">
              <label className="settings-label">Scan History</label>
              <div className="settings-controls">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.enableHistory}
                    onChange={(e) => updateSettings({ enableHistory: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">
                  {settings.enableHistory ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="settings-group">
              <label className="settings-label">Maximum Scans Stored</label>
              <select
                value={settings.maxScans}
                onChange={(e) => updateSettings({ maxScans: parseInt(e.target.value) })}
                className="settings-select"
              >
                <option value={50}>50 scans</option>
                <option value={100}>100 scans</option>
                <option value={200}>200 scans</option>
              </select>
            </div>

            <div className="settings-group">
              <label className="settings-label">Auto-delete After</label>
              <select
                value={settings.autoDeleteDays}
                onChange={(e) => updateSettings({ autoDeleteDays: parseInt(e.target.value) })}
                className="settings-select"
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>

            <div className="settings-group">
              <button
                className="btn btn-outline btn-danger"
                onClick={() => setShowClearConfirm(true)}
              >
                Clear All History
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h2>About</h2>
            <div className="about-info">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>TensorFlow.js:</strong> {window.tf?.version || 'Loading...'}</p>
              <p>CattleLens - AI-Powered Cow Breed Recognition</p>
            </div>
          </div>
        </div>

        {showClearConfirm && (
          <div className="confirm-modal">
            <div className="confirm-content">
              <h3>Clear All History?</h3>
              <p>This action cannot be undone. All your scan history will be permanently deleted.</p>
              <div className="confirm-actions">
                <button className="btn btn-primary" onClick={handleClearHistory}>
                  Clear All
                </button>
                <button className="btn btn-outline" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

