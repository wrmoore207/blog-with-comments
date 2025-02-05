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

  // Function to handle event creation
  const handleEventAdd = async (title: string, start: string, end: string) => {
    const newEvent = { title, start, end };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(newEvent),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json(); // Parse the response

      if (!res.ok) {
        console.error("Error details:", result); // Log backend error
        throw new Error("Failed to create event.");
      }

      setEvents([...events, result]); // Update UI
    } catch (err) {
      console.error("Error saving event:", err.message);
    }
  };

  // Handle date selection
  const handleDateClick = (info: any) => {
    const title = prompt("Enter event title:");
    if (!title) return;

    const startTime = prompt("Enter start time (HH:MM, 24-hour format):");
    const endTime = prompt("Enter end time (HH:MM, 24-hour format):");

    if (!startTime || !endTime) {
      alert("Start and end times are required.");
      return;
    }

    // Format the event start and end time as ISO strings
    const startDateTime = `${info.dateStr}T${startTime}:00`;
    const endDateTime = `${info.dateStr}T${endTime}:00`;

    handleEventAdd(title, startDateTime, endDateTime);
  };

  return (
    <Container>
      <h1 className="text-4xl font-bold mb-4">Schedule</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        events={events}
        dateClick={handleDateClick}
      />
    </Container>
  );
}