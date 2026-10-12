import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import BrandsSection from '../components/BrandsSection';
import StorySection from '../components/StorySection';
import Newsletter from '../components/Newsletter';
import { LuSparkles, LuArrowRight } from 'react-icons/lu';

const Home = () => {
  // 1. Featured Collection (4 products)
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  // 2. New Arrivals (4 products)
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="page-home">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <LuSparkles size={13} color="#C6A15B" />
              <span>THE 2026 ROLLEX COLLECTION</span>
            </div>

            <h1 className="hero-title">TIME, REFINED.</h1>

            <p className="hero-subheading">
              Discover exceptional Rolex timepieces designed to define every moment. Masterpieces of mechanical precision, aesthetic nobility, and Superlative Chronometer performance.
            </p>

            <div className="hero-actions">
              <Link to="/shop?category=Professional" className="btn btn-primary hero-btn">
                PROFESSIONAL WATCHES
              </Link>
              <Link to="/shop?category=Classic" className="btn btn-secondary hero-btn">
                CLASSIC TIMEPIECES
              </Link>
            </div>

            <div className="hero-metrics">
              <div className="hero-metric-item">
                <span className="hero-metric-number">-2/+2s</span>
                <span className="hero-metric-label">Superlative Precision</span>
              </div>
              <div className="hero-metric-divider" />
              <div className="hero-metric-item">
                <span className="hero-metric-number">904L</span>
                <span className="hero-metric-label">Oystersteel Alloy</span>
              </div>
              <div className="hero-metric-divider" />
              <div className="hero-metric-item">
                <span className="hero-metric-number">5-Year</span>
                <span className="hero-metric-label">Geneva Guarantee</span>
              </div>
            </div>
          </div>

          <div className="hero-media-wrapper">
            <div className="hero-image-frame">
              <img
                src="/watch10.jpg"
                alt="Rolex Submariner Oystersteel Campaign"
                className="hero-image"
              />
              <div className="hero-floating-card">
                <span className="hero-floating-brand">ROLLEX</span>
                <span className="hero-floating-name">Submariner Date 41mm</span>
                <span className="hero-floating-price">$10,250.00</span>
                <Link to="/product/1" className="hero-floating-link">
                  VIEW TIMEPIECE →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTION */}
      <section className="section-featured">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-label">CURATED SELECTION</span>
              <h2 className="section-heading">Featured Watches</h2>
              <p className="section-subheading">Exceptional timepieces, carefully selected.</p>
            </div>
            <Link to="/shop" className="section-header-link">
              <span>EXPLORE ALL</span>
              <LuArrowRight size={14} />
            </Link>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="section-categories">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-label">HOROLOGICAL DISCIPLINES</span>
            <h2 className="section-heading">Shop by Category</h2>
            <p className="section-subheading">
              From underwater exploration to black-tie galas, find the complication matching your ambition.
            </p>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. BRANDS SECTION */}
      <BrandsSection />

      {/* 5. NEW ARRIVALS */}
      <section className="section-new-arrivals">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-label">FRESHLY ALLOCATED</span>
              <h2 className="section-heading">New Arrivals</h2>
              <p className="section-subheading">Recent acquisitions from our private collector network.</p>
            </div>
            <Link to="/shop?filter=new" className="section-header-link">
              <span>VIEW RECENT ARRIVALS</span>
              <LuArrowRight size={14} />
            </Link>
          </div>

          <div className="product-grid">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL / STORY SECTION */}
      <StorySection />

      {/* 7. NEWSLETTER */}
      <Newsletter />
    </div>
  );
};

export default Home;
