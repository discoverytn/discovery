const db = require('../database/index');
const Explorer = require('../Models/explorer');
const Business = require('../Models/business');
const Chat = require('../Models/chat')(db.sequelize)
const { Op } = require('sequelize');

const sendMessage = async (req, res) => {
    const { idexplorer, idbusiness, message } = req.body;

    try {
        const newMessage = await db.Chat.create({
            explorer_idexplorer: idexplorer,
            business_idbusiness: idbusiness,
            message: message
        });

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
}

const getMessages = async (req, res) => {
    const { idexplorer, idbusiness } = req.params;
    if (!idexplorer || !idbusiness) {
        return res.status(400).json({ error: 'Explorer ID and Business ID are required' });
    }
    try {
        const messages = await Chat.findAll({
            where: {
                    explorer_idexplorer: idexplorer, business_idbusiness: idbusiness ,
      
                
            },
            include: [
                { model: db.Explorer, as: 'ExplorerInfo' },
                { model: db.Business, as: 'BusinessInfo' }
            ],
            order: [['createdAt', 'ASC']],
        });

        return res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ error: 'Failed to fetch messages' });
    }
};
    
    // const { explorer_idexplorer, business_idbusiness } = req.params;

    // try {
    //     const messages = await Chat.findAll({
    //         where: {
    //             [Op.or]: [
    //                 {
    //                     explorer_idexplorer,
    //                     business_idbusiness,
    //                 },
    //                 {
    //                     explorer_idexplorer: business_idbusiness,
    //                     business_idbusiness: explorer_idexplorer,
    //                 },
    //             ],
    //         },
    //         include: [
    //             { model: Explorer, as: 'ExplorerInfo' },
    //             { model: Business, as: 'BusinessInfo' }
//             ],
//             order: [['createdAt', 'ASC']],
//         });

//         return res.status(200).json(messages);
//     } catch (error) {
//         console.error('Error fetching messages:', error);
//         return res.status(500).json({ error: 'Failed to fetch messages' });
//     }
// };

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
}

module.exports = { sendMessage, getMessages, deleteMessage }