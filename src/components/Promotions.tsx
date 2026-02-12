"use client";

import { useEffect, useRef } from "react";

interface PromotionItem {
    id: number;
    title: string;
    description: string;
    icon?: string;
}

const promotions: PromotionItem[] = [
    {
        id: 1,
        title: "Winter Wine Bundle",
        description: "Mix-and-match any 6 bottles for 10% off.",
        icon: "🍷",
    },
    {
        id: 2,
        title: "Whiskey Weekend",
        description: "Save $5 on select local bourbons this weekend.",
        icon: "🥃",
    },
    {
        id: 3,
        title: "Charcuterie Pairing",
        description: "Grab a board and get 15% off any featured red.",
        icon: "🧀",
    },
];

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
        <div className="promotions-container" ref={promotionsRef}>
            <h3 className="section-title">Current Promotions</h3>
            <div className={promotionsGridClassName}>
                {promotions.map((promotion) => (
                    <div key={promotion.id} className="offer-card">
                        {promotion.icon ? (
                            <div className="offer-icon">{promotion.icon}</div>
                        ) : null}
                        <h3>{promotion.title}</h3>
                        <p>{promotion.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
