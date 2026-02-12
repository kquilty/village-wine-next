"use client";
import { useEffect, useRef, useState } from 'react';
import { getEventsFromDb, type DbEventItem } from '@/actions/events';

interface EventItem {
    id: number;
    month: string;
    day: string;
    title: string;
    time: string;
    desc: string;
    type: "special" | "weekly";
    flyer?: string;
    expiration?: string | Date; // Event expiration date (YYYY-MM-DD) or Date instance
}

// const events: EventItem[] = [
//     {
//         id: 1,
//         month: "FEB",
//         day: "13",
//         title: "Photo Booth & Candy Game",
//         time: "4:00 PM - 7:00 PM",
//         desc: "Join us for a photo booth, candy jar guessing contest, and our weekly tasting!",
//         type: "special",
//         flyer: "/event-flyer-2026-02-13.png",
//         expiration: "2026-02-14" // Event expires after Feb 13
//     },
//     {
//         id: 2,
//         month: "FEB",
//         day: "14",
//         title: "Valentine's Day Tasting",
//         time: "Front Counter",
//         desc: "Stop by our front counter for a special Valentine's Day tasting.",
//         type: "special",
//         expiration: "2026-02-15" // Event expires after Feb 14
//     },
//     {
//         id: 3,
//         month: "FRI",
//         day: "WK",
//         title: "Friday Night Tasting",
//         time: "4:00 PM - 7:00 PM",
//         desc: "Join us every Friday to sample our featured bottle of the week.",
//         type: "weekly"
//         // No expiration - recurring weekly event
//     }
// ];

export default function EventList() {
    const eventsRef = useRef<HTMLDivElement>(null);
    const [expandedFlyer, setExpandedFlyer] = useState<string | null>(null);
    const [events, setEvents] = useState<EventItem[]>([]);

    // Fetch events from database on component mount
    useEffect(() => {
        getEventsFromDb().then((dbEvents) => {
            // Map database fields to EventItem interface
            const mappedEvents: EventItem[] = dbEvents.map((dbEvent) => ({
                id: dbEvent.id,
                month: dbEvent.month,
                day: dbEvent.day,
                title: dbEvent.title,
                time: dbEvent.time,
                desc: dbEvent.description,
                type: dbEvent.type as "special" | "weekly",
                flyer: dbEvent.flyer_source || undefined,
                expiration: dbEvent.expiration_date || undefined
            }));
            setEvents(mappedEvents);

            console.log("Fetched events from database:", mappedEvents);
        });
    }, []);

    // Helper to check if event is still valid (not expired)
    const isEventValid = (event: EventItem) => {
        if (!event.expiration) return true; // No expiration means always valid
        const todayKey = getEasternDateKey();
        const expirationKey = normalizeExpirationKey(event.expiration);
        if (!expirationKey) return true;
        return todayKey < expirationKey;
    };

    // Filter out expired events
    const activeEvents = events.filter(isEventValid);

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

        if (eventsRef.current) {
            const items = eventsRef.current.querySelectorAll('.event-item');
            items.forEach((item) => {
                observer.observe(item);
            });
        }

        return () => observer.disconnect();
    }, [activeEvents.length]);

    if (activeEvents.length === 0) {
        return (

            <div className="events-container" ref={eventsRef}>
                <h3 className="section-title">Upcoming Events</h3>
                <p style={{ fontStyle: 'italic', color: '#888', textAlign: 'center' }}>No upcoming events at the moment.<br />Check back soon!</p>
                
                <div className="hero-tagline">
                    <p>(test branch)</p>
                    {process.env.VERCEL_ENV                        ? <p>Vercel Environment: {process.env.VERCEL_ENV}</p> : <p>Vercel Environment: Not Set</p>}
                    {process.env.APP_ENV                           ? <p>App Environment: {process.env.APP_ENV}</p> : <p>App Environment: Not Set</p>}
                    {process.env.NODE_ENV                          ? <p>Node Environment: {process.env.NODE_ENV}</p> : <p>Node Environment: Not Set</p>}
                    {process.env.DATABASE_URL                      ? <p>Database URL: {process.env.DATABASE_URL}</p> : <p>Database URL: Not Set</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="events-container" ref={eventsRef}>
            <h3 className="section-title">Upcoming Events</h3>

            {activeEvents.map((event) => (
                <div key={event.id} className={event.flyer ? "event-item featured-event" : "event-item"}>
                    {event.flyer ? (
                        <>
                            <div className="featured-top">
                                <div className="event-date">
                                    <span className="month">{event.month}</span>
                                    <span className="day">{event.day}</span>
                                </div>
                                <div className="event-details">
                                    <div className="event-name">
                                        {event.title} <span className={`badge badge-${event.type}`}>{event.type}</span>
                                    </div>
                                    <div className="event-time">{event.time}</div>
                                    <p style={{ fontSize: "0.9rem", color: "#ccc" }}>{event.desc}</p>
                                </div>
                            </div>
                            <div className="event-flyer">
                                <img 
                                    src={event.flyer} 
                                    alt="Event Flyer" 
                                    onClick={() => setExpandedFlyer(event.flyer!)}
                                    style={{ cursor: 'pointer' }}
                                    className="event-flyer-image"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="event-date">
                                <span className="month">{event.month}</span>
                                <span className="day">{event.day}</span>
                            </div>
                            <div className="event-details">
                                <div className="event-name">
                                    {event.title} <span className={`badge badge-${event.type}`}>{event.type}</span>
                                </div>
                                <div className="event-time">{event.time}</div>
                                <p style={{ fontSize: "0.9rem", color: "#ccc" }}>{event.desc}</p>
                            </div>
                        </>
                    )}
                </div>
            ))}

            {/* Flyer Modal */}
            <div 
                className={`modal-overlay ${expandedFlyer ? 'active' : ''}`} 
                onClick={() => setExpandedFlyer(null)}
            >
                <div className="flyer-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setExpandedFlyer(null)}>×</button>
                    {expandedFlyer && (
                        <img 
                            src={expandedFlyer} 
                            alt="Event Flyer - Full View" 
                            className="flyer-modal-image"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function getEasternDateKey() {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const map = Object.fromEntries(
        parts
            .filter((part) => part.type !== "literal")
            .map((part) => [part.type, part.value])
    ) as Record<string, string>;

    return `${map.year}-${map.month}-${map.day}`;
}

function normalizeExpirationKey(expiration: EventItem["expiration"]) {
    if (!expiration) return null;
    if (expiration instanceof Date) {
        return expiration.toISOString().slice(0, 10);
    }

    const asString = String(expiration);
    if (!asString) return null;
    if (asString.includes("T")) {
        return asString.slice(0, 10);
    }

    return asString;
}