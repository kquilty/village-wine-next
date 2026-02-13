"use client";

import { useEffect, useMemo, useState } from "react";

interface SiteNavProps {
    hasPromotions: boolean;
}

export default function SiteNav({ hasPromotions }: SiteNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showTitle, setShowTitle] = useState(false);

    const navLinks = useMemo(() => {
        const baseLinks = [
            { href: "#phone", label: "Phone" },
            { href: "#address", label: "Directions" },
            { href: "#hours", label: "Hours" },
            { href: "#events", label: "Events" },
            { href: "#offers", label: "Offers" },
            { href: "#contact", label: "Contact" },
        ];

        if (!hasPromotions) {
            return baseLinks;
        }

        return [
            { href: "#phone", label: "Phone" },
            { href: "#address", label: "Directions" },
            { href: "#hours", label: "Hours" },
            { href: "#events", label: "Events" },
            { href: "#promotions", label: "Promotions" },
            { href: "#offers", label: "Offers" },
            { href: "#contact", label: "Contact" },
        ];
    }, [hasPromotions]);

    const handleToggle = () => setIsOpen((open) => !open);
    const handleLinkClick = () => setIsOpen(false);

    useEffect(() => {
        const updateScrollState = () => {
            setIsScrolled(window.scrollY > 8);

            const heroLogo = document.getElementById("hero-logo");
            if (!heroLogo) {
                return;
            }

            const logoRect = heroLogo.getBoundingClientRect();
            setShowTitle(logoRect.bottom <= 0);
        };

        updateScrollState();
        window.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateScrollState);

        return () => {
            window.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, []);

    useEffect(() => {
        document.body.classList.toggle("nav-open", isOpen);

        return () => {
            document.body.classList.remove("nav-open");
        };
    }, [isOpen]);

    return (
        <header className={`site-nav${isScrolled ? " scrolled" : ""}`}>
            <div className="nav-inner">
                <a className={`nav-logo${showTitle ? " visible" : ""}`} href="#top" aria-label="Village Wine and Spirits">
                    Village Wine & Spirits
                </a>
                <nav className="nav-links" aria-label="Primary">
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href} className="nav-link">
                            {link.label}
                        </a>
                    ))}
                </nav>
                <button
                    className="nav-toggle"
                    type="button"
                    aria-label="Toggle navigation"
                    aria-expanded={isOpen}
                    onClick={handleToggle}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>
            {isOpen ? (
                <button
                    className="nav-backdrop"
                    type="button"
                    aria-label="Close navigation"
                    onClick={handleLinkClick}
                />
            ) : null}
            <nav className={`nav-menu${isOpen ? " open" : ""}`} aria-label="Mobile">
                {navLinks.map((link) => (
                    <a key={link.href} href={link.href} className="nav-link" onClick={handleLinkClick}>
                        {link.label}
                    </a>
                ))}
            </nav>
        </header>
    );
}
