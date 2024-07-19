const db = require('../database/index');
const io = require('../ChatServer/index');

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
            explorerName: explorer.username,
            businessName: business.username,
        };

        io.to(roomName).emit('receive-message', newMessageData);

        return res.status(201).json(newMessageData);
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
};

const getMessages = async (req, res) => {
    const { explorer_idexplorer, business_idbusiness } = req.query;

    if (!explorer_idexplorer || !business_idbusiness) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const messages = await db.Chat.findAll({
            where: {
                explorer_idexplorer: parseInt(explorer_idexplorer),
                business_idbusiness: parseInt(business_idbusiness),
            },
            order: [['createdAt', 'ASC']],
            include: [
                { model: db.Explorer, attributes: ['username'], as: 'Explorer' },
                { model: db.Business, attributes: ['username'], as: 'Business' },
            ],
        });

        const formattedMessages = messages.map((msg) => ({
            idchat: msg.idchat,
            message: msg.message,
            explorer_idexplorer: msg.explorer_idexplorer,
            business_idbusiness: msg.business_idbusiness,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
            explorerName: msg.Explorer ? msg.Explorer.username : null,
            businessName: msg.Business ? msg.Business.username : null,
        }));

        return res.status(200).json(formattedMessages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
    }
};



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