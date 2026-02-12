"use client"; // Required because we use browser logic (Date)
import { useEffect, useRef } from 'react';

export default function InfoGrid() {
    const currentDay = getEasternDayIndex(); // 0 = Sunday, 1 = Monday...
    const cardsRef = useRef<HTMLDivElement>(null);

    // Helper to check if it's today
    const isToday = (dayIndex: number) => currentDay === dayIndex ? "today" : "";

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

        if (cardsRef.current) {
            const cards = cardsRef.current.querySelectorAll('.info-card');
            cards.forEach((card) => {
                observer.observe(card);
            });
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="info-grid" ref={cardsRef}>
            <div className="info-card contact-card" id="phone">
                <h3>Visit Us or Call</h3>
                <div className="phone-link-wrapper">
                    <a className="phone-link" href="tel:6076428836">(607) 642-8836</a>
                </div>
                <div id="address" style={{ textAlign: "center" }}>
                    <p className="contact-address" style={{ textAlign: "center" }}>20 South Main Street</p>
                    <p className="contact-address" style={{ textAlign: "center" }}>Newark Valley, NY 13811</p>
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
                </div>
            </div>

            {/* Hours Card with Dynamic Highlighting */}
            <div className="info-card hours-card" id="hours" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3>Hours</h3>
                <div>
                    <p data-day className={isToday(1)}><span style={{ display: "inline-block", width: "110px" }}>Monday:</span> 10am - 8pm</p>
                    <p data-day className={isToday(2)}><span style={{ display: "inline-block", width: "110px" }}>Tuesday:</span> 10am - 8pm</p>
                    <p data-day className={isToday(3)}><span style={{ display: "inline-block", width: "110px" }}>Wednesday:</span> 10am - 8pm</p>
                    <p data-day className={isToday(4)}><span style={{ display: "inline-block", width: "110px" }}>Thursday:</span> 10am - 8pm</p>
                    <p data-day className={isToday(5)}><span style={{ display: "inline-block", width: "110px" }}>Friday:</span> 10am - 8pm</p>
                    <p data-day className={isToday(6)}><span style={{ display: "inline-block", width: "110px" }}>Saturday:</span> 10am - 8pm</p>
                    <p data-day className={isToday(0)}><span style={{ display: "inline-block", width: "110px" }}>Sunday:</span> 12pm - 6pm</p>
                </div>
            </div>
        </div>
    );
}

function getEasternDayIndex() {
    const weekday = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        weekday: "short",
    }).format(new Date());

    const weekdayMap: Record<string, number> = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
    };

    return weekdayMap[weekday] ?? new Date().getDay();
}