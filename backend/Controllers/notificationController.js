const db = require('../database/index');
const Notif = db.Notif;
const Explorer = db.Explorer;
const Business = db.Business;

// create a new notification
const createNotification = async (req, res) => {
  const { type, message, explorer_idexplorer, business_idbusiness } = req.body;

  try {
    const notification = await Notif.create({
      type,
      message,
      explorer_idexplorer,
      business_idbusiness,
      created_at: new Date(),
      is_read: false
    });

    res.status(201).json({
      message: 'Notification created successfully',
      notification
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
      order: [['created_at', 'DESC']]
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

    where.is_read = false;

    const count = await Notif.count({ where });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    res.status(500).json({ error: 'Failed to fetch unread notification count' });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  getUnreadNotificationCount
};