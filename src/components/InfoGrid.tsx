"use client"; // Required because we use browser logic (Date)
import { useEffect, useRef } from 'react';

export default function InfoGrid() {
  const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday...
  const cardsRef = useRef<HTMLDivElement>(null);

  // Helper to check if it's today
  const isToday = (dayIndex: number) => currentDay === dayIndex ? "today" : "";

  useEffect(() => {
    // Add animate-in class after mount
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.info-card');
      cards.forEach((card) => {
        card.classList.add('animate-in');
      });
    }
  }, []);

  return (
    <div className="info-grid" ref={cardsRef}>
      {/* Contact Card */}
      <div className="info-card contact-card">
        <h3>Visit Us or Call</h3>
        <p>20 South Main Street</p>
        <p style={{ marginTop: "-8px" }}>Newark Valley, NY 13811</p>
        
        <a 
          href="https://www.google.com/maps/search/?api=1&query=20+South+Main+Street+Newark+Valley+NY+13811" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="directions-link"
        >
          <img 
            src="/google-maps.png" 
            alt="Google Maps" 
            style={{ width: "20px", height: "20px", verticalAlign: "middle", marginRight: "5px" }} 
          />
          Get Directions
        </a>
        
        <div className="phone-link-wrapper">
          <p style={{ margin: 0 }}>Phone: <a className="phone-link" href="tel:6076428836">(607) 642-8836</a></p>
        </div>
      </div>

      {/* Hours Card with Dynamic Highlighting */}
      <div className="info-card">
        <h3>Hours</h3>
        <p data-day className={isToday(1)}><span style={{ display: "inline-block", width: "110px" }}>Monday:</span> 10am - 8pm</p>
        <p data-day className={isToday(2)}><span style={{ display: "inline-block", width: "110px" }}>Tuesday:</span> 10am - 8pm</p>
        <p data-day className={isToday(3)}><span style={{ display: "inline-block", width: "110px" }}>Wednesday:</span> 10am - 8pm</p>
        <p data-day className={isToday(4)}><span style={{ display: "inline-block", width: "110px" }}>Thursday:</span> 10am - 8pm</p>
        <p data-day className={isToday(5)}><span style={{ display: "inline-block", width: "110px" }}>Friday:</span> 10am - 8pm</p>
        <p data-day className={isToday(6)}><span style={{ display: "inline-block", width: "110px" }}>Saturday:</span> 10am - 8pm</p>
        <p data-day className={isToday(0)}><span style={{ display: "inline-block", width: "110px" }}>Sunday:</span> 12pm - 6pm</p>
      </div>
    </div>
  );
}