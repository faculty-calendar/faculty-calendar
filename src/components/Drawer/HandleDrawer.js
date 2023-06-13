import React, { useState, useEffect } from 'react';
import { Drawer } from '@mui/material';
import EventForm from '../EventForm/EventForm.js';
import { collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../App1.css';
import { doc } from 'firebase/firestore'; // Add import for doc function
import { parseISO } from 'date-fns'; // Add import for parseISO function

function HandleDrawer({ open, onClose, userId, selectedEvent }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    year: '', // Add the 'year' variable here
    class: '',
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

  const handleAddEvent = () => {
    setErrorMessage('');
    const { title, year, startDate, startTime, endDate, endTime, color } = newEvent; // Add 'year' to the destructured variables
    const currentDate = new Date();
  
    // Check if any of the date or time values are null
    if (!startDate || !startTime || !endDate || !endTime) {
      setErrorMessage('Please fill all the required fields');
      return;
    }
  
    // Combine the date and time values into valid date objects
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.getHours());
    startDateTime.setMinutes(startTime.getMinutes());
  
    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours());
    endDateTime.setMinutes(endTime.getMinutes());
  
    // Check if start date is before current date
    const startDateTimeCopy = new Date(startDateTime);
    const currentDateCopy = new Date(currentDate);
    if (startDateTimeCopy.setHours(0,0,0,0) < currentDateCopy.setHours(0,0,0,0)) {
      setErrorMessage('Start date cannot be before current date');
      return;
    }
    // Check if start date is before current date
    // Check if end time is less than start time on the same day
    if (startDate === endDate && endDateTime < startDateTime) {
      setErrorMessage('End time cannot be less than start time on the same day');
      return;
    }
  // Check if start date is before current date
    // Check if end time is less than start time on the same day
    // Check if end date is before start date
    if (endDateTime < startDateTime) {
      setErrorMessage('End date cannot be before start date');
      return;
    }
  
    const newEventObject = {
      title,
      year,
      class: newEvent.class,
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
  

  const handleUpdateEvent = () => {
    setErrorMessage('');
    const { title, startDate, startTime, endDate, endTime, color } = newEvent;
    const currentDate = new Date();
  
    if (!startDate || !startTime || !endDate || !endTime) {
      setErrorMessage('Please fill all the required fields');
      return;
    }
  
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.getHours(), startTime.getMinutes()); // Update the startDateTime to include the selected time
  
    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours(), endTime.getMinutes()); // Update the endDateTime to include the selected time
  
    if (startDateTime < currentDate) {
      setErrorMessage('Start date cannot be before current date');
      return;
    }
  
    if (endDateTime < startDateTime) {
      setErrorMessage('End date cannot be before start date');
      return;
    }
  
    if (startDate === endDate && endTime < startTime) {
      setErrorMessage('End time cannot be less than start time on the same day');
      return;
    }
  
    const updatedEventObject = {
      title,
      year: newEvent.year,
      class: newEvent.class,
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
  
        setNewEvent({
          title: '',
          startDate: null,
          startTime: null,
          endDate: null,
          endTime: null,
          color: '',
        });
  
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
      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          setErrorMessage(''); // Reset error message
          onClose();
        }}
      >
        <EventForm
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleAddEvent={handleAddEvent}
          handleUpdateEvent={handleUpdateEvent}
          isUpdating={isUpdating}
          errorMessage={errorMessage}
        />

      </Drawer>

    </div>
  );
}

export default HandleDrawer;
