import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { LuSlidersHorizontal, LuX } from 'react-icons/lu';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Filter state
  const [filters, setFilters] = useState({
    collection: [],
    brand: [],
    priceRanges: [],
    gender: [],
    movement: [],
    caseSize: [],
    strap: [],
    dialColor: [],
    waterResistance: []
  });

  // Read URL search query params on load
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    const collectionParam = searchParams.get('collection');
    const categoryParam = searchParams.get('category');
    const genderParam = searchParams.get('gender');
    const searchParam = searchParams.get('search');
    const filterParam = searchParams.get('filter');

    setFilters(prev => ({
      ...prev,
      collection: collectionParam ? [collectionParam] : [],
      brand: brandParam ? [brandParam.toUpperCase()] : [],
      gender: genderParam ? [genderParam] : [],
      movement: categoryParam === 'Automatic' ? ['Automatic'] : [],
      // Handle special category filters
      specialCategory: categoryParam || null,
      searchQuery: searchParam || '',
      isNewOnly: filterParam === 'new',
      isSaleOnly: filterParam === 'sale'
    }));
  }, [searchParams]);

  const handleFilterChange = (filterKey, values) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: values
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      collection: [],
      brand: [],
      priceRanges: [],
      gender: [],
      movement: [],
      caseSize: [],
      strap: [],
      dialColor: [],
      waterResistance: []
    });
    setSearchParams({});
  };

  const handleRemoveSingleFilter = (key, value) => {
    if (Array.isArray(filters[key])) {
      handleFilterChange(key, filters[key].filter(v => v !== value));
    }
  };

  // Filter and sort computation
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesQuery =
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          (product.collection && product.collection.toLowerCase().includes(q)) ||
          product.category.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. Collection
      if (filters.collection?.length > 0) {
        if (!filters.collection.includes(product.collection)) {
          return false;
        }
      }

      // 3. Special Category URL param
      if (filters.specialCategory) {
        if (product.category.toLowerCase() !== filters.specialCategory.toLowerCase()) {
          return false;
        }
      }

      // 4. New Only
      if (filters.isNewOnly && !product.isNew) {
        return false;
      }

      // 5. Sale Only
      if (filters.isSaleOnly && (!product.originalPrice || product.originalPrice <= product.price)) {
        return false;
      }

      // 6. Genders
      if (filters.gender?.length > 0) {
        if (!filters.gender.includes(product.gender) && product.gender !== "Unisex") {
          return false;
        }
      }

      // 7. Movements
      if (filters.movement?.length > 0) {
        if (!filters.movement.includes(product.movement)) {
          return false;
        }
      }

      // 8. Case Sizes
      if (filters.caseSize?.length > 0) {
        const matchesCase = filters.caseSize.some(size =>
          product.caseSize === size || (product.caseSizes && product.caseSizes.includes(size))
        );
        if (!matchesCase) return false;
      }

      // 9. Straps
      if (filters.strap?.length > 0) {
        const matchesStrap = filters.strap.some(s =>
          product.strap.toLowerCase().includes(s.toLowerCase()) ||
          (product.straps && product.straps.some(ps => ps.toLowerCase().includes(s.toLowerCase())))
        );
        if (!matchesStrap) return false;
      }

      // 10. Dial Color
      if (filters.dialColor?.length > 0) {
        const matchesColor = filters.dialColor.some(c =>
          product.dialColor.toLowerCase().includes(c.toLowerCase()) ||
          (product.colors && product.colors.some(pc => pc.name.toLowerCase().includes(c.toLowerCase())))
        );
        if (!matchesColor) return false;
      }

      // 11. Water Resistance
      if (filters.waterResistance?.length > 0) {
        if (!filters.waterResistance.includes(product.waterResistance)) {
          return false;
        }
      }

      // 12. Price Ranges
      if (filters.priceRanges?.length > 0) {
        const matchesPrice = filters.priceRanges.some(rangeId => {
          if (rangeId === "p1") return product.price < 10000;
          if (rangeId === "p2") return product.price >= 10000 && product.price <= 15000;
          if (rangeId === "p3") return product.price > 15000 && product.price <= 25000;
          if (rangeId === "p4") return product.price > 25000;
          return true;
        });
        if (!matchesPrice) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filters, sortBy]);

  // Aggregate active filter badges for quick removal
  const activeFilterPills = [];
  ['collection', 'gender', 'movement', 'caseSize', 'strap', 'dialColor', 'waterResistance'].forEach(key => {
    if (Array.isArray(filters[key])) {
      filters[key].forEach(val => {
        activeFilterPills.push({ key, label: val });
      });
    }
  });

  return (
    <div className="page-shop">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link to="/" className="breadcrumb-item">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">All Watches</span>
          {filters.specialCategory && (
            <>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{filters.specialCategory}</span>
            </>
          )}
        </nav>

        {/* Page Title & Count Header */}
        <div className="shop-header">
          <div className="shop-header-title-wrap">
            <h1 className="shop-title">
              {filters.specialCategory ? filters.specialCategory : "All Watches"}
            </h1>
            <span className="shop-product-count">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Timepiece' : 'Timepieces'}
            </span>
          </div>

          {/* Sort & Mobile Filter Toggle Controls */}
          <div className="shop-controls">
            <button
              type="button"
              className="btn btn-secondary mobile-filter-trigger"
              onClick={() => setIsMobileFilterOpen(true)}
              aria-label="Open filter sidebar"
            >
              <LuSlidersHorizontal size={14} />
              <span>Filters</span>
              {activeFilterPills.length > 0 && (
                <span className="badge badge-dark">{activeFilterPills.length}</span>
              )}
            </button>

            <div className="sort-dropdown-wrap">
              <label htmlFor="shop-sort-select" className="sort-label">Sort by:</label>
              <select
                id="shop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Acquisitions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Badges Row */}
        {activeFilterPills.length > 0 && (
          <div className="active-filters-row">
            <span className="active-filters-heading">Active:</span>
            <div className="active-filters-list">
              {activeFilterPills.map((pill, idx) => (
                <button
                  key={`${pill.key}-${pill.label}-${idx}`}
                  type="button"
                  className="active-filter-chip"
                  onClick={() => handleRemoveSingleFilter(pill.key, pill.label)}
                >
                  <span>{pill.label}</span>
                  <LuX size={12} />
                </button>
              ))}
              <button
                type="button"
                className="active-filters-clear-all"
                onClick={handleResetFilters}
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Main Catalog Layout */}
        <div className="shop-layout">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Product Grid Area */}
          <main className="shop-products-container">
            {filteredProducts.length === 0 ? (
              <div className="shop-empty-state">
                <h3>No timepieces match your active criteria</h3>
                <p>Try resetting some filters or searching for another brand or movement.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleResetFilters}
                  style={{ marginTop: '16px' }}
                >
                  RESET ALL FILTERS
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
