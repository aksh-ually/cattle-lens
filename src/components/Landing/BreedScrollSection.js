import React from 'react';
import { Link } from 'react-router-dom';
import { breedData } from '../../data/breedData';
import { breedToSlug } from '../../utils/slug';
import './BreedScrollSection.css';

const BreedScrollSection = () => {
  const cattleOnly = breedData.filter(b => !(b.type && /buffalo/i.test(b.type)));
  const breeds = cattleOnly.slice(0, 36);
  return (
    <section className="breed-scroll-section">
      <div className="container">
        <div className="section-header">
          <h2>Explore 36 Cattle Breeds</h2>
          <p>Scroll through and view details for each breed</p>
        </div>
        <div className="scroll-container">
          {breeds.map((b, idx) => (
            <div key={idx} className="breed-card">
              <div className="breed-card-content">
                <div className="breed-card-text">
                  <h3 className="breed-name">{b.name}</h3>
                  {b.origin && <p className="breed-origin">{b.origin}</p>}
                  <p className="breed-desc">{b.description || 'Details available on the breed page.'}</p>
                  <div className="breed-actions">
                    <Link to={`/breed/${breedToSlug(b.name)}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
                {b.image && (
                  <div className="breed-card-media">
                    <img src={b.image} alt={b.name} className="breed-image" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BreedScrollSection;
