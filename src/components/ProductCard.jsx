import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { LuShoppingBag } from 'react-icons/lu';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isFavorite = isWishlisted(product.id);

  const handleCardClick = (e) => {
    // If clicked on wishlist heart or quick add button, do not navigate
    if (e.target.closest('.product-card-wishlist-btn') || e.target.closest('.product-card-quick-add')) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, {
      caseSize: product.caseSizes ? product.caseSizes[0] : product.caseSize,
      strap: product.straps ? product.straps[0] : product.strap
    });
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="product-card" onClick={handleCardClick} tabIndex={0} role="article">
      <div className="product-card-media-wrapper">
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="product-card-image"
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-card-badges">
          {product.isNew && <span className="badge badge-dark">NEW ARRIVAL</span>}
          {product.featured && !product.isNew && <span className="badge badge-gold">ICONIC</span>}
          {product.movement && <span className="badge badge-outline">{product.movement}</span>}
        </div>

        {/* Wishlist Heart */}
        <button
          type="button"
          className={`product-card-wishlist-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isFavorite ? (
            <IoIosHeart size={20} color="#C6A15B" />
          ) : (
            <IoIosHeartEmpty size={20} />
          )}
        </button>

        {/* Quick Add To Bag overlay button on hover */}
        <button
          type="button"
          className="product-card-quick-add"
          onClick={handleQuickAdd}
          aria-label="Quick add to bag"
        >
          <LuShoppingBag size={14} />
          QUICK ADD
        </button>
      </div>

      <div className="product-card-content">
        <span className="product-card-brand">{product.brand}</span>
        <h3 className="product-card-title">{product.name}</h3>
        
        <div className="product-card-meta">
          <div className="product-card-price-container">
            <span className="product-card-price">
              ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-card-original-price">
                ${product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <span className="product-card-spec">{product.caseSize}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
