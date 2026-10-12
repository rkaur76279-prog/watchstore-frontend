import React, { useState } from 'react';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { LuPlus, LuMinus, LuShieldCheck, LuTruck, LuRotateCcw, LuChevronDown } from 'react-icons/lu';
import Rating from './Rating';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductInfo = ({ product, onBuyNow }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  // State for selections
  const [selectedCaseSize, setSelectedCaseSize] = useState(
    product.caseSizes ? product.caseSizes[0] : product.caseSize
  );
  const [selectedStrap, setSelectedStrap] = useState(
    product.straps ? product.straps[0] : product.strap
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors ? product.colors[0].name : product.dialColor
  );
  const [quantity, setQuantity] = useState(1);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState({
    description: true,
    specs: false,
    movement: false,
    case: false,
    strap: false,
    waterResistance: false,
    shippingReturns: false
  });

  const toggleAccordion = (sectionKey) => {
    setOpenAccordions(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, {
      caseSize: selectedCaseSize,
      strap: selectedStrap,
      dialColor: selectedColor
    }, quantity);
  };

  const handleBuyNowClick = () => {
    addToCart(product, {
      caseSize: selectedCaseSize,
      strap: selectedStrap,
      dialColor: selectedColor
    }, quantity);
    if (onBuyNow) onBuyNow();
  };

  const isFavorite = isWishlisted(product.id);
  const monthlyPayment = (product.price / 4).toFixed(2);

  return (
    <div className="product-info-panel">
      {/* Brand & Title */}
      <div className="product-info-header">
        <span className="product-info-brand">{product.brand}</span>
        <h1 className="product-info-title">{product.name}</h1>
        {product.tagline && <p className="product-info-tagline">{product.tagline}</p>}
      </div>

      {/* Rating & Reviews */}
      <div className="product-info-rating-row">
        <Rating rating={product.rating} reviews={product.reviews} size={16} />
        <a href="#reviews-section" className="product-info-scroll-reviews">
          Read all {product.reviews} verified reviews ↓
        </a>
      </div>

      {/* Price & Financing */}
      <div className="product-info-price-block">
        <div className="product-info-price-row">
          <span className="product-info-price">
            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="product-info-original-price">
              ${product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
        <div className="product-info-financing">
          <span>Or 4 interest-free payments of <strong>${monthlyPayment}</strong> with Klarna or Affirm.</span>
        </div>
      </div>

      <div className="product-info-divider" />

      {/* Variant Selectors */}
      <div className="product-variants-container">
        {/* Dial Color / Material */}
        {product.colors && product.colors.length > 0 && (
          <div className="variant-group">
            <div className="variant-label-row">
              <span className="variant-label">Dial Color</span>
              <span className="variant-selected-value">{selectedColor}</span>
            </div>
            <div className="color-swatches-list">
              {product.colors.map(color => (
                <button
                  key={color.name}
                  type="button"
                  className={`color-swatch-btn ${selectedColor === color.name ? 'active' : ''}`}
                  onClick={() => setSelectedColor(color.name)}
                  title={color.name}
                >
                  <span
                    className="swatch-circle"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="swatch-text">{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Case Size Options */}
        {product.caseSizes && product.caseSizes.length > 0 && (
          <div className="variant-group">
            <div className="variant-label-row">
              <span className="variant-label">Case Size</span>
              <span className="variant-selected-value">{selectedCaseSize}</span>
            </div>
            <div className="pill-options-list">
              {product.caseSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  className={`pill-option-btn ${selectedCaseSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedCaseSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Strap Material Options */}
        {product.straps && product.straps.length > 0 && (
          <div className="variant-group">
            <div className="variant-label-row">
              <span className="variant-label">Strap</span>
              <span className="variant-selected-value">{selectedStrap}</span>
            </div>
            <div className="pill-options-list">
              {product.straps.map(strap => (
                <button
                  key={strap}
                  type="button"
                  className={`pill-option-btn ${selectedStrap === strap ? 'active' : ''}`}
                  onClick={() => setSelectedStrap(strap)}
                >
                  {strap}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quantity & CTA Buttons */}
      <div className="product-actions-block">
        <div className="product-quantity-row">
          <span className="quantity-label">Quantity</span>
          <div className="quantity-stepper">
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              <LuMinus size={13} />
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              <LuPlus size={13} />
            </button>
          </div>
        </div>

        {/* Primary CTA: ADD TO CART */}
        <div className="cta-button-row">
          <button
            type="button"
            className="btn btn-primary btn-add-to-cart"
            onClick={handleAddToCart}
          >
            ADD TO CART — ${(product.price * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            className={`btn-wishlist-toggle ${isFavorite ? 'active' : ''}`}
            onClick={() => toggleWishlist(product.id)}
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            title="Save to Wishlist"
          >
            {isFavorite ? <IoIosHeart size={20} color="#C6A15B" /> : <IoIosHeartEmpty size={20} />}
          </button>
        </div>

        {/* Secondary CTA: BUY IT NOW */}
        <button
          type="button"
          className="btn btn-secondary btn-buy-now"
          onClick={handleBuyNowClick}
        >
          BUY IT NOW
        </button>
      </div>

      {/* Trust & Shipping Highlights */}
      <div className="product-trust-highlights">
        <div className="trust-highlight-row">
          <LuTruck size={17} color="#C6A15B" />
          <span>Complimentary worldwide insured armored courier delivery.</span>
        </div>
        <div className="trust-highlight-row">
          <LuRotateCcw size={17} color="#C6A15B" />
          <span>30-day effortless worldwide returns and full authenticity certificate.</span>
        </div>
        <div className="trust-highlight-row">
          <LuShieldCheck size={17} color="#C6A15B" />
          <span>5-year comprehensive manufacturer & atelier warranty.</span>
        </div>
      </div>

      <div className="product-info-divider" />

      {/* Accordions */}
      <div className="product-accordions-group">
        {/* Description Accordion */}
        <div className="accordion-item">
          <button
            type="button"
            className="accordion-trigger"
            onClick={() => toggleAccordion('description')}
            aria-expanded={openAccordions.description}
          >
            <span>Description</span>
            <LuChevronDown className={`accordion-icon ${openAccordions.description ? 'open' : ''}`} />
          </button>
          {openAccordions.description && (
            <div className="accordion-content">
              <p>{product.description}</p>
            </div>
          )}
        </div>

        {/* Specifications Accordion */}
        <div className="accordion-item">
          <button
            type="button"
            className="accordion-trigger"
            onClick={() => toggleAccordion('specs')}
            aria-expanded={openAccordions.specs}
          >
            <span>Specifications</span>
            <LuChevronDown className={`accordion-icon ${openAccordions.specs ? 'open' : ''}`} />
          </button>
          {openAccordions.specs && (
            <div className="accordion-content">
              <div className="spec-table">
                {product.specs && Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="spec-row">
                    <span className="spec-key">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <span className="spec-val">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Movement Accordion */}
        <div className="accordion-item">
          <button
            type="button"
            className="accordion-trigger"
            onClick={() => toggleAccordion('movement')}
            aria-expanded={openAccordions.movement}
          >
            <span>Movement</span>
            <LuChevronDown className={`accordion-icon ${openAccordions.movement ? 'open' : ''}`} />
          </button>
          {openAccordions.movement && (
            <div className="accordion-content">
              <p><strong>Caliber:</strong> {product.specs?.caliber || product.movement}</p>
              <p><strong>Power Reserve:</strong> {product.specs?.powerReserve || "Standard"}</p>
              <p><strong>Vibrations:</strong> {product.specs?.vibrations || "28,800 vph"}</p>
              <p>Engineered to chronometric standards with anti-magnetic balance springs and shock protection.</p>
            </div>
          )}
        </div>

        {/* Case Accordion */}
        <div className="accordion-item">
          <button
            type="button"
            className="accordion-trigger"
            onClick={() => toggleAccordion('case')}
            aria-expanded={openAccordions.case}
          >
            <span>Case</span>
            <LuChevronDown className={`accordion-icon ${openAccordions.case ? 'open' : ''}`} />
          </button>
          {openAccordions.case && (
            <div className="accordion-content">
              <p><strong>Material:</strong> {product.specs?.caseMaterial || "316L Surgical Stainless Steel"}</p>
              <p><strong>Diameter:</strong> {selectedCaseSize}</p>
              <p><strong>Thickness:</strong> {product.specs?.caseThickness || "11.5mm"}</p>
              <p><strong>Crystal:</strong> {product.specs?.crystal || "Sapphire with Anti-Reflective coating"}</p>
            </div>
          )}
        </div>

        {/* Strap Accordion */}
        <div className="accordion-item">
          <button
            type="button"
            className="accordion-trigger"
            onClick={() => toggleAccordion('strap')}
            aria-expanded={openAccordions.strap}
          >
            <span>Strap</span>
            <LuChevronDown className={`accordion-icon ${openAccordions.strap ? 'open' : ''}`} />
          </button>
          {openAccordions.strap && (
            <div className="accordion-content">
              <p><strong>Selected Strap:</strong> {selectedStrap}</p>
              <p><strong>Lug Width:</strong> {product.specs?.lugWidth || "20mm"}</p>
              <p>Hand-crafted with deployant clasp for exceptional security and comfort.</p>
            </div>
          )}
        </div>

        {/* Water Resistance Accordion */}
        <div className="accordion-item">
          <button
            type="button"
            className="accordion-trigger"
            onClick={() => toggleAccordion('waterResistance')}
            aria-expanded={openAccordions.waterResistance}
          >
            <span>Water Resistance</span>
            <LuChevronDown className={`accordion-icon ${openAccordions.waterResistance ? 'open' : ''}`} />
          </button>
          {openAccordions.waterResistance && (
            <div className="accordion-content">
              <p><strong>Rating:</strong> {product.waterResistance} / {parseInt(product.waterResistance) * 3.3} ft</p>
              <p>Hermetically sealed with screw-down crown gaskets. Tested individually under hydrostatic pressure.</p>
            </div>
          )}
        </div>

        {/* Shipping & Returns Accordion */}
        <div className="accordion-item">
          <button
            type="button"
            className="accordion-trigger"
            onClick={() => toggleAccordion('shippingReturns')}
            aria-expanded={openAccordions.shippingReturns}
          >
            <span>Shipping & Returns</span>
            <LuChevronDown className={`accordion-icon ${openAccordions.shippingReturns ? 'open' : ''}`} />
          </button>
          {openAccordions.shippingReturns && (
            <div className="accordion-content">
              <p><strong>Courier Delivery:</strong> Dispatched via fully insured armored carrier within 24 hours of order verification. Requires signature upon delivery.</p>
              <p><strong>Returns:</strong> 30-day return policy for unworn timepieces in original packaging with intact security seals.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
