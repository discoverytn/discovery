// chat.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Sequelize instance

const Chat = sequelize.define('chat', {
  idchat: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  body: DataTypes.TEXT
});

module.exports = Chat;
