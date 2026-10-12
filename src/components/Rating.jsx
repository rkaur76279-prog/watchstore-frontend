import React from 'react';
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from 'react-icons/io';

const Rating = ({ rating = 5, reviews, size = 14, showText = true }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.4;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<IoIosStar key={i} color="#C6A15B" size={size} />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<IoIosStarHalf key={i} color="#C6A15B" size={size} />);
    } else {
      stars.push(<IoIosStarOutline key={i} color="#D2D2D0" size={size} />);
    }
  }

  return (
    <div className="rating-component">
      <div className="rating-stars" aria-label={`Rating: ${rating} out of 5 stars`}>
        {stars}
      </div>
      {showText && (
        <span className="rating-text">
          <span className="rating-value">{rating.toFixed(1)}</span>
          {reviews !== undefined && (
            <span className="rating-count">({reviews} {reviews === 1 ? 'review' : 'reviews'})</span>
          )}
        </span>
      )}
    </div>
  );
};

export default Rating;
