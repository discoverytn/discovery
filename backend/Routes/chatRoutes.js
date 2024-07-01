const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/chatController');

router.post('/chat/send', chatController.sendMessage);
router.get('/chat/:explorer_idexplorer/:business_idbusiness', chatController.getMessages);

module.exports = router;
