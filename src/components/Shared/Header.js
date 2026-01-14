import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🐄</span>
          <span className="logo-text">CattleLens</span>
        </Link>

        <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/scan"
            className={`nav-link ${isActive('/scan') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Scanner
          </Link>
          <Link
            to="/history"
            className={`nav-link ${isActive('/history') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            History
          </Link>
          <Link
            to="/help"
            className={`nav-link ${isActive('/help') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Help
          </Link>
          <Link
            to="/settings"
            className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Settings
          </Link>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

