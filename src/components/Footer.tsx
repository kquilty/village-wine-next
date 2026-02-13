export default function Footer() {
    return (
        <div className="contact-section">
            <div className="email-section" id="contact">
                <p className="email-section-title">Contact Management</p>
                <div className="email-list">
                    <a href="mailto:aleach@vwsnv.com" className="email-link">aleach@vwsnv.com</a>
                    <a href="mailto:cleach@vwsnv.com" className="email-link">cleach@vwsnv.com</a>
                    <a href="mailto:csimpson@vwsnv.com" className="email-link">csimpson@vwsnv.com</a>
                </div>
            </div>

            <div className="follow-section">
                <h3>Follow Us</h3>
                <a href="https://www.facebook.com/villagewinesandspiritsNV" target="_blank" rel="noopener" aria-label="Follow us on Facebook">
                    <img 
                        src="/facebook.png" 
                        alt="Facebook" 
                        style={{ width: "18px", height: "18px", verticalAlign: "middle", marginRight: "5px", opacity: 0.7 }} 
                    />
                    <span style={{ position: "relative", top: "2px" }}>facebook</span>
                </a>
            </div>

            <footer>
                © 2026 Village Wine and Spirits. All Rights Reserved.
                <a className="admin-link" href="/admin" aria-label="Admin">
                    •
                </a>
            </footer>
        </div>
    );
}