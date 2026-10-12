import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosSearch, IoIosClose } from 'react-icons/io';
import { products } from '../data/products';

const SearchBar = ({ isOpenMobile, onCloseMobile }) => {
  const [query, setQuery] = useState('');
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        (p.collection && p.collection.toLowerCase().includes(query.toLowerCase())) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.dialColor.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (productId) => {
    setIsOpenDropdown(false);
    setQuery('');
    if (onCloseMobile) onCloseMobile();
    navigate(`/product/${productId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpenDropdown(false);
      if (onCloseMobile) onCloseMobile();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={`search-bar-wrapper ${isOpenMobile ? 'mobile-active' : ''}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <IoIosSearch className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpenDropdown(true);
          }}
          onFocus={() => setIsOpenDropdown(true)}
          placeholder="Search Submariner, Daytona, Datejust, GMT-Master..."
          className="search-input"
          aria-label="Search Rolex watches"
        />
        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <IoIosClose />
          </button>
        )}
      </form>

      {/* Auto-suggest dropdown */}
      {isOpenDropdown && query.trim().length > 0 && (
        <div className="search-dropdown">
          {results.length > 0 ? (
            <>
              <div className="search-dropdown-header">
                Matching Timepieces ({results.length})
              </div>
              <ul className="search-results-list">
                {results.map((product) => (
                  <li
                    key={product.id}
                    className="search-result-item"
                    onClick={() => handleSelectProduct(product.id)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="search-result-thumb"
                    />
                    <div className="search-result-info">
                      <span className="search-result-brand">{product.brand}</span>
                      <span className="search-result-name">{product.name}</span>
                      <span className="search-result-price">${product.price.toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="search-dropdown-view-all"
                onClick={handleSubmit}
              >
                View all results for "{query}" →
              </button>
            </>
          ) : (
            <div className="search-no-results">
              No timepieces found matching "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
