import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Modal,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function EventsView() {
  const [eventSearch, setEventSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventPage, setEventPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEventImg, setSelectedEventImg] = useState(null);

  useEffect(() => {
    fetch("http://192.168.100.4:3000/events/getall")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFilteredEvents(data);
        } else {
          console.error("Invalid data format for events:", data);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangeEventPage = (event, newPage) => {
    setEventPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setEventPage(0);
  };

  const deleteEvent = async (idevents) => {
    try {
      const response = await fetch(
        `http://192.168.100.4:3000/events/${idevents}/del/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      const updatedEvents = filteredEvents.filter(
        (event) => event.idevents !== idevents
      );
      setFilteredEvents(updatedEvents);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleShowEventImg = (eventImg) => {
    setSelectedEventImg(eventImg);
  };

  const handleCloseDialog = () => {
    setSelectedEventImg(null);
  };

  return (
    <Box sx={{ p: 10, flexGrow: 1, overflowY: "auto" }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Event List
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search Events"
          variant="outlined"
          fullWidth
          value={eventSearch}
          onChange={(e) => setEventSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Actions</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.length > 0 ? (
                filteredEvents
                  .slice(
                    eventPage * rowsPerPage,
                    eventPage * rowsPerPage + rowsPerPage
                  )
                  .map((event) => (
                    <TableRow key={event.idevents}>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => deleteEvent(event.idevents)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                      <TableCell>{event.idevents}</TableCell>
                      <TableCell>{event.eventName}</TableCell>
                      <TableCell>{event.startDate}/{event.endDate}</TableCell>
                      <TableCell>{event.eventLocation}</TableCell>
                      <TableCell>{event.eventDescription}</TableCell>
                      <TableCell>{event.eventPrice}DT</TableCell>
                      <TableCell>
                        <img
                          src={event.image}
                          alt="Event"
                          style={{ width: "50px", cursor: "pointer" }}
                          onClick={() => handleShowEventImg(event.image)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>No events found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEvents.length}
          rowsPerPage={rowsPerPage}
          page={eventPage}
          onPageChange={handleChangeEventPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="event-details-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Event Details
          </Typography>
          {selectedEvent && (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{selectedEvent.eventName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>{selectedEvent.startDate}/{selectedEvent.endDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Location</TableCell>
                    <TableCell>{selectedEvent.eventLocation}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>{selectedEvent.eventDescription}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Price</TableCell>
                    <TableCell>{selectedEvent.eventPrice}DT</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Modal>

      <Dialog open={Boolean(selectedEventImg)} onClose={handleCloseDialog}>
        <DialogTitle>Event Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedEventImg && (
              <img
                src={selectedEventImg}
                alt="Event"
                style={{ width: "100%" }}
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventsView;
