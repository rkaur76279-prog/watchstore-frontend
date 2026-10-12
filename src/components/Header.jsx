import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import { LuShoppingBag, LuHeart, LuUser, LuMenu, LuX, LuCrown } from 'react-icons/lu';
import { Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import AccountModal from './AccountModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const location = useLocation();

  // Close drawers when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  // Sticky header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: "All Watches", path: "/shop" },
    { label: "My Orders", path: "/orders" },
    { label: "Submariner", path: "/shop?collection=Submariner" },
    { label: "Daytona", path: "/shop?collection=Daytona" },
    { label: "GMT-Master II", path: "/shop?collection=GMT-Master%20II" },
    { label: "Datejust", path: "/shop?collection=Datejust" },
    { label: "Day-Date", path: "/shop?collection=Day-Date" },
    { label: "Professional", path: "/shop?category=Professional" },
    { label: "Classic", path: "/shop?category=Classic" },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span className="announcement-item announcement-item--primary">COMPLIMENTARY INSURED WORLDWIDE DELIVERY</span>
          <span className="announcement-separator">•</span>
          <span className="announcement-item">SUPERLATIVE CHRONOMETER CERTIFIED</span>
          <span className="announcement-separator">•</span>
          <span className="announcement-item">6-YEAR INTERNATIONAL GUARANTEE</span>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className={`header-wrapper ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container header-main">
          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>

          {/* Left: Brand Logo */}
          <div className="header-logo-container">
            <Link to="/" className="brand-logo" aria-label="HOROLOGY Home">
              ROLLEX
            </Link>
          </div>

          {/* Center: Desktop Search Bar */}
          <div className="header-search-container">
            <SearchBar />
          </div>

          {/* Right: Actions */}
          <div className="header-actions">
            {/* Mobile Search Icon */}
            <button
              className="action-btn mobile-search-btn"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Search"
            >
              <IoIosSearch size={22} />
            </button>

            {/* My Orders Direct Icon Link */}
            <Link
              to="/orders"
              className="action-btn"
              aria-label="My Orders"
              title="My Orders & Tracking"
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <Package size={20} />
            </Link>

            {/* Account Icon / VIP Badge */}
            <Link
              to="/auth"
              className="action-btn header-account-btn"
              aria-label="Client Privilege Account"
              title={user ? `Privilege Client: ${user.name}` : "Sign In or Register"}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              {user ? (
                <span className="header-vip-badge">
                  <LuCrown size={13} />
                  <span className="header-vip-name">{user.name.split(' ')[0]}</span>
                </span>
              ) : (
                <LuUser size={20} />
              )}
            </Link>

            {/* Wishlist Icon */}
            <button
              className="action-btn"
              onClick={() => setIsWishlistOpen(true)}
              aria-label={`Wishlist with ${wishlistCount} items`}
              title="Wishlist"
            >
              <LuHeart size={20} />
              {wishlistCount > 0 && (
                <span className="action-badge wishlist-badge">{wishlistCount}</span>
              )}
            </button>

            {/* Shopping Bag Icon */}
            <button
              className="action-btn cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping Bag with ${cartCount} items`}
              title="Shopping Bag"
            >
              <LuShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="action-badge cart-badge">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer (expands when clicked) */}
        {isMobileSearchOpen && (
          <div className="mobile-search-dropdown container">
            <SearchBar
              isOpenMobile={true}
              onCloseMobile={() => setIsMobileSearchOpen(false)}
            />
          </div>
        )}

        {/* Sub-navigation bar */}
        <nav className="header-subnav" aria-label="Main Navigation">
          <div className="container subnav-container">
            <ul className="subnav-list">
              {navLinks.map((link) => (
                <li key={link.label} className="subnav-item">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `subnav-link ${isActive ? 'active' : ''} ${link.highlight ? 'link-sale' : ''}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <>
          <div
            className="drawer-backdrop active"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="mobile-nav-drawer active">
            <div className="mobile-nav-header">
              <span className="brand-logo">ROLLEX</span>
              <button
                className="btn-icon"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <LuX size={22} />
              </button>
            </div>

            <div className="mobile-nav-search">
              <SearchBar onCloseMobile={() => setIsMobileMenuOpen(false)} />
            </div>

            <ul className="mobile-nav-links">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mobile-nav-item"
                  >
                    <span>{link.label}</span>
                    <span className="mobile-nav-arrow">→</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mobile-nav-footer">
              <Link
                to="/orders"
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderColor: 'rgba(198, 161, 91, 0.4)',
                  color: '#C6A15B',
                  background: 'rgba(198, 161, 91, 0.08)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Package size={15} />
                <span>MY ORDERS & TRACKING</span>
              </Link>
              <Link
                to="/auth"
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LuCrown size={15} />
                <span>{user ? `CLIENT DOSSIER (${user.name.split(' ')[0]})` : 'CLIENT PRIVILEGE / SIGN IN'}</span>
              </Link>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', marginBottom: '12px' }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsWishlistOpen(true);
                }}
              >
                SAVED PIECES ({wishlistCount})
              </button>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
              >
                VIEW SHOPPING BAG ({cartCount})
              </button>
            </div>
          </div>
        </>
      )}

      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />
    </>
  );
};

export default Header;
