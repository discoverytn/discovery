const db = require('../database/index');
const { io } = require('../ChatServer/index');

const sendMessage = async (req, res) => {
  const { explorer_idexplorer, business_idbusiness, message, eventName } = req.body;

  try {
    const explorer = await db.Explorer.findByPk(explorer_idexplorer);
    const business = await db.Business.findByPk(business_idbusiness);

    if (!explorer) {
      return res.status(404).json({ error: 'Explorer not found' });
    }
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const newMessage = await db.Chat.create({
      explorer_idexplorer,
      business_idbusiness,
      message,
      eventName,
    });

    const roomName = `${eventName}-${explorer_idexplorer}-${business_idbusiness}`;
    const newMessageData = {
      ...newMessage.toJSON(),
      explorerName: explorer.name,
      businessName: business.name,
    };

    io.to(roomName).emit('receive-message', newMessageData);

    return res.status(201).json(newMessageData);
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
      include: [
        { model: db.Explorer, attributes: ['name'], as: 'explorer' },
        { model: db.Business, attributes: ['name'], as: 'business' },
      ],
    });

    const formattedMessages = messages.map((msg) => ({
      ...msg.toJSON(),
      explorerName: msg.explorer ? msg.ExplorerInfo.username : null,
      businessName: msg.business ? msg.BusinessInfo.usernameame : null,
    }));

    return res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// const getChatHistory = async (req, res) => {
//   const { explorer_idexplorer } = req.params;

//   try {
//     const history = await db.Chat.findAll({
//       where: {
//         explorer_idexplorer,
//       },
//       order: [['createdAt', 'ASC']],
//       include: [
//         { model: db.Explorer, as: 'explorer' }, 
//         { model: db.Business, as: 'business' }, 
//       ],
//     });

//     const formattedHistory = history.map((msg) => ({
//       ...msg.toJSON(),
//       explorerName: msg.explorer ? msg.explorer.name : null,
//       businessName: msg.business ? msg.business.name : null,
//     }));

//     return res.status(200).json(formattedHistory);
//   } catch (error) {
//     console.error('Error fetching chat history:', error);
//     return res.status(500).json({ error: 'Failed to fetch chat history' });
//   }
// };

const deleteMessage = async (req, res) => {
  const { idchat } = req.params;

  try {
    const deleted = await db.Chat.destroy({
      where: { idchat },
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
