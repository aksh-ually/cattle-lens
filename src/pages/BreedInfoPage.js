import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { breedData } from '../data/breedData';
import './BreedInfoPage.css';

const BreedInfoPage = () => {
  const { breedName } = useParams();
  
  // Convert URL slug to readable breed name
  // e.g., "holstein-friesian" -> "Holstein Friesian"
  const formatBreedName = (slug) => {
    if (!slug || typeof slug !== 'string') {
      return 'Unknown Breed';
    }
    
    // Handle edge cases and special formatting
    return slug
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => {
        // Handle special cases like "gidda" -> "Gidda", "Malnad gidda" -> "Malnad Gidda"
        if (word.toLowerCase() === 'gidda') return 'Gidda';
        if (word.toLowerCase() === 'ravi') return 'Ravi';
        // Capitalize first letter of each word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ')
      .trim();
  };

  const formattedBreedName = formatBreedName(breedName);
  const breedKey = formattedBreedName.toLowerCase().trim();
  
  // Debug log to help identify issues (can be removed in production)
  console.log('Breed page - URL breedName:', breedName, 'Formatted:', formattedBreedName);
  
  // Find breed data - try multiple matching strategies
  const findBreed = () => {
    // Exact match (case-insensitive)
    let found = breedData.find(
      b => b.name.toLowerCase().trim() === breedKey
    );
    
    // Partial match (contains)
    if (!found) {
      found = breedData.find(
        b => b.name.toLowerCase().includes(breedKey) || breedKey.includes(b.name.toLowerCase())
      );
    }
    
    // Word-by-word match (if multi-word)
    if (!found && breedKey.includes(' ')) {
      const breedWords = breedKey.split(' ');
      found = breedData.find(b => {
        const breedNameWords = b.name.toLowerCase().split(' ');
        return breedWords.some(word => breedNameWords.includes(word)) ||
               breedNameWords.some(word => breedWords.includes(word));
      });
    }
    
    return found;
  };

  const foundBreed = findBreed();
  
  // If breed found, use it; otherwise create a basic breed object with the predicted name
  const breed = foundBreed || {
    name: formattedBreedName,
    origin: 'Information not available',
    primaryUse: 'Information not available',
    description: `Information about ${formattedBreedName} cattle breed. Detailed information is being updated and will be available soon.`,
    quickFacts: [
      { label: 'Breed Name', value: formattedBreedName },
      { label: 'Status', value: 'Information coming soon' },
    ],
  };

  return (
    <div className="breed-info-page">
      <div className="container">
        <Link to="/scan" className="back-link">
          ← Back to Scanner
        </Link>

        <div className="breed-header">
          <h1>{breed.name}</h1>
          <div className="breed-badges">
            {breed.primaryUse && breed.primaryUse !== 'Information not available' && (
              <span className="badge badge-primary">{breed.primaryUse}</span>
            )}
            {breed.origin && breed.origin !== 'Information not available' && (
              <span className="badge badge-secondary">{breed.origin}</span>
            )}
            {(!breed.primaryUse || breed.primaryUse === 'Information not available') && 
             (!breed.origin || breed.origin === 'Information not available') && (
              <span className="badge badge-secondary">Breed Information Pending</span>
            )}
          </div>
        </div>

        <div className="breed-content">
          <div className="breed-main">
            {breed.image && (
              <div className="breed-image-section">
                <img src={breed.image} alt={breed.name} className="breed-hero-image" />
              </div>
            )}

            <div className="breed-description">
              <h2>About</h2>
              <p>{breed.description || 'Detailed information about this breed is being updated.'}</p>
            </div>

            {breed.characteristics && (
              <div className="breed-section">
                <h2>Physical Characteristics</h2>
                <div className="characteristics-grid">
                  {breed.characteristics.map((char, idx) => (
                    <div key={idx} className="characteristic-item">
                      <strong>{char.label}:</strong> {char.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {breed.production && (
              <div className="breed-section">
                <h2>Production Information</h2>
                <div className="production-info">
                  {breed.production.map((info, idx) => (
                    <div key={idx} className="production-item">
                      <strong>{info.label}:</strong> {info.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Production Details from JSON data */}
            {breed.milk_yield && (
              <div className="breed-section">
                <h2>Detailed Production Data</h2>
                <div className="production-info">
                  {breed.milk_yield && (
                    <div className="production-item">
                      <strong>Milk Yield:</strong> {breed.milk_yield}
                    </div>
                  )}
                  {breed.lactation_length && (
                    <div className="production-item">
                      <strong>Lactation Length:</strong> {breed.lactation_length}
                    </div>
                  )}
                  {breed.age_at_first_calving && (
                    <div className="production-item">
                      <strong>Age at First Calving:</strong> {breed.age_at_first_calving}
                    </div>
                  )}
                  {breed.body_weight && (
                    <div className="production-item">
                      <strong>Body Weight:</strong> {breed.body_weight}
                    </div>
                  )}
                  {breed.fat_content && (
                    <div className="production-item">
                      <strong>Fat Content:</strong> {breed.fat_content}
                    </div>
                  )}
                  {breed.calving_interval && (
                    <div className="production-item">
                      <strong>Calving Interval:</strong> {breed.calving_interval}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="breed-sidebar">
            <div className="quick-facts-card">
              <h3>Quick Facts</h3>
              <ul className="facts-list">
                {breed.quickFacts ? (
                  breed.quickFacts.map((fact, idx) => (
                    <li key={idx}>
                      <strong>{fact.label}:</strong> {fact.value}
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <strong>Breed Name:</strong> {breed.name}
                    </li>
                    {breed.origin && (
                      <li>
                        <strong>Origin:</strong> {breed.origin}
                      </li>
                    )}
                    {breed.primaryUse && (
                      <li>
                        <strong>Primary Use:</strong> {breed.primaryUse}
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="breed-actions">
          <Link to="/scan" className="btn btn-primary">
            Identify Another Breed
          </Link>
          <Link to="/history" className="btn btn-outline">
            View History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BreedInfoPage;

