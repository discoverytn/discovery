const db = require('../database/index');

const sendMessage = async (req, res) => {
  const { explorer_idexplorer, business_idbusiness, message } = req.body;

  try {
    const explorerExists = await db.Explorer.findByPk(explorer_idexplorer);
    const businessExists = await db.Business.findByPk(business_idbusiness);

    if (!explorerExists) {
      return res.status(404).json({ error: 'Explorer not found' });
    }
    if (!businessExists) {
      return res.status(404).json({ error: 'Business not found' });
    }

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
};

const getMessages = async (req, res) => {
  const { explorer_idexplorer, business_idbusiness } = req.body;

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
};

const deleteMessage = async (req, res) => {
  const { idchat } = req.params;

  try {
    const deleted = await db.Chat.destroy({
      where: { idchat }
    });
    if (deleted) {
      return res.status(204).json({ message: 'Message deleted' });
    }
    return res.status(404).json({ error: 'Message not found' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ error: 'Failed to delete message' });
  }
};

module.exports = { sendMessage, getMessages, deleteMessage };
