import { useState, useEffect, useRef, Fragment } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Month view
import timeGridPlugin from "@fullcalendar/timegrid"; // Week & Day views
import interactionPlugin from "@fullcalendar/interaction"; // Clickable events
import Container from "../components/container";
import { Dialog, Transition } from "@headlessui/react";

export default function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dayGridMonth");

  // Reference to FullCalendar instance
  const calendarRef = useRef<FullCalendar>(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
  });

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const changeView = (view: string) => {
    setCurrentView(view);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view); // Update FullCalendar view
    }
  };

  const openModal = (dateStr: string) => {
    setNewEvent({ title: "", start: dateStr, end: dateStr, description: "" });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(newEvent),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setEvents([...events, result]);
      closeModal();
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  return (
    <Container>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Schedule
      </h1>

      {/* View Toggle Buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            currentView === "dayGridMonth" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => changeView("dayGridMonth")}
        >
          Month
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentView === "timeGridWeek" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => changeView("timeGridWeek")}
        >
          Week
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentView === "timeGridDay" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => changeView("timeGridDay")}
        >
          Day
        </button>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-7xl px-4 md:px-8">
          <FullCalendar
            ref={calendarRef} // Attach ref to FullCalendar instance
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={currentView}
            selectable={true}
            events={events}
            dateClick={(info) => openModal(info.dateStr)}
            height="auto"
            className="w-full text-xs sm:text-sm md:text-base lg:text-lg"
          />
        </div>
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
              <Dialog.Title className="text-lg font-semibold">
                Add New Event
              </Dialog.Title>

              {/* Event Form */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-400"
                />

                <label className="block mt-3 text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="start"
                  value={newEvent.start}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-400"
                />

                <label className="block mt-3 text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="end"
                  value={newEvent.end}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-400"
                />

                <label className="block mt-3 text-sm font-medium text-gray-700">
                  Event Description
                </label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-400 h-20 resize-none"
                  placeholder="Add details about the event..."
                />
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleSubmit}
                >
                  Add Event
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </Container>
  );
}
