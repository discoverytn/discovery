const db = require('../database/index');
const Events = db.Events;
const Explorer = db.Explorer;
const Business = db.Business;

// Create a new event
const createEvent = async (req, res) => {
  const { eventName, startDate, endDate, eventDescription, eventPrice, eventLocation, image, explorer_idexplorer, business_idbusiness } = req.body;

  try {
    const event = await Events.create({
      eventName,
      startDate,
      endDate,
      eventDescription,
      eventPrice,
      eventLocation,
      image,
      explorer_idexplorer,
      business_idbusiness
    });

    // Increase numOfEvents in Business model
    const business = await db.Business.findByPk(business_idbusiness);
    if (business) {
      business.numOfEvents += 1;
      await business.save();
    }

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};


// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Events.findAll({
      include: [
        { 
          model: Explorer, 
          attributes: ['idexplorer', 'username', 'image'] 
        },
        { 
          model: Business, 
          attributes: ['idbusiness', 'businessname', 'image'] 
        }
      ],
      order: [['startDate', 'ASC']]
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get events for a specific user (explorer or business)
const getUserEvents = async (req, res) => {
  const { userId } = req.params;
  const { userType } = req.query; // 'explorer' or 'business'

  try {
    let where = {};
    if (userType === 'explorer') {
      where.explorer_idexplorer = userId;
    } else if (userType === 'business') {
      where.business_idbusiness = userId;
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const events = await Events.findAll({
      where,
      include: [
        userType === 'explorer' 
          ? { model: Explorer, attributes: ['idexplorer', 'username'] }
          : { model: Business, attributes: ['idbusiness', 'businessname'] }
      ],
      order: [['startDate', 'ASC']]
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ error: 'Failed to fetch user events' });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  const { idevents } = req.params;
  const { eventName, startDate, endDate, eventDescription, eventPrice } = req.body;

  try {
    const [updated] = await Events.update(
      { eventName, startDate, endDate, eventDescription, eventPrice },
      { where: { idevents: idevents } }
    );

    if (updated) {
      const updatedEvent = await Events.findByPk(idevents);
      res.status(200).json(updatedEvent);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete an event
// In eventController.js, modify the deleteEvent function
const deleteEvent = async (req, res) => {
  const { idevents } = req.params;

  try {
    const event = await Events.findByPk(idevents);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const deleted = await Events.destroy({
      where: { idevents: idevents }
    });

    if (deleted) {
      // Decrease numOfEvents in Business model
      const business = await db.Business.findByPk(event.business_idbusiness);
      if (business && business.numOfEvents > 0) {
        business.numOfEvents -= 1;
        await business.save();
      }
      
      // Send a JSON response instead of no content
      res.status(200).json({ message: 'Event deleted successfully' });
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getUserEvents,
  updateEvent,
  deleteEvent
};