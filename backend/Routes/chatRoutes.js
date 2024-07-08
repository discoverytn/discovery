const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/ChatController');
const chatRooms = require ('../ChatServer/index')

router.post('/send', chatController.sendMessage);
router.get('/:idexplorer/:idbusiness', chatController.getMessages);
router.delete('/delete/:idchat', chatController.deleteMessage);
router.get("/api", (req, res) => {
    res.json(chatRooms);
});
module.exports = router;
