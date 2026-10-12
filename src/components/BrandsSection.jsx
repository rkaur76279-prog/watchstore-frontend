import React from 'react';
import { Link } from 'react-router-dom';
import { rolexCollectionsList } from '../data/products';

const BrandsSection = () => {
  return (
    <section className="brands-section">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-label">LEGENDARY LINES</span>
          <h2 className="section-heading">Iconic Rolex Collections</h2>
          <p className="section-subheading">
            Each model line represents an indelible chapter in watchmaking history and mechanical innovation.
          </p>
        </div>

        <div className="brands-grid">
          {rolexCollectionsList.map((item) => (
            <Link
              key={item.name}
              to={`/shop?collection=${encodeURIComponent(item.name)}`}
              className="brand-card"
            >
              <div className="brand-card-inner">
                <span className="brand-name-display">{item.name}</span>
                <span className="brand-origin">{item.tagline}</span>
                <span className="brand-heritage">{item.heritage}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="brands-disclaimer">
          <p>
            * Certified Superlative Chronometer guarantee. All timepieces feature original Geneva manufacture serial numbers, green seal certifications, and 5-year international warranty.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
