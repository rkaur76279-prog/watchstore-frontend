import React, { useState } from 'react';
import { LuChevronDown, LuX, LuRotateCcw } from 'react-icons/lu';

const FilterSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
  isMobileOpen,
  onCloseMobile
}) => {
  // Collapsible state for each filter section
  const [openSections, setOpenSections] = useState({
    collection: true,
    price: true,
    gender: true,
    movement: false,
    caseSize: false,
    strap: false,
    dialColor: false,
    waterResistance: false
  });

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleCheckboxToggle = (filterKey, value) => {
    const current = filters[filterKey] || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    onFilterChange(filterKey, updated);
  };

  const collections = [
    "Submariner",
    "Daytona",
    "GMT-Master II",
    "Datejust",
    "Day-Date",
    "Oyster Perpetual",
    "Yacht-Master",
    "Explorer",
    "Sea-Dweller",
    "Sky-Dweller",
    "1908"
  ];

  const priceRanges = [
    { label: "Under ₹10,000", min: 0, max: 10000, id: "p1" },
    { label: "₹10,000 – ₹15,000", min: 10000, max: 15000, id: "p2" },
    { label: "₹15,000 – ₹25,000", min: 15000, max: 25000, id: "p3" },
    { label: "Over ₹25,000", min: 25000, max: 200000, id: "p4" }
  ];
  const genders = ["Men", "Women", "Unisex"];
  const movements = ["Automatic"];
  const caseSizes = ["28mm", "36mm", "39mm", "40mm", "41mm", "42mm", "44mm"];
  const straps = [
    "Oystersteel Bracelet",
    "Jubilee Stainless Steel",
    "President Semi-Circular",
    "Oysterflex High-Performance Rubber",
    "Alligator Leather"
  ];
  const colors = [
    "Cerachrom Black",
    "White Panda Dial",
    "Pepsi (Red/Blue)",
    "Olive Palm Motif",
    "Sundust Roman Dial",
    "Celebration Motif",
    "Polar White",
    "Bright Blue Sunray",
    "D-Blue Gradient"
  ];
  const waterResistances = ["50m", "100m", "300m", "3900m"];

  // Count how many active filters there are
  const activeFiltersCount = Object.keys(filters).reduce((acc, key) => {
    return acc + (Array.isArray(filters[key]) ? filters[key].length : 0);
  }, 0);

  const sidebarContent = (
    <div className="filter-sidebar-inner">
      <div className="filter-sidebar-header">
        <div className="filter-header-left">
          <span className="filter-title">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="badge badge-dark">{activeFiltersCount} active</span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={onResetFilters}
          >
            <LuRotateCcw size={12} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Collection Filter */}
      <div className="filter-group">
        <button
          type="button"
          className="filter-group-title"
          onClick={() => toggleSection('collection')}
        >
          <span>Collection</span>
          <LuChevronDown className={`filter-icon ${openSections.collection ? 'open' : ''}`} />
        </button>
        {openSections.collection && (
          <div className="filter-options-list">
            {collections.map(col => (
              <label key={col} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={(filters.collection || []).includes(col)}
                  onChange={() => handleCheckboxToggle('collection', col)}
                  className="filter-checkbox"
                />
                <span className="filter-option-name">{col}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <button
          type="button"
          className="filter-group-title"
          onClick={() => toggleSection('price')}
        >
          <span>Price</span>
          <LuChevronDown className={`filter-icon ${openSections.price ? 'open' : ''}`} />
        </button>
        {openSections.price && (
          <div className="filter-options-list">
            {priceRanges.map(range => (
              <label key={range.id} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={(filters.priceRanges || []).includes(range.id)}
                  onChange={() => handleCheckboxToggle('priceRanges', range.id)}
                  className="filter-checkbox"
                />
                <span className="filter-option-name">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Gender Filter */}
      <div className="filter-group">
        <button
          type="button"
          className="filter-group-title"
          onClick={() => toggleSection('gender')}
        >
          <span>Gender</span>
          <LuChevronDown className={`filter-icon ${openSections.gender ? 'open' : ''}`} />
        </button>
        {openSections.gender && (
          <div className="filter-options-list">
            {genders.map(gender => (
              <label key={gender} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={(filters.gender || []).includes(gender)}
                  onChange={() => handleCheckboxToggle('gender', gender)}
                  className="filter-checkbox"
                />
                <span className="filter-option-name">{gender}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Movement Filter */}
      <div className="filter-group">
        <button
          type="button"
          className="filter-group-title"
          onClick={() => toggleSection('movement')}
        >
          <span>Movement</span>
          <LuChevronDown className={`filter-icon ${openSections.movement ? 'open' : ''}`} />
        </button>
        {openSections.movement && (
          <div className="filter-options-list">
            {movements.map(mov => (
              <label key={mov} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={(filters.movement || []).includes(mov)}
                  onChange={() => handleCheckboxToggle('movement', mov)}
                  className="filter-checkbox"
                />
                <span className="filter-option-name">{mov}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Case Size Filter */}
      <div className="filter-group">
        <button
          type="button"
          className="filter-group-title"
          onClick={() => toggleSection('caseSize')}
        >
          <span>Case Size</span>
          <LuChevronDown className={`filter-icon ${openSections.caseSize ? 'open' : ''}`} />
        </button>
        {openSections.caseSize && (
          <div className="filter-options-list">
            {caseSizes.map(size => (
              <label key={size} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={(filters.caseSize || []).includes(size)}
                  onChange={() => handleCheckboxToggle('caseSize', size)}
                  className="filter-checkbox"
                />
                <span className="filter-option-name">{size}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Strap Material Filter */}
      <div className="filter-group">
        <button
          type="button"
          className="filter-group-title"
          onClick={() => toggleSection('strap')}
        >
          <span>Strap Material</span>
          <LuChevronDown className={`filter-icon ${openSections.strap ? 'open' : ''}`} />
        </button>
        {openSections.strap && (
          <div className="filter-options-list">
            {straps.map(strap => (
              <label key={strap} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={(filters.strap || []).includes(strap)}
                  onChange={() => handleCheckboxToggle('strap', strap)}
                  className="filter-checkbox"
                />
                <span className="filter-option-name">{strap}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Dial Color Filter */}
      <div className="filter-group">
        <button
          type="button"
          className="filter-group-title"
          onClick={() => toggleSection('dialColor')}
        >
          <span>Dial Color</span>
          <LuChevronDown className={`filter-icon ${openSections.dialColor ? 'open' : ''}`} />
        </button>
        {openSections.dialColor && (
          <div className="filter-options-list">
            {colors.map(color => (
              <label key={color} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={(filters.dialColor || []).includes(color)}
                  onChange={() => handleCheckboxToggle('dialColor', color)}
                  className="filter-checkbox"
                />
                <span className="filter-option-name">{color}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Water Resistance Filter */}
      <div className="filter-group">
        <button
          type="button"
          className="filter-group-title"
          onClick={() => toggleSection('waterResistance')}
        >
          <span>Water Resistance</span>
          <LuChevronDown className={`filter-icon ${openSections.waterResistance ? 'open' : ''}`} />
        </button>
        {openSections.waterResistance && (
          <div className="filter-options-list">
            {waterResistances.map(wr => (
              <label key={wr} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={(filters.waterResistance || []).includes(wr)}
                  onChange={() => handleCheckboxToggle('waterResistance', wr)}
                  className="filter-checkbox"
                />
                <span className="filter-option-name">{wr}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="filter-sidebar desktop-only">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div className="drawer-backdrop active" onClick={onCloseMobile} />
          <div className="filter-mobile-drawer active">
            <div className="filter-mobile-header">
              <span className="filter-mobile-title">Filters ({totalResults} results)</span>
              <button className="btn-icon" onClick={onCloseMobile} aria-label="Close filters">
                <LuX size={22} />
              </button>
            </div>
            <div className="filter-mobile-body">
              {sidebarContent}
            </div>
            <div className="filter-mobile-footer">
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={onCloseMobile}
              >
                APPLY FILTERS ({totalResults})
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FilterSidebar;
