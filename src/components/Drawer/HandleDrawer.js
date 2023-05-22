import React, { useState, useEffect } from 'react';
import { Drawer } from '@mui/material';
import EventForm from '../EventForm/EventForm.js';
import { collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../App1.css';
import { doc } from 'firebase/firestore'; // Add import for doc function
import { parseISO } from 'date-fns'; // Add import for parseISO function


function HandleDrawer({ open, onClose, userId, selectedEvent }) {
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    color: '',
  });
  const [ ,setAllEvents] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false); // Add state variable for isUpdating

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
  };

  // Function to handle updating an existing event
  const handleUpdateEvent = () => {
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

    updateDoc(doc(db, 'events', selectedEvent.id), updatedEventObject)
      .then(() => {
        setAllEvents((prevAllEvents) =>
          prevAllEvents.map((event) =>
            event.id === selectedEvent.id ? { ...updatedEventObject, id: selectedEvent.id } : event
          )
        );

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
  };

  useEffect(() => {
    if (selectedEvent) {
      // Parse start and end date strings into Date objects
      const startDate = parseISO(selectedEvent.start);
      const endDate = parseISO(selectedEvent.end);

      // Set the newEvent state with the values from the selected event
      setNewEvent({
        title: selectedEvent.title,
        startDate,
        startTime: startDate,
        endDate,
        endTime: endDate,
        color: selectedEvent.color,
      });

      setIsUpdating(true); // Set isUpdating to true when updating an existing event
    } else {
      setIsUpdating(false); // Set isUpdating to false when adding a new event
    }
  }, [selectedEvent]);

  return (
    <div>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <EventForm
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleAddEvent={handleAddEvent}
          handleUpdateEvent={handleUpdateEvent}
          isUpdating={isUpdating} // Pass isUpdating prop to EventForm component
        />
      </Drawer>
    </div>
  );
}

export default HandleDrawer;
