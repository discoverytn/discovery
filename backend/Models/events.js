const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Events', {
    idevents: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventName: DataTypes.STRING,
    eventDate: DataTypes.DATE,
    Explorer_idexplorer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Explorers', 
        key: 'idexplorer',
      }
    },
    Business_idbusiness: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', 
        key: 'idbusiness',
      }
    }
  });
};
