import React, { useState } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import SubscribeModal from './SubscribeModal';

const Newsletter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-box">
            <div className="newsletter-header">
              <span className="section-label">PRIVATE DISPATCH</span>
              <h2 className="newsletter-title">Stay on time.</h2>
              <p className="newsletter-subtitle">
                Sign up for new arrivals, exclusive collections and watch stories.
              </p>
            </div>

            <div className="newsletter-form">
              <div className="newsletter-input-wrap">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  className="newsletter-input"
                  aria-label="Email address preview"
                  readOnly
                  onFocus={() => setIsModalOpen(true)}
                  onClick={() => setIsModalOpen(true)}
                  style={{ cursor: 'pointer' }}
                />
                <button
                  id="newsletter-subscribe-btn"
                  type="button"
                  className="btn btn-primary newsletter-btn"
                  aria-label="Subscribe to newsletter"
                  onClick={() => setIsModalOpen(true)}
                >
                  <span>SUBSCRIBE</span>
                  <LuArrowRight size={14} />
                </button>
              </div>
            </div>

            <p className="newsletter-disclaimer">
              We honor your privacy. Unsubscribe at any time with a single click.
            </p>
          </div>
        </div>
      </section>

      <SubscribeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Newsletter;
