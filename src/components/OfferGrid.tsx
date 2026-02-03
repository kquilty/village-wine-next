"use client";
import { useState, useEffect, useRef } from 'react';

export default function OfferGrid() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const offersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add animate-in class after mount
    if (offersRef.current) {
      const cards = offersRef.current.querySelectorAll('.offer-card');
      cards.forEach((card) => {
        card.classList.add('animate-in');
      });
    }
  }, []);

  return (
    <>
      <div className="offers-section">
        <h2>Year-Round Offers & Services</h2>
        <div className="offers-grid" ref={offersRef}>
          {/* Clickable Rewards Card */}
          <div 
            className="offer-card clickable" 
            id="rewards-card"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="offer-icon">💎</div>
            <h3>Rewards Program</h3>
            <p>Ask about our rewards program and start earning benefits on every purchase!</p>
          </div>
          
          <div className="offer-card">
            <div className="offer-icon">📦</div>
            <h3>Case Discounts</h3>
            <p>
              <span className="offer-highlight">15% off</span> full cases<br/>
              <span className="offer-highlight">5% off</span> half cases
            </p>
          </div>
          
          <div className="offer-card">
            <div className="offer-icon">🎁</div>
            <h3>Custom Packages</h3>
            <p>Wedding and party packages available with custom labels to make your event special.</p>
          </div>
        </div>
      </div>

      {/* MODAL OVERLAY */}
      <div 
        className={`modal-overlay ${isModalOpen ? 'active' : ''}`} 
        onClick={() => setIsModalOpen(false)}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
          <h2>Rewards Program</h2>
          <p>More info coming soon!</p>
        </div>
      </div>
    </>
  );
}