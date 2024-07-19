const express = require('express');
const router = express.Router();

 const {
    sendMessage,
    getMessages,
    deleteMessage,
    
  } = require('../Controllers/ChatController.js');
router.post('/send', sendMessage);
router.get('/get', getMessages);
router.delete('/delete', deleteMessage);
router.get("/api", (req, res) => {
    res.json(chatRooms);
})

module.exports = router;