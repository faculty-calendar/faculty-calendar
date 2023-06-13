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
import HandleDrawer from "./components/Drawer/HandleDrawer";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
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
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]); // Add filtered events state


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
      unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    const filtered = allEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(filterText.toLowerCase()) &&
        (!selectedYear || event.year === selectedYear) &&
        (!selectedClass || event.class === selectedClass)
    );
    setFilteredEvents(filtered);
  }, [allEvents, filterText, selectedYear, selectedClass]);


  const handleRemoveEvent = (event) => {
    const r = window.confirm("Would you like to remove this event?");

    if (r === true) {
      deleteDoc(doc(db, "events", event.id))
        .then(() => {
          const updatedEvents = allEvents.filter((e) => e.id !== event.id);
          setAllEvents(updatedEvents);
          setIsDialogOpen(false);
        })
        .catch((error) => {
          console.error("Error removing event:", error);
        });
    }
  };

  async function handleExport() {
    console.log("handleExport called");
    const userEventsCollection = collection(db, "events");
    const querySnapshot = await getDocs(query(userEventsCollection, where("userId", "==", userId)));
    const fetchedEvents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const events = fetchedEvents.map((event) => {
      const startDate = parseISO(event.start);
      const endDate = parseISO(event.end);
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
    

    console.log(events);

    const { error, value } = createEvents(events);

    if (error) {
      console.error("Error creating events:", error);
      return;
    }

    const fileContent = value;

    const blob = new Blob([fileContent], {
      type: "text/calendar;charset=utf-8",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calendar.ics";

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
            events={filteredEvents} // Use filtered events here
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
              setSelectedEvent(event);
              setIsDialogOpen(true);
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
            <Button onClick={() => handleRemoveEvent(selectedEvent)}>
              Remove Event
            </Button>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                setIsDrawerOpen(true);
              }}
            >
              Update Event
            </Button>
          </DialogActions>
        </Dialog>

        <HandleDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          selectedEvent={selectedEvent}
          userId={userId}
        />

        <TableContainer
          component={Paper}
          style={{
            maxWidth: 520,
            marginTop: 23,
            marginLeft: 40,
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "9px 10px 11px 10px rgba(238, 230, 207,1)",
            borderRadius: "50px",
          }}
        >
          <Table>
          <TableHead>
          <TableRow style={{ height: -100 }}>
            <TableCell colSpan={5} style={{ backgroundColor: "white" }}>
              <Button style={{ height: 1 }} onClick={() => setIsFilterVisible(!isFilterVisible)}>
                Filter
              </Button>
              {isFilterVisible && (
                <div>
                  <input
                    type="text"
                    placeholder="Event Title"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    style={{
                      border: "1px solid gray",
                      borderRadius: "5px",
                      padding: "5px",
                      marginRight: "10px",
                    }}
                  />
                  {/* Remove the Select component for filtering by event type */}
                      <Select
                        value={selectedYear}
                        onChange={(event) => setSelectedYear(event.target.value)}
                        MenuProps={{
                          PaperProps: {
                            style: { minWidth: 200 },
                          },
                        }}
                        style={{ marginRight: "10px",fontSize: "1px", padding: "3px" }}
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="I Year">I Year</MenuItem>
                        <MenuItem value="II Year">II Year</MenuItem>
                        <MenuItem value="III Year">III Year</MenuItem>
                        {/* Add more options for years */}
                      </Select>
                      <Select
                        value={selectedClass}
                        onChange={(event) => setSelectedClass(event.target.value)}
                        MenuProps={{
                          PaperProps: {
                            style: { minWidth: 200 },
                          },
                        }}
                        style={{ marginRight: "10px",fontSize: "1px", padding: "3px" }}
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="CSE A">CSE A</MenuItem>
                        <MenuItem value="CSE B">CSE B</MenuItem>
                        <MenuItem value="CSE C">CSE C</MenuItem>
                        <MenuItem value="CSE D">CSE D</MenuItem>
                        {/* Add more options for classes */}
                      </Select>
                    </div>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Room Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event) => {
                let formattedStart = "";
                let formattedEnd = "";
                let classroom = "";

                try {
                  const parsedStart = parseISO(event.start);
                  const parsedEnd = parseISO(event.end);
                  formattedStart = format(parsedStart, "dd-MM-yyyy HH:mm");
                  formattedEnd = format(parsedEnd, "dd-MM-yyyy HH:mm");

                  if (event.year === "I Year") {
                    switch (event.class) {
                      case "CSE A":
                        classroom = "D303";
                        break;
                      case "CSE B":
                        classroom = "A301";
                        break;
                      case "CSE C":
                        classroom = "A302";
                        break;
                      case "CSE D":
                        classroom = "A303";
                        break;
                      default:
                        classroom = "";
                    }
                  } else if (event.year === "II Year") {
                    switch (event.class) {
                      case "CSE A":
                        classroom = "B1201";
                        break;
                      case "CSE B":
                        classroom = "B202";
                        break;
                      case "CSE C":
                        classroom = "B203";
                        break;
                      case "CSE D":
                        classroom = "C201";
                        break;
                      default:
                        classroom = "";
                    }
                  } else if (event.year === "III Year") {
                    switch (event.class) {
                      case "CSE A":
                        classroom = "A101";
                        break;
                      case "CSE B":
                        classroom = "C101";
                        break;
                      case "CSE C":
                        classroom = "C102";
                        break;
                      case "CSE D":
                        classroom = "C103";
                        break;
                      default:
                        classroom = "";
                    }
                  }
                } catch (error) {
                  console.error("Error parsing time:", error);
                }

                return (
                  <TableRow key={event.id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{formattedStart ? formattedStart : "Invalid start time"}</TableCell>
                    <TableCell>{formattedEnd ? formattedEnd : "Invalid end time"}</TableCell>
                    <TableCell>{event.year}</TableCell>
                    <TableCell>{event.class}</TableCell>
                    <TableCell>{classroom}</TableCell> {/* Add classroom column */}
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
