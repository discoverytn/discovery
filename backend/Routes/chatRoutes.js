const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/chatController');

router.post('/send', chatController.sendMessage);
router.get('/chat/:explorer_idexplorer/:business_idbusiness', chatController.getMessages);
router.delete('/delete', chatController.deleteMessage);
app.get("/api", (req, res) => {
    res.json(chatRooms);
})
module.exports = router;
