import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Shared/Header';
import ScrollToTop from './components/Shared/ScrollToTop';
import LandingPage from './pages/LandingPage';
import ScannerPage from './pages/ScannerPage';
import BreedInfoPage from './pages/BreedInfoPage';
import HistoryPage from './pages/HistoryPage';
import FeedbackPage from './pages/FeedbackPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import NotFoundPage from './pages/NotFoundPage';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/scan" element={<ScannerPage />} />
              <Route path="/breed/:breedName" element={<BreedInfoPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
