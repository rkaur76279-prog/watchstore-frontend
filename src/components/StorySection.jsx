import React, { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { LuAward, LuCompass, LuSparkles } from 'react-icons/lu';

const StorySection = () => {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  return (
    <section className="story-section">
      <div className="container">
        <div className="story-grid">
          <div className="story-media-column">
            <div className="story-image-wrap">
              <img
                src="/watch5.webp"
                alt="The Art of Watchmaking"
                className="story-main-image"
                loading="lazy"
              />
              <div className="story-badge-floating">
                <span className="story-badge-year">GENEVA MANUFACTURE</span>
                <span className="story-badge-text">Superlative Chronometer (-2/+2s/day)</span>
              </div>
            </div>
          </div>

          <div className="story-content-column">
            <span className="section-label">PERPETUAL EXCELLENCE</span>
            <h2 className="story-title">THE ART OF THE OYSTER</h2>
            <p className="story-lead">
              In 1926, the creation of the Oyster — the world's first waterproof wristwatch — marked a turning point in horology. In 1931, the invention of the self-winding Perpetual rotor mechanism gave life to modern automatic watchmaking.
            </p>
            <p className="story-body">
              Every timepiece forged in our Geneva manufacture is an alliance of superlative technical innovation and aesthetic nobility. From 904L Oystersteel and proprietary 18ct Everose gold to virtually indestructible Cerachrom ceramic bezels, every component is developed and tested to the most exacting standards on Earth.
            </p>

            <div className="story-pillars">
              <div className="story-pillar-item">
                <LuAward className="story-pillar-icon" />
                <div>
                  <strong>Superlative Chronometer</strong>
                  <p>Certified to -2/+2 seconds per day after casing — twice the COSC standard.</p>
                </div>
              </div>
              <div className="story-pillar-item">
                <LuCompass className="story-pillar-icon" />
                <div>
                  <strong>904L Oystersteel & Gold Foundry</strong>
                  <p>In-house foundry crafting exceptional gold alloys with perpetual luster.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary story-cta-btn"
              onClick={() => setIsStoryModalOpen(true)}
            >
              DISCOVER OUR STORY
            </button>
          </div>
        </div>
      </div>

      {/* Story Modal */}
      {isStoryModalOpen && (
        <>
          <div className="drawer-backdrop active" onClick={() => setIsStoryModalOpen(false)} />
          <div className="story-modal">
            <button
              className="story-modal-close"
              onClick={() => setIsStoryModalOpen(false)}
              aria-label="Close story modal"
            >
              <IoIosClose size={28} />
            </button>
            <div className="story-modal-inner">
              <div className="story-modal-tag">THE ROLLEX HERITAGE</div>
              <h2 className="story-modal-title">A Tradition of Invariable Perfection</h2>
              <div className="story-modal-text">
                <p>
                  Founded by Hans Wilsdorf with a visionary ambition, the manufacture pioneered wristwatch chronometric precision, securing the world's first official wristwatch chronometer rating from the Official Watch Rating Centre in Bienne in 1910.
                </p>
                <p>
                  From Mercedes Gleitze swimming the English Channel with an Oyster in 1927 to Sir Malcolm Campbell breaking land speed records and Jacques Piccard descending to the Mariana Trench, our timepieces have conquered every hostile frontier known to humankind.
                </p>
                <p>
                  Today, every Superlative Chronometer leaving our ateliers in Geneva, Biel, Plan-les-Ouates, and Chêne-Bourg carries the green seal — a guarantee of unsurpassed chronometric performance, waterproofness, self-winding autonomy, and enduring elegance.
                </p>
              </div>
              <div className="story-modal-signature">
                <span className="signature-font">ROLLEX Geneva</span>
                <span className="signature-sub">Geneva • Switzerland</span>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default StorySection;
