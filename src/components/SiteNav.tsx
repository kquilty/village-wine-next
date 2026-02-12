"use client";

import { useMemo, useState } from "react";

interface SiteNavProps {
    hasPromotions: boolean;
}

export default function SiteNav({ hasPromotions }: SiteNavProps) {
    const [isOpen, setIsOpen] = useState(false);

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

    return (
        <header className="site-nav">
            <div className="nav-inner">
                <a className="nav-logo" href="#top" aria-label="Village Wine and Spirits">
                    <img
                        src="/white-logo-real-grapes2.png"
                        alt="Village Wine & Spirits Logo"
                    />
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
