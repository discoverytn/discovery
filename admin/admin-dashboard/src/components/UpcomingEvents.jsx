import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { format } from 'date-fns';

function UpcomingEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://192.168.100.4:3000/events/getall")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort events by date and take the nearest 5
          const sortedEvents = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).slice(0, 5);
          setEvents(sortedEvents);
        } else {
          console.error("Invalid data format for events:", data);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <Box sx={{ flexBasis: '50%', pl: 2 }}>
      <Paper sx={{ p: 2, height: 400, overflow: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Events</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle2">Event</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Date</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Location</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.idevents}>
                  <TableCell>{event.eventName}</TableCell>
                  <TableCell>{format(new Date(event.startDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{event.eventLocation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default UpcomingEvents;
