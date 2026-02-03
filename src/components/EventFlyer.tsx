"use client";
import { useEffect, useRef } from 'react';

export default function EventFlyer() {
  const flyerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add animate-in class after mount
    if (flyerRef.current) {
      flyerRef.current.classList.add('animate-in');
    }
  }, []);

  return (
    <div className="event-flyer-container" ref={flyerRef}>
      <img 
        src="/event-flyer-2026-02-13.png" 
        alt="Special Event - February 13, 2026" 
        className="event-flyer-image"
      />
    </div>
  );
}
