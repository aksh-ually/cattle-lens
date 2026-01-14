import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [scanHistory, setScanHistory] = useState(() => {
    const saved = localStorage.getItem('scanHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      enableHistory: true,
      maxScans: 100,
      autoDeleteDays: 90,
      defaultModel: 'all',
      enableHardwareAcceleration: true,
    };
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      // Compress and optimize scan history before saving
      const optimizedHistory = scanHistory.map(scan => {
        const optimized = { ...scan };
        
        // Don't store full image data - create a small thumbnail or remove it
        if (optimized.imageSrc && optimized.imageSrc.length > 50000) {
          // If image is too large, create a thumbnail or remove it
          // We'll store a flag that image was removed to save space
          optimized.imageSrc = null;
          optimized.hasImage = true; // Flag to indicate image existed
        }
        
        // Remove modelResults if they're too large (keep only essential data)
        if (optimized.modelResults) {
          optimized.modelResults = optimized.modelResults.map(result => ({
            modelKey: result.modelKey,
            modelName: result.modelName,
            topPrediction: result.predictions?.[0] ? {
              className: result.predictions[0].className,
              probability: result.predictions[0].probability,
            } : null,
            // Don't store all predictions, just the top one
          }));
        }
        
        return optimized;
      });
      
      const dataToStore = JSON.stringify(optimizedHistory);
      
      // Check size before storing (localStorage limit is ~5-10MB)
      if (dataToStore.length > 4 * 1024 * 1024) { // 4MB threshold
        console.warn('Scan history is getting large, cleaning up old entries...');
        // Keep only the most recent 50 scans
        const trimmed = optimizedHistory.slice(0, 50);
        localStorage.setItem('scanHistory', JSON.stringify(trimmed));
        setScanHistory(trimmed);
        return;
      }
      
      localStorage.setItem('scanHistory', JSON.stringify(optimizedHistory));
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        console.error('Storage quota exceeded. Cleaning up old scans...');
        // Keep only the most recent 20 scans, remove all images
        const trimmed = scanHistory.slice(0, 20).map(scan => ({
          id: scan.id,
          breed: scan.breed,
          confidence: scan.confidence,
          timestamp: scan.timestamp,
          imageSrc: null, // Remove images to save space
          modelResults: scan.modelResults?.map(result => ({
            modelKey: result.modelKey,
            modelName: result.modelName,
            topPrediction: result.topPrediction || (result.predictions?.[0] ? {
              className: result.predictions[0].className,
              probability: result.predictions[0].probability,
            } : null),
          })),
        }));
        
        try {
          const trimmedData = JSON.stringify(trimmed);
          if (trimmedData.length > 2 * 1024 * 1024) {
            // Still too large, keep only 10 scans
            const minimal = trimmed.slice(0, 10).map(scan => ({
              id: scan.id,
              breed: scan.breed,
              confidence: scan.confidence,
              timestamp: scan.timestamp,
            }));
            localStorage.setItem('scanHistory', JSON.stringify(minimal));
            setScanHistory(minimal);
          } else {
            localStorage.setItem('scanHistory', trimmedData);
            setScanHistory(trimmed);
          }
        } catch (retryError) {
          console.error('Still too large after cleanup. Clearing history.');
          try {
            localStorage.removeItem('scanHistory');
          } catch (e) {
            // Ignore errors when clearing
          }
          setScanHistory([]);
        }
      } else {
        console.error('Error saving scan history:', error);
      }
    }
  }, [scanHistory]);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Helper function to compress image to thumbnail
  const compressImage = (imageSrc, maxWidth = 200, maxHeight = 200, quality = 0.7) => {
    return new Promise((resolve) => {
      if (!imageSrc || typeof imageSrc !== 'string') {
        resolve(null);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed data URL
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };

      img.onerror = () => {
        resolve(null);
      };

      img.src = imageSrc;
    });
  };

  const addScan = async (scanData) => {
    // Compress image before storing
    let compressedImage = null;
    if (scanData.imageSrc) {
      compressedImage = await compressImage(scanData.imageSrc, 200, 200, 0.6);
    }

    const newScan = {
      id: Date.now().toString(),
      breed: scanData.breed,
      confidence: scanData.confidence,
      imageSrc: compressedImage, // Store compressed thumbnail instead of full image
      timestamp: new Date().toISOString(),
      // Store minimal model results data
      modelResults: scanData.modelResults?.map(result => ({
        modelKey: result.modelKey,
        modelName: result.modelName,
        topPrediction: result.predictions?.[0] ? {
          className: result.predictions[0].className,
          probability: result.predictions[0].probability,
        } : null,
      })),
    };

    setScanHistory(prev => {
      const updated = [newScan, ...prev];
      
      // Limit to maxScans (but be more conservative)
      const maxAllowed = Math.min(settings.maxScans, 50); // Cap at 50 to prevent quota issues
      if (updated.length > maxAllowed) {
        return updated.slice(0, maxAllowed);
      }
      
      // Auto-delete old scans
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - settings.autoDeleteDays);
      return updated.filter(scan => new Date(scan.timestamp) > cutoffDate);
    });
  };

  const deleteScan = (scanId) => {
    setScanHistory(prev => prev.filter(scan => scan.id !== scanId));
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem('scanHistory');
      setScanHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
      setScanHistory([]);
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value = {
    theme,
    toggleTheme,
    scanHistory,
    addScan,
    deleteScan,
    clearHistory,
    settings,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

