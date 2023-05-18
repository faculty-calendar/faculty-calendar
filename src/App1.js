import { getDay } from "date-fns";
import { parse, parseISO, format } from "date-fns";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import "./App1.css";
import Navbar from "./components/Navbar";
import { createEvents } from "ics";
import { doc, deleteDoc } from "firebase/firestore";
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function App({ userId }) {
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userEventsCollection = collection(db, "events");
      const querySnapshot = await getDocs(
        query(userEventsCollection, where("userId", "==", userId))
      );
      const fetchedEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllEvents(fetchedEvents);
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleRemoveEvent = (event) => {
    const r = window.confirm("Would you like to remove this event?");

    if (r === true) {
      deleteDoc(doc(db, "events", event.id))
        .then(() => {
          const updatedEvents = allEvents.filter((e) => e.id !== event.id);
          setAllEvents(updatedEvents);
        })
        .catch((error) => {
          console.error("Error removing event:", error);
        });
    }
  };

  async function handleExport() {
    console.log("handleExport called");
    // Fetch events for logged-in user from database
    const userEventsCollection = collection(db, "events");
    const querySnapshot = await getDocs(
      query(userEventsCollection, where("userId", "==", userId))
    );
    const fetchedEvents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const events = fetchedEvents.map((event) => {
      // Parse start and end date strings into Date objects
      const startDate = parseISO(event.start);
      const endDate = parseISO(event.end);

      // Extract date and time components from Date objects
      const startArray = [
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes(),
      ];
      const endArray = [
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate(),
        endDate.getHours(),
        endDate.getMinutes(),
      ];

      return {
        title: event.title,
        start: startArray,
        end: endArray,
      };
    });
    // Log the values of the event objects
    console.log(events);
    // Generate iCalendar file for download
    const { error, value } = createEvents(events);

    if (error) {
      console.error("Error creating events:", error);
      return;
    }

    const fileContent = value;

    // Create a Blob with the file content
    const blob = new Blob([fileContent], {
      type: "text/calendar;charset=utf-8",
    });

    // Create a download link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calendar.ics";

    // Trigger a click event on the link to start the download
    link.click();
  }

  return (
    <div
      className="App"
      style={{ backgroundColor: "#F8F4E3", height: "100%", minHeight: "100vh" }}
    >
      <React.Fragment>
        <Navbar onExport={handleExport} />
      </React.Fragment>
      <h1 style={{ textAlign: "center" }}>Welcome - {userId}</h1>

      <div className="calendar-container">
        <div className="calendar" style={{ marginTop: "20px", merginLeft: "100px" }}>
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor={(event) => new Date(event.start)}
            endAccessor={(event) => new Date(event.end)}
            style={{
              height: 500,
              backgroundColor: "white",
              padding: "20px 20px 20px 20px",
              marginLeft: "20px",
              boxShadow: '9px 10px 11px 10px rgba(238, 230, 207,1)',
              borderRadius: "30px",
            }}
            eventPropGetter={(event) => ({
              className: event.className,
              style: {
                backgroundColor: event.color,
              },
            })}
            components={{
              month: {
                event: ({ event }) => (
                  <div
                    className="rbc-event"
                    onClick={() => handleRemoveEvent(event)} // Add the onClick handler for event deletion
                  >
                    {event.title}
                  </div>
                ),
              },
            }}
          />
        </div>
        
      </div>
      <div className="events-list">
        <h2>Events</h2>
        <table style={{ marginBottom: "0px", marginLeft: "500px", marginRight: "500px", width: "50%", columnWidth: "180px", border: "solid" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {allEvents.map((event) => {
              let formattedStart = "";
              let formattedEnd = "";

              try {
                const parsedStart = parseISO(event.start);
                const parsedEnd = parseISO(event.end);
                formattedStart = format(parsedStart, "yyyy-MM-dd HH:mm");
                formattedEnd = format(parsedEnd, "yyyy-MM-dd HH:mm");
              } catch (error) {
                console.error("Error parsing time:", error);
              }

              return (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{formattedStart ? formattedStart : "Invalid start time"}</td>
                  <td>{formattedEnd ? formattedEnd : "Invalid end time"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
