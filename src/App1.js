import { getDay } from "date-fns";
import { parse, parseISO, format } from "date-fns";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "./firebase";
import "./App1.css";
import Navbar from "./components/Navbar";
import { createEvents } from "ics";
import { doc, deleteDoc } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import HandleDrawer from "./components/Drawer/HandleDrawer"; // Add import for HandleDrawer component
import { Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper} from "@mui/material";
import {Dialog,DialogActions,DialogContent,DialogContentText, DialogTitle,Button } from "@mui/material"; // Add imports for Material-UI Dialog and Button components
import { Select, MenuItem } from "@mui/material";
import Footer from "./components/footer";

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

function App() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterText] = useState("")
  const [selectedEventType, setSelectedEventType] = useState("");
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Add state variable for selected event
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Add state variable for dialog open state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Add state variable for drawer open state
  const user = auth.currentUser;

  useEffect(() => {
    const userEventsCollection = collection(db, "events");
    const querySnapshot = query(userEventsCollection, where("userId", "==", userId));
    const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
      const fetchedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllEvents(fetchedEvents);
    });

    return () => {
      unsubscribe(); // Unsubscribe from the snapshot listener when the component unmounts
    };
  }, [userId]);
  const handleNotifyEvent = (event) => {
  // Logic for notifying the event
};
  const handleRemoveEvent = (event) => {
    const r = window.confirm("Would you like to remove this event?");
  
    if (r === true) {
      deleteDoc(doc(db, "events", event.id))
        .then(() => {
          const updatedEvents = allEvents.filter((e) => e.id !== event.id);
          setAllEvents(updatedEvents);
          setIsDialogOpen(false); // Add this line to close the dialog
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
    <div className="App" style={{ backgroundColor: "#F8F4E3", height: "100%", minHeight: "100vh" }}>
      <React.Fragment>
        <Navbar user={user} onExport={handleExport} allEvents={allEvents} />
      </React.Fragment>

      <div className="calendar-container">
        <div className="calendar" style={{ marginTop: "20px", marginLeft: "20px", width: "60%" }}>
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor={(event) => new Date(event.start)}
            endAccessor={(event) => new Date(event.end)}
            style={{
              height: 550,
              backgroundColor: "white",
              padding: "20px",
              boxShadow: "9px 10px 11px 10px rgba(238, 230, 207,1)",
              borderRadius: "50px",
            }}
            eventPropGetter={(event) => ({
              className: event.className,
              style: {
                backgroundColor: event.color,
              },
            })}
            onSelectEvent={(event) => {
              setSelectedEvent(event); // Set the selected event when an event is clicked
              setIsDialogOpen(true); // Open the dialog when an event is clicked
            }}
          />
        </div>
      
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
  <DialogTitle>Event Options</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Would you like to remove or update this event?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    {selectedEvent && (
      <Button onClick={() => handleNotifyEvent(selectedEvent)}>
        Notify Event
      </Button>
    )}
    <Button onClick={() => handleRemoveEvent(selectedEvent)}>
      Remove Event
    </Button>
    <Button onClick={() => {
      setIsDialogOpen(false);
      setIsDrawerOpen(true);
    }}>
      Update Event
    </Button>
  </DialogActions>
</Dialog>
       <HandleDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} selectedEvent={selectedEvent} userId={userId} />
       <TableContainer component={Paper} style={{ maxWidth: 500, marginTop: 23, marginLeft: 40,  backgroundColor: "white", padding: "20px", boxShadow: "9px 10px 11px 10px rgba(238, 230, 207,1)",borderRadius: "50px",}}>
        <Table>
        <TableHead>
        <TableRow style={{ height: -100 }} >
        <TableCell colSpan={3} style={{ backgroundColor: 'white' }}>
        <Button style={{ height: 1 }} onClick={() => setIsFilterVisible(!isFilterVisible)}  >Filter</Button>
        {isFilterVisible && (
        <Select
        value={selectedEventType}
        onChange={(event) => setSelectedEventType(event.target.value)}
        MenuProps={{
        PaperProps: {
        style: {minWidth: 200,},},}}
        >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="#B94747">Important</MenuItem>
        <MenuItem value="#44BC44">Personal</MenuItem>
        <MenuItem value="#6656D3">Class related</MenuItem>
        </Select>
        )}
        </TableCell>
        </TableRow>
        <TableRow>
        <TableCell>Title</TableCell>
        <TableCell>Start Date</TableCell>
        <TableCell>End Date</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {allEvents
        .filter(
        (event) =>
        event.title.toLowerCase().includes(filterText.toLowerCase()) &&
        (!selectedEventType || event.color === selectedEventType)
        )
        .map((event) => {
        let formattedStart = "";
        let formattedEnd = "";

        try {
        const parsedStart = parseISO(event.start);
        const parsedEnd = parseISO(event.end);
        formattedStart = format(parsedStart, "dd-MM-yyyy HH:mm");
        formattedEnd = format(parsedEnd, "dd-MM-yyyy HH:mm");
        } catch (error) {
        console.error("Error parsing time:", error);
        }

        return (
        <TableRow key={event.id}>
        <TableCell>{event.title}</TableCell>
        <TableCell>
        {formattedStart ? formattedStart : "Invalid start time"}
        </TableCell>
        <TableCell>
        {formattedEnd ? formattedEnd : "Invalid end time"}
        </TableCell>
        </TableRow>
        );
        })}
        </TableBody>
        </Table>
        </TableContainer>
      </div>
      <Footer />
    </div>
  );
}

export default App;
