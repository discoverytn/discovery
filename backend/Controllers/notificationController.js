const db = require('../database/index');
const Notif = db.Notif;
const Explorer = db.Explorer;
const Business = db.Business;

// create a new notification

const createNotification = async (req, res) => {
  const { type, message, explorer_idexplorer, business_idbusiness, senderImage } = req.body;

  try {
    const newNotification = await Notif.create({
      type,
      message,
      explorer_idexplorer,
      business_idbusiness,
      created_at: new Date(),
      is_read: false,
      senderImage ,
      is_read: false,
      created_at: new Date(),
    });

    res.status(201).json({
      message: 'Notification created successfully',
      newNotification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// Get all notifications for a specific user (explorer or business)
const getUserNotifications = async (req, res) => {
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

    const notifications = await Notif.findAll({
      where,
      order: [['created_at', 'DESC']],
      attributes: ['idnotif', 'type', 'message', 'created_at', 'is_read', 'senderImage'] // Include senderImage
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ error: 'Failed to fetch user notifications' });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  const { idnotif } = req.params;

  try {
    const [updated] = await Notif.update({ is_read: true }, {
      where: { idnotif: idnotif }
    });

    if (updated) {
      const updatedNotification = await Notif.findByPk(idnotif);
      res.status(200).json(updatedNotification);
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  const { idnotif } = req.params;

  try {
    const deleted = await Notif.destroy({
      where: { idnotif: idnotif }
    });

    if (deleted) {
      res.status(204).json({ message: 'Notification deleted successfully' });
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};
const getUnreadNotificationCount = async (req, res) => {
  const { userId } = req.params;
  const { userType } = req.query; 

  try {
    let where = {};
    if (userType === 'explorer') {
      where.explorer_idexplorer = userId;
    } else if (userType === 'business') {
      where.business_idbusiness = userId;
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    where.is_read = false;

    const count = await Notif.count({ where });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    res.status(500).json({ error: 'Failed to fetch unread notification count' });
  }
};
// this function for giving infromation when joining event 
const eventsGroup = async (req, res) => {
  try {
    const eventJoinNotifications = await Notif.findAll({
      where: {
        type: 'event_join'
      },
      attributes: [
        'business_idbusiness', 
        'explorer_idexplorer',
        [db.sequelize.fn('MAX', db.sequelize.col('message')), 'message'],
        [db.sequelize.fn('MAX', db.sequelize.col('senderImage')), 'senderImage'],
        [db.sequelize.fn('SUBSTRING_INDEX', db.sequelize.fn('MAX', db.sequelize.col('message')), ' ', 1), 'expName']
      ],
      group: ['business_idbusiness', 'explorer_idexplorer']
    });

    // Process the results
    const processedNotifications = eventJoinNotifications.map(notification => ({
      business_idbusiness: notification.business_idbusiness,
      explorer_idexplorer: notification.explorer_idexplorer,
      expName: notification.getDataValue('expName'),
      senderImage: notification.senderImage
    }));

    res.status(200).json(processedNotifications);
  } catch (error) {
    console.error('Error fetching events group:', error);
    res.status(500).json({ error: 'Failed to fetch events group' });
  }
};


const eventsGroup = async (req, res) => {
  try {
    const eventJoinNotifications = await Notif.findAll({
      where: {
        type: 'event_join'
      },
      attributes: [
        'business_idbusiness', 
        'explorer_idexplorer',
        [db.sequelize.fn('MAX', db.sequelize.col('message')), 'message'],
        [db.sequelize.fn('MAX', db.sequelize.col('senderImage')), 'senderImage'],
        [db.sequelize.fn('SUBSTRING_INDEX', db.sequelize.fn('MAX', db.sequelize.col('message')), ' ', 1), 'expName']
      ],
      group: ['business_idbusiness', 'explorer_idexplorer']
    });

    // Process the results
    const processedNotifications = eventJoinNotifications.map(notification => ({
      business_idbusiness: notification.business_idbusiness,
      explorer_idexplorer: notification.explorer_idexplorer,
      expName: notification.getDataValue('expName'),
      senderImage: notification.senderImage
    }));

    res.status(200).json(processedNotifications);
  } catch (error) {
    console.error('Error fetching events group:', error);
    res.status(500).json({ error: 'Failed to fetch events group' });
  }
};



module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  eventsGroup
};