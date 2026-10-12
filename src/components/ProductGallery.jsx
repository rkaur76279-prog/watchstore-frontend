import React, { useState } from 'react';

const ProductGallery = ({ images = [], productName = "Watch" }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const activeImage = images[selectedIndex] || images[0];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="product-gallery">
      {/* Main Image Viewport */}
      <div
        className="product-gallery-main"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={activeImage}
          alt={`${productName} view ${selectedIndex + 1}`}
          className="product-gallery-main-img"
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: 'scale(1.4)'
                }
              : { transform: 'scale(1)' }
          }
        />
        <div className="gallery-zoom-hint">
          <span>HOVER TO ZOOM DIAL</span>
        </div>
      </div>

      {/* Thumbnails Underneath (72x72px, 8px gap) */}
      <div className="product-gallery-thumbnails">
        {images.map((imgUrl, idx) => (
          <button
            key={idx}
            type="button"
            className={`product-gallery-thumb-btn ${selectedIndex === idx ? 'active' : ''}`}
            onClick={() => setSelectedIndex(idx)}
            aria-label={`View image ${idx + 1}`}
          >
            <img src={imgUrl} alt={`${productName} thumbnail ${idx + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
