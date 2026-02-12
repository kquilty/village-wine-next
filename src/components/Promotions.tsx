"use client";

import { useEffect, useRef } from "react";

export default function Promotions() {
    const promotionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-in");
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (promotionsRef.current) {
            const items = promotionsRef.current.querySelectorAll(".event-item");
            items.forEach((item) => observer.observe(item));
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="promotions-container" ref={promotionsRef}>
            <h3 className="section-title">Current Promotions</h3>
            <div className="event-item promotions-item">
                <p className="promotions-placeholder">Check back soon for new promotions.</p>
            </div>
        </div>
    );
}
