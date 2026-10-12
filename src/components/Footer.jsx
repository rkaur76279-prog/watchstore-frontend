import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoLogoInstagram, IoLogoTwitter, IoLogoYoutube } from 'react-icons/io';
import { LuShieldCheck, LuGlobe, LuMail } from 'react-icons/lu';
import SubscribeModal from './SubscribeModal';

const Footer = () => {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  return (
    <>
      <footer className="footer-wrapper">
      <div className="container">
        {/* Value propositions banner above footer columns */}
        <div className="footer-trust-grid">
          <div className="footer-trust-item">
            <LuShieldCheck size={22} color="#C6A15B" />
            <div>
              <strong>100% Certified Authenticity</strong>
              <p>Every movement inspected by master Swiss horologists.</p>
            </div>
          </div>
          <div className="footer-trust-item">
            <LuGlobe size={22} color="#C6A15B" />
            <div>
              <strong>Insured Armored Courier</strong>
              <p>Complimentary door-to-door express delivery worldwide.</p>
            </div>
          </div>
          <div className="footer-trust-item">
            <span className="trust-custom-icon">5Y</span>
            <div>
              <strong>5-Year International Warranty</strong>
              <p>Comprehensive mechanical guarantee & servicing support.</p>
            </div>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="footer-main-grid">
          {/* Brand summary */}
          <div className="footer-col footer-col-brand">
            <Link to="/" className="brand-logo footer-logo">
              ROLLEX
            </Link>
            <p className="footer-brand-desc">
              Curator of exceptional Rolex Superlative Chronometer timepieces, Oyster architecture, and iconic professional models for discerning collectors worldwide.
            </p>
            <div className="footer-social-links">
              <a href="#instagram" aria-label="Instagram" className="footer-social-btn">
                <IoLogoInstagram size={18} />
              </a>
              <a href="#twitter" aria-label="Twitter" className="footer-social-btn">
                <IoLogoTwitter size={18} />
              </a>
              <a href="#youtube" aria-label="YouTube" className="footer-social-btn">
                <IoLogoYoutube size={18} />
              </a>
            </div>

            {/* Subscribe CTA */}
            <button
              id="footer-subscribe-btn"
              onClick={() => setIsSubscribeOpen(true)}
              className="footer-subscribe-btn"
              aria-label="Subscribe to private dispatch"
            >
              <LuMail size={14} />
              <span>PRIVATE DISPATCH</span>
            </button>
          </div>

          {/* SHOP */}
          <div className="footer-col">
            <h4 className="footer-col-title">COLLECTIONS</h4>
            <ul className="footer-links-list">
              <li><Link to="/shop?collection=Submariner">Submariner</Link></li>
              <li><Link to="/shop?collection=Daytona">Cosmograph Daytona</Link></li>
              <li><Link to="/shop?collection=GMT-Master%20II">GMT-Master II</Link></li>
              <li><Link to="/shop?collection=Datejust">Datejust</Link></li>
              <li><Link to="/shop?collection=Day-Date">Day-Date President</Link></li>
              <li><Link to="/shop?collection=Oyster%20Perpetual">Oyster Perpetual</Link></li>
            </ul>
          </div>

          {/* ABOUT */}
          <div className="footer-col">
            <h4 className="footer-col-title">MANUFACTURE</h4>
            <ul className="footer-links-list">
              <li><Link to="/shop">The Oyster Story</Link></li>
              <li><Link to="/shop">Superlative Chronometer</Link></li>
              <li><Link to="/shop">Geneva Foundry & Gold</Link></li>
              <li><Link to="/shop">Cerachrom Innovation</Link></li>
              <li><Link to="/shop">Servicing & Guarantees</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div className="footer-col">
            <h4 className="footer-col-title">SERVICES</h4>
            <ul className="footer-links-list">
              <li><Link to="/shop">Complimentary Shipping</Link></li>
              <li><Link to="/shop">Returns & Authenticity</Link></li>
              <li><Link to="/shop">Oyster Clasp Size Guide</Link></li>
              <li><Link to="/shop">Official Care Guide</Link></li>
              <li><Link to="/shop">Client FAQs</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div className="footer-col">
            <h4 className="footer-col-title">LEGAL</h4>
            <ul className="footer-links-list">
              <li><Link to="/shop">Privacy Policy</Link></li>
              <li><Link to="/shop">Terms of Service</Link></li>
              <li><Link to="/shop">Authenticity Guarantee</Link></li>
              <li><Link to="/shop">Cookie Settings</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} ROLLEX GENEVA S.A. ALL RIGHTS RESERVED.
          </div>
          <div className="footer-currency-region">
            <span>CURRENCY: USD ($)</span>
            <span className="separator">•</span>
            <span>SHIPPING: WORLDWIDE</span>
          </div>
        </div>
      </div>
    </footer>

    <SubscribeModal
      isOpen={isSubscribeOpen}
      onClose={() => setIsSubscribeOpen(false)}
    />
  </>);
};

export default Footer;
