const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/chatController');

router.post('/send', chatController.sendMessage);
router.get('/get', chatController.getMessages);
router.delete('/delete', chatController.deleteMessage);
router.get("/api", (req, res) => {
    res.json(chatRooms);
})
// router.get('/his',chatController.getChatHistory)
module.exports = router;
