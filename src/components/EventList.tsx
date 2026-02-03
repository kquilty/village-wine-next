"use client";
import { useEffect, useRef } from 'react';

interface EventItem {
  id: number;
  month: string;
  day: string;
  title: string;
  time: string;
  desc: string;
  type: "special" | "weekly";
}

const events: EventItem[] = [
  {
    id: 1,
    month: "FEB",
    day: "13",
    title: "Photo Booth & Candy Game",
    time: "4:00 PM - 7:00 PM",
    desc: "Join us for a photo booth, candy jar guessing contest, and our weekly tasting!",
    type: "special"
  },
  {
    id: 2,
    month: "FEB",
    day: "14",
    title: "Valentine's Day Tasting",
    time: "Front Counter",
    desc: "Stop by our front counter for a special Valentine's Day tasting.",
    type: "special"
  },
  {
    id: 3,
    month: "FRI",
    day: "WK",
    title: "Friday Night Tasting",
    time: "4:00 PM - 7:00 PM",
    desc: "Join us every Friday to sample our featured bottle of the week.",
    type: "weekly"
  }
];

export default function EventList() {
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add animate-in class after mount
    if (eventsRef.current) {
      const items = eventsRef.current.querySelectorAll('.event-item');
      items.forEach((item) => {
        item.classList.add('animate-in');
      });
    }
  }, []);

  return (
    <div className="events-container" ref={eventsRef}>
      <h3 className="section-title">Upcoming Events</h3>

      {events.map((event) => (
        <div key={event.id} className="event-item">
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
      ))}
    </div>
  );
}