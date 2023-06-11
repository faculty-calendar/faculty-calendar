import React from 'react';
import { Button, Select, MenuItem, InputLabel } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './EventForm.css';

function EventForm({ newEvent, setNewEvent, handleAddEvent, handleUpdateEvent, isUpdating, errorMessage }) {
  
  return (
    <div className="new-event" style={{ marginTop: '20px' }}>
      <h2 style={{ color: 'black', marginTop: '20px', marginBottom: '20px', fontSize: '24px' }}>
        {isUpdating ? 'Update Event' : 'Add New Event'}
      </h2>
      <div className="form-row">
  <InputLabel htmlFor="title-select" className="form-label" style={{ fontSize: '20px', marginBottom: '-18px' }}>
    Event Title:
  </InputLabel>
  <br />
  <Select
    labelId="title-select"
    id="title-select"
    value={newEvent.title}
    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
    className="form-input"
    style={{ fontSize: '20px', height:'60%' ,width: '100%' }}
  >
    <MenuItem value={"Machine Learning"}>Machine Learning</MenuItem>
    <MenuItem value={"OOPS"}>OOPS</MenuItem>
    <MenuItem value={"Computer Networks"}>Computer Networks</MenuItem>
    <MenuItem value={"TOC"}>TOC</MenuItem>
    <MenuItem value={"PSAT"}>PSAT</MenuItem>
    <MenuItem value={"Data Science"}>Data Science</MenuItem>
  </Select>
</div>
<div className="form-row">
  <InputLabel htmlFor="year-select" className="form-label" style={{ fontSize: '20px' }}>
    Year:
  </InputLabel>
  <Select
    id="year-select"
    value={newEvent.year}
    onChange={(e) => setNewEvent({ ...newEvent, year: e.target.value })}
    style={{ minWidth: 130 }}
  >
    <MenuItem value="I Year">I Year</MenuItem>
    <MenuItem value="II Year">II Year</MenuItem>
    <MenuItem value="III Year">III Year</MenuItem>
  </Select>
</div>

<div className="form-row">
  <InputLabel htmlFor="class-select" className="form-label" style={{ fontSize: '20px' }}>
    Class:
  </InputLabel>
  <Select
    id="class-select"
    value={newEvent.class}
    onChange={(e) => setNewEvent({ ...newEvent, class: e.target.value })}
    style={{ minWidth: 130 }}
  >
    <MenuItem value="CSE A">CSE A</MenuItem>
    <MenuItem value="CSE B">CSE B</MenuItem>
    <MenuItem value="CSE C">CSE C</MenuItem>
    <MenuItem value="CSE D">CSE D</MenuItem>
  </Select>
</div>

        <div className="form-row">
          <InputLabel htmlFor="datepicker" className="form-label" style={{ fontSize: '20px' }}>
            Start Date:
          </InputLabel>
          <div className="form-input">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                id="datepicker"
                placeholderText="Start Date"
                value={newEvent.startDate}
                onChange={(date) => setNewEvent({ ...newEvent, startDate: date })}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="form-row">
          <InputLabel htmlFor="stime" className="form-label" style={{ fontSize: '20px' }}>
            Start Time:
          </InputLabel>
          <div className="form-input">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                id="stime"
                placeholderText="Start Time"
                value={newEvent.startTime}
                onChange={(time) => {
                  const newTime = new Date();
                  newTime.setHours(time.getHours());
                  newTime.setMinutes(time.getMinutes());
                  setNewEvent({ ...newEvent, startTime: newTime });
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="form-row">
          <InputLabel htmlFor="edate" className="form-label" style={{ fontSize: '20px' }}>
            End Date:
          </InputLabel>
          <div className="form-input">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                id="edate"
                placeholderText="End Date"
                value={newEvent.endDate}
                onChange={(date) => setNewEvent({ ...newEvent, endDate: date })}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="form-row">
          <InputLabel htmlFor="etime" className="form-label" style={{ fontSize: '20px' }}>
            End Time:
          </InputLabel>
          <div className="form-input">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                id="etime"
                placeholderText="End Time"
                value={newEvent.endTime}
                onChange={(time) => {
                  const newTime = new Date();
                  newTime.setHours(time.getHours());
                  newTime.setMinutes(time.getMinutes());
                  setNewEvent({ ...newEvent, endTime: newTime });
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="form-row">
          <InputLabel htmlFor="etype" className="form-label" style={{ fontSize: '20px' }}>
            Event type:
          </InputLabel>
          <Select
            id="etype"
            value={newEvent.color}
            onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
            style={{ minWidth: 130 }}
          >
            <MenuItem value="">Event type</MenuItem>
            <MenuItem value="#B94747">Important</MenuItem>
            <MenuItem value="#44BC44">Personal</MenuItem>
            <MenuItem value="#6656D3">Class related</MenuItem>
          </Select>
        </div>
        <div className="form-row">
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <Button variant="contained" onClick={isUpdating ? handleUpdateEvent : handleAddEvent}>
        {isUpdating ? 'Update Event' : 'Add Event'}
        </Button>
        </div>
      </div>

  );
}

export default EventForm;
