import React from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { format } from 'date-fns';

const events = [
  { id: 1, name: 'Tech Conference 2024', date: new Date(2024, 7, 15), location: 'Hammam-lif, Ben Arous' },
  { id: 2, name: 'Startup Meetup', date: new Date(2024, 7, 20), location: 'El Ghazela, Ariana' },
  { id: 3, name: 'AI Workshop', date: new Date(2024, 8, 5), location: 'Manzel Bourguiba, Bizerte' },
  { id: 4, name: 'Developer Summit', date: new Date(2024, 8, 12), location: 'Tunis, Tunis' },
  { id: 5, name: 'Product Launch', date: new Date(2024, 8, 18), location: 'Ezzarah, Ben Arous' },
];

function UpcomingEvents() {
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
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{format(event.date, 'MMM d, yyyy')}</TableCell>
                  <TableCell>{event.location}</TableCell>
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