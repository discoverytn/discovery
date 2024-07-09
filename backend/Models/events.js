const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Events', {
    idevents: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventName: DataTypes.STRING,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    eventDescription: DataTypes.TEXT,
    eventPrice: DataTypes.INTEGER,
    eventLocation: DataTypes.STRING,
    image: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    explorer_idexplorer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Explorers', 
        key: 'idexplorer',
      }
    },
    business_idbusiness: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', 
        key: 'idbusiness',
      }
    }
  });
};
