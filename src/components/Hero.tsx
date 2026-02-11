export default function Hero() {
    return (
        <>
            <div className="hero-top">
                <img 
                    src="/village-was-logo-white-no_subtext.png" 
                    alt="Village Wine & Spirits Logo" 
                    className="logo" 
                />
            </div>

            <div className="hero-tagline">
                <p>Family-owned and operated since 2004</p>
            </div>
            <div className="hero-tagline">
                <p>(test branch)</p>
                {process.env.VERCEL_ENV                        ? <p>Vercel Environment: {process.env.VERCEL_ENV}</p> : <p>Vercel Environment: Not Set</p>}
                {process.env.APP_ENV                           ? <p>App Environment: {process.env.APP_ENV}</p> : <p>App Environment: Not Set</p>}
                {process.env.NODE_ENV                          ? <p>Node Environment: {process.env.NODE_ENV}</p> : <p>Node Environment: Not Set</p>}
            </div>

            <div className="seo-only">
                <h1>Village Wine & Spirits</h1>
                <p>Newark Valley</p>
            </div>

            {/* <div className="status-badge">Full Website Coming Soon</div> */}
        </>
    );
}