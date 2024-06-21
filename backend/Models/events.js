const { DataTypes } = require('sequelize');
const sequelize = require('../database/index.js'); 

const Events = sequelize.define('events', {
  idevents: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  eventName: DataTypes.STRING,
  desc: DataTypes.STRING,
  eventDate: DataTypes.STRING,
  price: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Free"
  }
});

module.exports = Events;
