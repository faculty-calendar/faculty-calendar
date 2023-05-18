import React, { useState, useEffect, useCallback } from 'react'; // Add useCallback to the imports
import { Drawer } from '@mui/material';
import EventForm from '../EventForm/EventForm.js';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../App1.css';

function HandleDrawer({ open, onClose, userId }) {
  console.log('HandleDrawer props:', { open, onClose, userId });

  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    color: '',
  });
  const [allEvents, setAllEvents] = useState([]);

  // Define fetchData function outside of useEffect and wrap it in useCallback
  const fetchData = useCallback(async () => {
    const userEventsCollection = collection(db, 'events');
    const querySnapshot = await getDocs(query(userEventsCollection, where('userId', '==', userId)));
    const fetchedEvents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('fetchedEvents:', fetchedEvents); // Log the value of fetchedEvents
    setAllEvents(fetchedEvents);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, fetchData]);

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

    console.log('newEventObject:', newEventObject); // Log the value of newEventObject

    addDoc(collection(db, 'events'), newEventObject)
      .then((docRef) => {
        console.log('allEvents before update:', allEvents); // Log the value of allEvents before updating

        // Update the allEvents state with the new event
        setAllEvents((prevAllEvents) => {
          console.log('prevAllEvents:', prevAllEvents); // Log the value of prevAllEvents
          const updatedAllEvents = [...prevAllEvents, { ...newEventObject, id: docRef.id }];
          console.log('updatedAllEvents:', updatedAllEvents); // Log the value of updatedAllEvents
          return updatedAllEvents;
        });

        console.log('allEvents after update:', allEvents); // Log the value of allEvents after updating

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

  console.log(newEvent);

  return (
    <div>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <EventForm newEvent={newEvent} setNewEvent={setNewEvent} handleAddEvent={handleAddEvent} />
      </Drawer>
    </div>
  );
}

export default HandleDrawer;
