// notif.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Sequelize instance

const Notif = sequelize.define('notif', {
  idnotif: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: DataTypes.STRING
});

module.exports = Notif;
