"use client";

import { useEffect, useRef } from "react";
import { promotions } from "@/lib/promotions";

export default function Promotions() {
    const promotionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (promotions.length === 0) {
            return;
        }

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
            const items = promotionsRef.current.querySelectorAll(".offer-card");
            items.forEach((item) => observer.observe(item));
        }

        return () => observer.disconnect();
    }, []);

    if (promotions.length === 0) {
        return null;
    }

    const promotionsGridClassName = promotions.length < 3
        ? "offers-grid offers-grid--centered"
        : "offers-grid";

    return (
        <div className="promotions-container" id="promotions" ref={promotionsRef}>
            <h3 className="section-title" id="promotions-title">Limited-Time Promotions</h3>
            <div className={promotionsGridClassName}>
                {promotions.map((promotion) => (
                    <div key={promotion.id} className="offer-card">
                        {promotion.icon ? (
                            <div className="offer-icon">{promotion.icon}</div>
                        ) : null}
                        <h3>{promotion.title}</h3>
                        <p className="promotions-date">{promotion.dateRange}</p>
                        <p>{promotion.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
