import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Container from "../components/container";

export default function SchedulePage() {
  const [events, setEvents] = useState([]);

  // Fetch events from API
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // Handle adding events
  const handleEventAdd = async (eventInfo: any) => {
    const newEvent = {
      title: eventInfo.event.title,
      start: eventInfo.event.startStr,
    };

    // Save event to database
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(newEvent),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create event.");
      const savedEvent = await res.json();
      setEvents([...events, savedEvent]);
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  return (
    <Container>
      <h1 className="text-4xl font-bold mb-4">Schedule</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        events={events}
        dateClick={(info) => {
          const title = prompt("Enter event title:");
          if (title) {
            handleEventAdd({ event: { title, startStr: info.dateStr } });
          }
        }}
      />
    </Container>
  );
}
