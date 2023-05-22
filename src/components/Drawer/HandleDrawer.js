import React, { useState, useEffect } from 'react';
import { Drawer } from '@mui/material';
import EventForm from '../EventForm/EventForm';
import { collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../App1.css';
import { doc } from 'firebase/firestore'; // Add import for doc function
import { parseISO } from 'date-fns'; // Add import for parseISO function
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function HandleDrawer({ open, onClose, userId, selectedEvent }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    color: '',
  });
  const [allEvents, setAllEvents] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false); // Add state variable for isUpdating
  const [errorMessage, setErrorMessage] = useState(''); // Add state variable for errorMessage

  useEffect(() => {
    console.log('isDialogOpen:', isDialogOpen);
  }, [isDialogOpen]);

  useEffect(() => {
    const fetchData = async () => {
      const userEventsCollection = collection(db, 'events');
      const querySnapshot = await getDocs(query(userEventsCollection, where('userId', '==', userId)));
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

  // Function to handle adding a new event
  const handleAddEvent = () => {
    // Get the current date and set its time to 00:00:00
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if the start date is on or after the current date
    if (newEvent.startDate < currentDate) {
      // Display an error message
      setErrorMessage('Start date must be on or after the current date');
    } else if (newEvent.endDate < currentDate) {
      // Display an error message
      setErrorMessage('End date must be on or after the current date');
    } else if (newEvent.endDate < newEvent.startDate) {
      // Display an error message
      setErrorMessage('End date must be on or after the start date');
    } else {
      // Combine the date and time values into valid date objects
      const startDateTime = new Date(newEvent.startDate);
      startDateTime.setHours(newEvent.startTime.getHours());
      startDateTime.setMinutes(newEvent.startTime.getMinutes());

      const endDateTime = new Date(newEvent.endDate);
      endDateTime.setHours(newEvent.endTime.getHours());
      endDateTime.setMinutes(newEvent.endTime.getMinutes());

      // Check if the end time is after the start time on the same day
      if (endDateTime.getTime() === startDateTime.getTime() && endDateTime <= startDateTime) {
        // Display an error message
        setErrorMessage('End time must be after start time on the same day');
      } else {
        // Check for conflicts with existing events
        const hasConflict = allEvents.some((event) =>
          event.startDate &&
          event.startTime &&
          event.startDate.getTime() === newEvent.startDate.getTime() &&
          event.startTime.getTime() === newEvent.startTime.getTime()
        );
        console.log('hasConflict:', hasConflict);
        if (hasConflict) {
          setIsDialogOpen(true);
        } else {
          const { title, startDate, startTime, endDate, endTime, color } = newEvent;

          // Check if any of the date or time values are null
          if (!startDate || !startTime || !endDate || !endTime) {
            console.error('Invalid date or time values');
            return;
          }

          // Combine the date and time values into valid date objects
          const startDateTime = new Date(startDate);
          startDateTime.setHours(startTime.getHours());
          startDateTime.setMinutes(startTime.getMinutes());

          const endDateTime = new Date(endDate);
          endDateTime.setHours(endTime.getHours());
          endDateTime.setMinutes(endTime.getMinutes());

          const newEventObject = {
            title,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            color,
            userId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          };

          addDoc(collection(db, 'events'), newEventObject)
            .then((docRef) => {
              setAllEvents((prevAllEvents) => [...prevAllEvents, { ...newEventObject, id: docRef.id }]);
              setErrorMessage('');
              // Reset the newEvent state
              setNewEvent({
                title: '',
                startDate: null,
                startTime: null,
                endDate: null,
                endTime: null,
                color: '',
              });

              // Close the drawer
              onClose();
            })
            .catch((error) => {
              console.error('Error adding document: ', error);
            });
        }
      }
    }
  };

  // Function to handle updating an existing event
  const handleUpdateEvent = () => {
    // Get the current date and set its time to 00:00:00
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if the start date is on or after the current date
    if (newEvent.startDate < currentDate) {
      // Display an error message
      setErrorMessage('Start date must be on or after the current date');
    } else if (newEvent.endDate < currentDate) {
      // Display an error message
      setErrorMessage('End date must be on or after the current date');
    } else if (newEvent.endDate < newEvent.startDate) {
      // Display an error message
      setErrorMessage('End date must be on or after the start date');
    } else {
      // Combine the date and time values into valid date objects
      const startDateTime = new Date(newEvent.startDate);
      startDateTime.setHours(newEvent.startTime.getHours());
      startDateTime.setMinutes(newEvent.startTime.getMinutes());

      const endDateTime = new Date(newEvent.endDate);
      endDateTime.setHours(newEvent.endTime.getHours());
      endDateTime.setMinutes(newEvent.endTime.getMinutes());

      // Check if the end time is after the start time on the same day
      if (endDateTime.getTime() === startDateTime.getTime() && endDateTime <= startDateTime) {
        // Display an error message
        setErrorMessage('End time must be after start time on the same day');
      } else {
        // Check for conflicts with existing events
        const hasConflict = allEvents.some((event) =>
          event.startDate &&
          event.startTime &&
          event.startDate.getTime() === newEvent.startDate.getTime() &&
          event.startTime.getTime() === newEvent.startTime.getTime()
        );
        if (hasConflict) {
          setIsDialogOpen(true);
        } else {
          const { title, startDate, startTime, endDate, endTime, color } = newEvent;

          // Check if any of the date or time values are null
          if (!startDate || !startTime || !endDate || !endTime) {
            console.error('Invalid date or time values');
            return;
          }

          // Combine the date and time values into valid date objects
          const startDateTime = new Date(startDate);
          startDateTime.setHours(startTime.getHours());
          startDateTime.setMinutes(startTime.getMinutes());

          const endDateTime = new Date(endDate);
          endDateTime.setHours(endTime.getHours());
          endDateTime.setMinutes(endTime.getMinutes());

          const updatedEventObject = {
            title,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            color,
            userId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          };

          const eventDocRef = doc(db, 'events', selectedEvent.id);

          updateDoc(eventDocRef, updatedEventObject)
            .then(() => {
              setAllEvents((prevAllEvents) =>
                prevAllEvents.map((event) => (event.id === selectedEvent.id ? { ...event, ...updatedEventObject } : event))
              );
              setErrorMessage('');
              // Reset the newEvent state
              setNewEvent({
                title: '',
                startDate: null,
                startTime: null,
                endDate: null,
                endTime: null,
                color: '',
              });

              // Close the drawer
              onClose();
            })
            .catch((error) => {
              console.error('Error updating document: ', error);
            });
        }
      }
    }
  };

  // Function to handle the dialog close event
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="event-form-container">
        <EventForm
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleAddEvent={handleAddEvent}
          handleUpdateEvent={handleUpdateEvent}
          isUpdating={isUpdating}
          errorMessage={errorMessage}
        />
      </div>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Conflict Detected</DialogTitle>
        <DialogContent>
          <DialogContentText>An event already exists at the selected date and time. Do you want to proceed?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddEvent} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}

export default HandleDrawer;
