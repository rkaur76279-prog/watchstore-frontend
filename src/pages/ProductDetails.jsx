import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ReviewSection from '../components/ReviewSection';
import ProductCard from '../components/ProductCard';
import CheckoutModal from '../components/CheckoutModal';
import { useCart } from '../context/CartContext';
import { LuShoppingBag } from 'react-icons/lu';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const product = products.find(p => p.id === parseInt(id, 10)) || products[0];

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Monitor scroll for mobile sticky Add to Cart bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Timepiece Not Found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '16px' }}>
          RETURN TO BOUTIQUE
        </Link>
      </div>
    );
  }

  // Related products from same category or brand
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.brand === product.brand || p.category === product.category))
    .slice(0, 4);

  const handleStickyAddToCart = () => {
    addToCart(product, {
      caseSize: product.caseSizes ? product.caseSizes[0] : product.caseSize,
      strap: product.straps ? product.straps[0] : product.strap
    });
  };

  return (
    <div className="page-product-details">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link to="/" className="breadcrumb-item">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/shop" className="breadcrumb-item">Watches</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="breadcrumb-item">
            {product.brand}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* 2-Column Product Detail Layout */}
        <div className="product-details-grid">
          {/* Left Column: Image Gallery */}
          <div className="product-gallery-column">
            <ProductGallery
              images={product.images || [product.image]}
              productName={product.name}
            />
          </div>

          {/* Right Column: Product Information & CTAs */}
          <div className="product-info-column">
            <ProductInfo
              product={product}
              onBuyNow={() => setIsCheckoutOpen(true)}
            />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="product-details-reviews-wrapper">
          <ReviewSection product={product} />
        </div>

        {/* Related Timepieces */}
        {relatedProducts.length > 0 && (
          <section className="section-related-products">
            <div className="section-header-left">
              <span className="section-label">CURATED SUGGESTIONS</span>
              <h2 className="section-heading">You May Also Admire</h2>
            </div>
            <div className="product-grid">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div className={`mobile-sticky-cta ${showStickyBar ? 'visible' : ''}`}>
        <div className="mobile-sticky-info">
          <span className="mobile-sticky-brand">{product.brand}</span>
          <span className="mobile-sticky-name">{product.name}</span>
          <span className="mobile-sticky-price">
            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-primary mobile-sticky-btn"
          onClick={handleStickyAddToCart}
        >
          <LuShoppingBag size={14} />
          <span>ADD TO BAG</span>
        </button>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};

export default ProductDetails;
