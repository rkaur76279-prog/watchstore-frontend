import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/shop?category=${encodeURIComponent(category.filterParam)}`}
      className="category-card"
      aria-label={`Explore ${category.name}`}
    >
      <div className="category-card-bg-wrap">
        <img
          src={category.image}
          alt={category.name}
          className="category-card-image"
          loading="lazy"
        />
        <div className="category-card-overlay" />
      </div>

      <div className="category-card-content">
        <span className="category-card-tagline">{category.tagline}</span>
        <h3 className="category-card-title">{category.name}</h3>
        <p className="category-card-desc">{category.description}</p>
        <span className="category-card-cta">
          EXPLORE TIMEPIECES →
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
