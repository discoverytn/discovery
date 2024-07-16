const express = require('express');
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  eventsGroup
} = require('../Controllers/notificationController.js');

router.post('/create', createNotification);
router.get('/user/:userId', getUserNotifications);
router.put('/:idnotif/read', markNotificationAsRead);
router.delete('/:idnotif', deleteNotification);
router.get('/unread-count/:userId', getUnreadNotificationCount);
router.get('/event-group',eventsGroup)

module.exports = router;