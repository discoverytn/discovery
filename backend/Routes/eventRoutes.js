const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventController');

// Create a new event
router.post('/create', eventController.createEvent);

// Get all events
router.get('/getAll', eventController.getAllEvents);

// Get events for a specific user
router.get('/user/:userId', eventController.getUserEvents);

// Update an event
router.put('/:idevents/edit', eventController.updateEvent);

// Delete an event
router.delete('/:idevents/del', eventController.deleteEvent);

module.exports = router;