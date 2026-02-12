"use client";
import { useState, useEffect, useRef } from 'react';

export default function OfferGrid() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const offersRef = useRef<HTMLDivElement>(null);
    const offers = [
        {
            id: "rewards-card",
            icon: "💎",
            title: "Rewards Program",
            description: "Ask about our rewards program and start earning benefits on every purchase!",
            clickable: true,
        },
        {
            id: "case-discounts",
            icon: "📦",
            title: "Case Discounts",
            description: (
                <>
                    <span className="offer-highlight">15% off</span> full cases<br />
                    <span className="offer-highlight">5% off</span> half cases
                </>
            ),
        },
        {
            id: "custom-packages",
            icon: "🎁",
            title: "Custom Packages",
            description: "Wedding and party packages available with custom labels to make your event special.",
        },
    ];
    const offersGridClassName = offers.length < 3
        ? "offers-grid offers-grid--centered"
        : "offers-grid";

    useEffect(() => {
        // Intersection Observer for scroll-triggered animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (offersRef.current) {
            const cards = offersRef.current.querySelectorAll('.offer-card');
            cards.forEach((card) => {
                observer.observe(card);
            });
        }

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div className="offers-section">
                <h2>Year-Round Offers & Services</h2>
                <div className={offersGridClassName} ref={offersRef}>
                    {offers.map((offer) => {
                        const isClickable = Boolean(offer.clickable);
                        return (
                            <div
                                key={offer.id}
                                className={`offer-card${isClickable ? " clickable" : ""}`}
                                id={offer.id}
                                onClick={isClickable ? () => setIsModalOpen(true) : undefined}
                            >
                                <div className="offer-icon">{offer.icon}</div>
                                <h3>{offer.title}</h3>
                                <p>{offer.description}</p>
                            </div>
                        );
                    })}
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