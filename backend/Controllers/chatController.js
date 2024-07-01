const db = require('../database/index');


  const sendMessage= async (req, res) => {
    const { explorer_idexplorer, business_idbusiness, message } = req.body;

    try {
      const newMessage = await db.Chat.create({
        explorer_idexplorer,
        business_idbusiness,
        message
      });
      return res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ error: 'Failed to send message' });
    }
  }

  const getMessages= async (req, res) => {
    const { explorer_idexplorer, business_idbusiness } = req.params;

    try {
      const messages = await db.Chat.findAll({
        where: {
          explorer_idexplorer,
          business_idbusiness,
        },
        order: [['createdAt', 'ASC']],
      });
      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }
module.exports={sendMessage,getMessages}